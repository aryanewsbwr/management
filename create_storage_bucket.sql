-- ==============================================================================
-- Aryan News Agency (आर्यन न्यूज़ एजेंसी) - Supabase Storage Bucket Setup
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create news-images bucket in Supabase Storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public viewing of news images
DROP POLICY IF EXISTS "Public can view news images" ON storage.objects;
CREATE POLICY "Public can view news images"
ON storage.objects FOR SELECT
USING (bucket_id = 'news-images');

-- 3. Allow authenticated admin to upload news images
DROP POLICY IF EXISTS "Authenticated can upload news images" ON storage.objects;
CREATE POLICY "Authenticated can upload news images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-images' AND (auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

-- 4. Allow authenticated admin to update news images
DROP POLICY IF EXISTS "Authenticated can update news images" ON storage.objects;
CREATE POLICY "Authenticated can update news images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'news-images' AND (auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com')
WITH CHECK (bucket_id = 'news-images' AND (auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

-- 5. Allow authenticated admin to delete news images
DROP POLICY IF EXISTS "Authenticated can delete news images" ON storage.objects;
CREATE POLICY "Authenticated can delete news images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news-images' AND (auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');
