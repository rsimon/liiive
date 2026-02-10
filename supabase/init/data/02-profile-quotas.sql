CREATE TABLE profile_quotas (
  user_id UUID PRIMARY KEY REFERENCES profile(id) ON DELETE CASCADE,
  permanent_rooms_limit INT NOT NULL DEFAULT 1,
  annotations_limit INT,
  annotations_used INT
);

-- profile_quotas RLS policies
ALTER TABLE profile_quotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can see their own room quotas" ON profile_quotas
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE OR REPLACE FUNCTION set_default_profile_quotas()
RETURNS 
  TRIGGER 
  SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO profile_quotas (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_quotas_after_insert_profile
  AFTER INSERT ON profile
  FOR EACH ROW
  EXECUTE FUNCTION set_default_profile_quotas();