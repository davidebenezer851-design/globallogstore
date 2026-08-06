REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fund_wallet(NUMERIC) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.fund_wallet(NUMERIC) TO authenticated;

CREATE POLICY "Log images are viewable" ON storage.objects FOR SELECT USING (bucket_id = 'log-images');
CREATE POLICY "Users upload own log images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'log-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own log images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'log-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own log images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'log-images' AND (storage.foldername(name))[1] = auth.uid()::text);