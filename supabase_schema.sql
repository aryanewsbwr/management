-- ==============================================================================
-- Aryan News Agency (आर्यन न्यूज़ एजेंसी) - Supabase Database Schema & RLS Policies
-- Run this entire script in your Supabase project's SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. ARTICLES TABLE (Admin published articles e.g., Beawar local news)
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
    title_hi TEXT NOT NULL,
    title_en TEXT,
    summary_hi TEXT,
    summary_en TEXT,
    content_hi TEXT NOT NULL,
    content_en TEXT,
    category TEXT NOT NULL DEFAULT 'beawar',
    image TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    author TEXT DEFAULT 'आर्यन ब्यूरो, ब्यावर',
    is_hero BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_breaking BOOLEAN DEFAULT FALSE,
    read_time TEXT DEFAULT '2 मिनट',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. MANDI RATES TABLE (Beawar Krishi Upaj Mandi bhav)
CREATE TABLE IF NOT EXISTS public.mandi_rates (
    id TEXT PRIMARY KEY,
    crop_hi TEXT NOT NULL,
    crop_en TEXT,
    min_price INTEGER NOT NULL,
    max_price INTEGER NOT NULL,
    unit TEXT DEFAULT '₹/क्विंटल',
    trend TEXT DEFAULT 'stable',
    change TEXT DEFAULT 'स्थिर',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. BREAKING NEWS TABLE (Live headline ticker)
CREATE TABLE IF NOT EXISTS public.breaking_news (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. SEED INITIAL MANDI COMMODITIES (If table is empty)
INSERT INTO public.mandi_rates (id, crop_hi, crop_en, min_price, max_price, unit, trend, change, updated_at)
VALUES
    ('m1', 'सफेद तिल (तिलपत्ती ग्रेड)', 'White Sesame', 12200, 13800, '₹/क्विंटल', 'up', '+₹150', now()),
    ('m2', 'देशी सौंफ (सुपर ग्रीन)', 'Fennel Seeds', 10400, 15200, '₹/क्विंटल', 'up', '+₹220', now()),
    ('m3', 'जीरा मशीन क्लीन', 'Cumin (Jeera)', 24500, 28900, '₹/क्विंटल', 'down', '-₹180', now()),
    ('m4', 'गेहूं (टुकड़ी उत्तम)', 'Wheat', 2600, 2850, '₹/क्विंटल', 'stable', 'स्थिर', now()),
    ('m5', 'सरसों 42% तेल', 'Mustard Seeds', 5200, 5750, '₹/क्विंटल', 'up', '+₹80', now()),
    ('m6', 'चना देशी', 'Gram / Chana', 5900, 6350, '₹/क्विंटल', 'stable', 'स्थिर', now()),
    ('m7', 'कपास (नरमा)', 'Cotton', 6900, 7550, '₹/क्विंटल', 'up', '+₹110', now()),
    ('m8', 'ज्वार / बाजरा', 'Millet', 2150, 2400, '₹/क्विंटल', 'stable', 'स्थिर', now())
ON CONFLICT (id) DO NOTHING;

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandi_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breaking_news ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES: PUBLIC READ ACCESS (Anyone can read news & mandi rates)
DROP POLICY IF EXISTS "Public can view articles" ON public.articles;
CREATE POLICY "Public can view articles" 
ON public.articles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Public can view mandi rates" ON public.mandi_rates;
CREATE POLICY "Public can view mandi rates" 
ON public.mandi_rates FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Public can view breaking news" ON public.breaking_news;
CREATE POLICY "Public can view breaking news" 
ON public.breaking_news FOR SELECT 
USING (true);

-- 7. RLS POLICIES: ADMIN-ONLY WRITE ACCESS (Only ananews@aryannewsagency.com can insert/update/delete)
DROP POLICY IF EXISTS "Authenticated can insert articles" ON public.articles;
CREATE POLICY "Authenticated can insert articles" 
ON public.articles FOR INSERT 
TO authenticated 
WITH CHECK ((auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

DROP POLICY IF EXISTS "Authenticated can update articles" ON public.articles;
CREATE POLICY "Authenticated can update articles" 
ON public.articles FOR UPDATE 
TO authenticated 
USING ((auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com') 
WITH CHECK ((auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

DROP POLICY IF EXISTS "Authenticated can delete articles" ON public.articles;
CREATE POLICY "Authenticated can delete articles" 
ON public.articles FOR DELETE 
TO authenticated 
USING ((auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

DROP POLICY IF EXISTS "Authenticated can insert mandi rates" ON public.mandi_rates;
CREATE POLICY "Authenticated can insert mandi rates" 
ON public.mandi_rates FOR INSERT 
TO authenticated 
WITH CHECK ((auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

DROP POLICY IF EXISTS "Authenticated can update mandi rates" ON public.mandi_rates;
CREATE POLICY "Authenticated can update mandi rates" 
ON public.mandi_rates FOR UPDATE 
TO authenticated 
USING ((auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com') 
WITH CHECK ((auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

DROP POLICY IF EXISTS "Authenticated can delete mandi rates" ON public.mandi_rates;
CREATE POLICY "Authenticated can delete mandi rates" 
ON public.mandi_rates FOR DELETE 
TO authenticated 
USING ((auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

DROP POLICY IF EXISTS "Authenticated can insert breaking news" ON public.breaking_news;
CREATE POLICY "Authenticated can insert breaking news" 
ON public.breaking_news FOR INSERT 
TO authenticated 
WITH CHECK ((auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

DROP POLICY IF EXISTS "Authenticated can update breaking news" ON public.breaking_news;
CREATE POLICY "Authenticated can update breaking news" 
ON public.breaking_news FOR UPDATE 
TO authenticated 
USING ((auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com') 
WITH CHECK ((auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

DROP POLICY IF EXISTS "Authenticated can delete breaking news" ON public.breaking_news;
CREATE POLICY "Authenticated can delete breaking news" 
ON public.breaking_news FOR DELETE 
TO authenticated 
USING ((auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

-- 8. STORAGE BUCKET FOR ARTICLE IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public can view images
DROP POLICY IF EXISTS "Public can view news images" ON storage.objects;
CREATE POLICY "Public can view news images"
ON storage.objects FOR SELECT
USING (bucket_id = 'news-images');

-- Storage RLS: Admin-only upload/update/delete images
DROP POLICY IF EXISTS "Authenticated can upload news images" ON storage.objects;
CREATE POLICY "Authenticated can upload news images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-images' AND (auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

DROP POLICY IF EXISTS "Authenticated can update news images" ON storage.objects;
CREATE POLICY "Authenticated can update news images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'news-images' AND (auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com')
WITH CHECK (bucket_id = 'news-images' AND (auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');

DROP POLICY IF EXISTS "Authenticated can delete news images" ON storage.objects;
CREATE POLICY "Authenticated can delete news images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news-images' AND (auth.jwt() ->> 'email') = 'ananews@aryannewsagency.com');
