-- profile table
CREATE TABLE profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  created TIMESTAMPTZ DEFAULT NOW(),
  display_name TEXT,
  avatar TEXT
);

-- profile RLS policies
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read profiles" ON profile
  FOR SELECT
  USING (true);

-- function to sync a new profile with an auth.users record 
CREATE OR REPLACE FUNCTION sync_profile()
RETURNS 
  TRIGGER 
  SET search_path = ''
AS $$
DECLARE
  extracted_name text;
  extracted_avatar text;
BEGIN
  -- Safely extract display name with fallback
  extracted_name := COALESCE(
    NEW.raw_user_meta_data->>'name', 
    NEW.email,  -- Fallback to email if no name
    'User_' || substring(NEW.id::text from 1 for 8)  -- Fallback generated name
  );

  extracted_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'avatar',
    NULL
  );

  INSERT INTO public.profile (id, display_name, avatar)
  VALUES (NEW.id, extracted_name, extracted_avatar)
  ON CONFLICT (id) DO UPDATE
  SET display_name = EXCLUDED.display_name;
  
  RETURN NEW;
EXCEPTION 
  WHEN OTHERS THEN
    -- Log the error or handle it appropriately
    RAISE WARNING 'Error syncing profile for user %', NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- trigger to update the profile from the auth.users
CREATE TRIGGER sync_profile_after_insert
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION sync_profile();