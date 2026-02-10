-- room_access table
CREATE TABLE room_access (
  room_id text REFERENCES room(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profile(id) ON DELETE CASCADE DEFAULT auth.uid(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (room_id, user_id)
);

-- room_access RLS policies
ALTER TABLE room_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can create a new room access record" ON room_access
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "users can see their own room access entries" ON room_access
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "users can update their own room access entries" ON room_access
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "users can delete their own room access entries" ON room_access
  FOR DELETE
  USING ((SELECT auth.uid()) = user_id);