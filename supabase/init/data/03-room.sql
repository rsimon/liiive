-- room table
CREATE TABLE room (
  id TEXT PRIMARY KEY,
  iiif_content TEXT,
  iiif_type TEXT CHECK (iiif_type IN ('IMAGE', 'MANIFEST')),
  major_version INT,
  thumbnail TEXT,
  pages INT,
  name TEXT,
  created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  owner uuid REFERENCES profile(id) DEFAULT auth.uid(),
  time_limit_hours INT,
  paused_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_private BOOLEAN DEFAULT false,
  is_readonly BOOLEAN DEFAULT false
);

-- room RLS policies
ALTER TABLE room ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read public, owned, and approved rooms" ON room
  FOR SELECT
  USING (
    owner IS NULL OR
    is_private = false OR                     
    owner = (SELECT auth.uid())
);

CREATE POLICY "anyone can create rooms" ON room
  FOR INSERT
  WITH CHECK (
    owner IS NULL OR 
    owner = (SELECT auth.uid())
  );

CREATE POLICY "users can update own or unclaimed rooms" ON room 
  FOR UPDATE 
  USING (
    owner IS NULL OR   -- allow updates to unowned rooms
    owner = (SELECT auth.uid()) -- allow updates to owned rooms
  )
  WITH CHECK (
    (owner IS NULL OR owner = (SELECT auth.uid())) AND -- ensure 'owner' can only be set to NULL or the user's ID
    (time_limit_hours IS NULL OR time_limit_hours = 24) -- ensure 'time_limit_hours' is NULL or 24
  );

CREATE POLICY "users can only delete their own rooms" ON room
  FOR DELETE
  USING (
    owner IS NULL OR   -- allow deletion of unowned rooms
    owner = (SELECT auth.uid()) -- allow deletion of owned rooms
  );

-- function to set the default room time limit
CREATE OR REPLACE FUNCTION set_room_time_limit()
RETURNS 
  TRIGGER 
  SET search_path = ''
AS $$
BEGIN
  -- Check if the user is logged in (auth.uid() is not NULL)
  IF auth.uid() IS NOT NULL THEN
    NEW.time_limit_hours := 24; -- Logged-in users get 24 hours
  ELSE
    NEW.time_limit_hours := 4;  -- Anonymous users get 4 hours
  END IF;

  -- Set expires_at based on the time_limit_hours
  IF NEW.time_limit_hours IS NOT NULL THEN
    NEW.expires_at := CURRENT_TIMESTAMP + (NEW.time_limit_hours || ' hours')::INTERVAL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- trigger to set the default room time limit
CREATE TRIGGER set_room_time_limit_before_insert
BEFORE INSERT ON room
FOR EACH ROW
EXECUTE FUNCTION set_room_time_limit();

-- cron job to remove expired rooms
CREATE OR REPLACE FUNCTION delete_expired_rooms()
RETURNS 
  void 
  SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM room
  WHERE time_limit_hours IS NOT NULL -- Exclude rooms with infinite lifetime
    AND expires_at < (CURRENT_TIMESTAMP - INTERVAL '1 hour');
END;
$$ LANGUAGE plpgsql;

-- https://github.com/orgs/supabase/discussions/7067
CREATE OR REPLACE FUNCTION cleanup_room_storage()
RETURNS 
  TRIGGER
  SET search_path = extensions,public
AS $$
DECLARE
  storage_url text := 'https://YOUR_PROJECT_REF.supabase.co/storage/v1';
  service_key text := 'YOUR_SERVICE_ROLE_KEY';
BEGIN
  PERFORM http((
    'DELETE',
    concat(storage_url, '/object/annotations/', OLD.id),
    ARRAY[
      http_header('Authorization', 'Bearer ' || service_key),
      http_header('Content-Type', 'application/json')
    ],
    NULL,
    NULL)::extensions.http_request
  );

  RETURN OLD;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent room deletion
    RAISE WARNING 'Failed to delete storage for room %: %', OLD.id, SQLERRM;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER clear_annotation_after_room_deletion
  AFTER DELETE
  ON room
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_room_storage();

-- run every hour
-- SELECT cron.unschedule('delete_expired_rooms');
SELECT cron.schedule('delete_expired_rooms', '0 * * * *', 'SELECT delete_expired_rooms()');

-- cron job to remove cron logs older than 2 weeks
CREATE OR REPLACE FUNCTION purge_cron_job_logs()
RETURNS 
  void 
  SET search_path = ''
AS $$
BEGIN
  DELETE FROM cron.job_run_details
  WHERE end_time < CURRENT_TIMESTAMP - INTERVAL '10 minutes';
END;
$$ LANGUAGE plpgsql;

-- run weekly, every SUN midnight
-- SELECT cron.unschedule('purge_cron_job_logs');
SELECT cron.schedule('purge_cron_job_logs', '0 0 * * SUN', 'SELECT purge_cron_job_logs()');

-- function to access a room - will handle room_access and room_permission tables
CREATE OR REPLACE FUNCTION access_room(room TEXT)
RETURNS 
  TABLE (
    -- Room columns 
    id TEXT,
    name TEXT,
    iiif_content TEXT,
    created TIMESTAMP WITH TIME ZONE,
    owner UUID,

    -- Profile columns
    owner_name TEXT,
    owner_avatar TEXT,

    -- Room columngs
    time_limit_hours INT,
    paused_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_private BOOLEAN,
    is_readonly BOOLEAN,

    -- Room Access columns
    last_accessed TIMESTAMP WITH TIME ZONE,

    -- Room Permission columns
    permission TEXT
  )
  SET search_path = 'public'
AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    -- Upsert the room_access record
    INSERT INTO room_access (room_id, user_id, last_accessed)
    VALUES (
      room,
      auth.uid(),
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (room_id, user_id) DO UPDATE
    SET last_accessed = CURRENT_TIMESTAMP;

    -- Upsert the room_permission record
    INSERT INTO room_permission (room_id)
    VALUES (room)
    ON CONFLICT (room_id, user_id) DO NOTHING; -- If it exists, no changes are made
  END IF;

  -- Return the room data with access and permission information
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.iiif_content,
    r.created,
    r.owner,
    p.display_name AS owner_name,
    p.avatar AS owner_avatar,
    r.time_limit_hours,
    r.paused_at,
    r.expires_at,
    r.is_private,
    r.is_readonly,
    ra.last_accessed,
    rp.permission
  FROM room r
  LEFT JOIN room_access ra ON r.id = ra.room_id AND ra.user_id = auth.uid()
  LEFT JOIN room_permission rp ON r.id = rp.room_id AND rp.user_id = auth.uid()
  LEFT JOIN profile p ON r.owner = p.id
  WHERE r.id = room
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- function to access a room - will handle room_access and room_permission tables
CREATE OR REPLACE FUNCTION list_my_rooms()
RETURNS 
  TABLE (
    -- Room columns 
    id TEXT,
    name TEXT,
    iiif_content TEXT,
    created TIMESTAMP WITH TIME ZONE,
    owner UUID,
    -- Profile columns
    owner_name TEXT,
    owner_avatar TEXT,
    time_limit_hours INT,
    paused_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_private BOOLEAN,
    is_readonly BOOLEAN,

    -- Room Access columns
    last_accessed TIMESTAMP WITH TIME ZONE,

    -- Room Permission columns
    permission TEXT
  ) 
  SET search_path = 'public'
AS $$
BEGIN
  -- Return the room data with access and permission information
  RETURN QUERY
  SELECT 
    room.id,
    room.name,
    room.iiif_content,
    room.created,
    room.owner,
    owner.display_name AS owner_name,
    owner.avatar AS owner_avatar,
    room.time_limit_hours,
    room.paused_at,
    room.expires_at,
    room.is_private,
    room.is_readonly,
    room_access.last_accessed, 
    room_permission.permission
  FROM 
    room
  LEFT JOIN 
    profile owner ON room.owner = owner.id
  LEFT JOIN 
    room_access ON room.id = room_access.room_id AND room_access.user_id = auth.uid()
  LEFT JOIN 
    room_permission ON room.id = room_permission.room_id AND room_permission.user_id = auth.uid()
  WHERE 
    room.owner = auth.uid() OR 
    EXISTS (
      SELECT 1 
      FROM room_access 
      WHERE room_access.room_id = room.id
    );
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

CREATE OR REPLACE FUNCTION handle_time_limit_change()
RETURNS 
  TRIGGER
  SET search_path = ''
AS $$
BEGIN
  -- Only proceed if the value of time_limit_hours has changed
  IF NEW.time_limit_hours IS DISTINCT FROM OLD.time_limit_hours THEN
    -- If time_limit_hours is set to NULL, pause the room
    IF NEW.time_limit_hours IS NULL THEN
      NEW.paused_at = CURRENT_TIMESTAMP;

    -- If time_limit_hours was NULL and is now non-NULL, unpause the room
    ELSIF OLD.time_limit_hours IS NULL AND NEW.time_limit_hours IS NOT NULL THEN
      NEW.expires_at = OLD.expires_at + (CURRENT_TIMESTAMP - OLD.paused_at);
      NEW.paused_at = NULL;

    -- If changing between different non-NULL values
    ELSIF OLD.time_limit_hours IS NOT NULL THEN
      NEW.expires_at = NEW.created + (NEW.time_limit_hours || ' hours')::interval;
      NEW.paused_at = NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER time_limit_change_trigger
BEFORE UPDATE OF time_limit_hours ON room
FOR EACH ROW
EXECUTE FUNCTION handle_time_limit_change();