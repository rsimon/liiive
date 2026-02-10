-- room_permission table
CREATE TABLE room_permission (
  room_id text REFERENCES room(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profile(id) ON DELETE CASCADE DEFAULT auth.uid(),
  updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  permission TEXT CHECK (permission IN ('approved', 'declined')),
  PRIMARY KEY (room_id, user_id)
);

-- room_permission RLS policies
ALTER TABLE room_permission ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can create an empty room permission for themselves" ON room_permission
  FOR INSERT
  WITH CHECK (
    user_id = (SELECT auth.uid()) AND
    permission IS NULL
  );

CREATE POLICY "users can see their own room permissions" ON room_permission
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "only room owners can update permissions" ON room_permission
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM room
      WHERE room.id = room_permission.room_id
        AND room.owner = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM room
      WHERE room.id = room_permission.room_id
        AND room.owner = (SELECT auth.uid())
    )
  );

CREATE POLICY "room owners can see permissions for their rooms" ON room_permission
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM room
      WHERE room.id = room_permission.room_id
        AND room.owner = (SELECT auth.uid())
    )
  );