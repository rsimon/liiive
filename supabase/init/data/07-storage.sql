CREATE POLICY "No public access to storage"
  ON storage.objects
  FOR ALL
  USING (false);