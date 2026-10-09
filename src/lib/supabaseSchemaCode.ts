export const SUPABASE_SQL_SCHEMA = `-- =========================================================================
-- SQL SCHEMA FOR SUPABASE DATABASE (Sanambio Maroc - المتجر الإلكتروني)
-- Project URL: https://ecowrkizfpmcpsyzvvze.supabase.co
-- =========================================================================
-- تعليمات التشغيل السريع:
-- 1. افتح الرابط التالي: https://supabase.com/dashboard/project/ecowrkizfpmcpsyzvvze/sql
-- 2. اضغط على "New query"
-- 3. الصق هذا الكود بالكامل واضغط على "RUN"
-- =========================================================================

-- تفعيل ملحق توليد المعرفات الفريدة UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. ORDERS TABLE (جدول الطلبات)
-- يحفظ جميع الطلبات الواردة من صفحة العرض مع كافة التفاصيل
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    customer JSONB NOT NULL DEFAULT '{}'::jsonb,
    payment_method TEXT DEFAULT 'cod',
    subtotal NUMERIC DEFAULT 0,
    shipping NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'new',
    status_note TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);

-- -------------------------------------------------------------------------
-- 2. CUSTOMERS TABLE (جدول الزبائن)
-- يحفظ قاعدة بيانات العملاء تلقائياً لتتبع المشتريات والمدن
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT,
    address TEXT,
    total_orders INTEGER DEFAULT 1,
    total_spent NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers (phone);

-- -------------------------------------------------------------------------
-- 3. STORE SETTINGS TABLE (جدول إعدادات وتخصيص المتجر وصفحة العرض)
-- يحفظ أرقام الهاتف والواتساب والنصوص والوسائط ورمز الأدمن ومفتاح الذكاء الاصطناعي
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    store_name TEXT DEFAULT 'Sanambio Maroc',
    store_slogan TEXT DEFAULT 'دهن سنام الجمل الطبيعي 100% الأصلي',
    hero_headline TEXT DEFAULT 'تخلص نهائياً من آلام المفاصل والظهر واستعد حريتك في الحركة بدون ألم',
    hero_subheadline TEXT DEFAULT 'التركيبة الصحراوية الأصلية المستخلصة من دهن سنام الجمل الطبيعي 100%، فعالية مثبتة في تخفيف الالتهابات، خشونة الركبة، وعرق النسا (بوزلوم) من أول أسبوع.',
    phone TEXT DEFAULT '+212 661-894520',
    whatsapp TEXT DEFAULT '+212661894520',
    announcement_text TEXT DEFAULT '🔥 عرض خاص اليوم فقط: تخفيض يصل إلى 50% + توصيل بالمجان والدفع بعد استلام وفحص المنتج في جميع مدن المغرب',
    currency TEXT DEFAULT 'درهم',
    free_shipping_threshold NUMERIC DEFAULT 0,
    admin_pin TEXT DEFAULT '1234',
    video_url TEXT DEFAULT 'https://assets.mixkit.co/videos/preview/mixkit-doctor-explaining-a-treatment-41846-large.mp4',
    anatomy_image_url TEXT DEFAULT 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/joint_relief_anatomical.jpg',
    desert_bg_image_url TEXT DEFAULT 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/hero_camel_balm_desert.jpg',
    facebook_pixel_id TEXT DEFAULT '',
    tiktok_pixel_id TEXT DEFAULT '',
    gemini_api_key TEXT DEFAULT '',
    ai_bot_settings JSONB DEFAULT '{}'::jsonb,
    media JSONB DEFAULT '{}'::jsonb,
    payment_settings JSONB DEFAULT '{}'::jsonb,
    pixel_settings JSONB DEFAULT '{}'::jsonb,
    about_story_p1 TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ترقية الجدول التلقائية لإضافة الأعمدة الجديدة إن كانت القاعدة منشأة سابقاً
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS admin_pin TEXT DEFAULT '1234';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS hero_headline TEXT DEFAULT 'تخلص نهائياً من آلام المفاصل والظهر واستعد حريتك في الحركة بدون ألم';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS hero_subheadline TEXT DEFAULT 'التركيبة الصحراوية الأصلية المستخلصة من دهن سنام الجمل الطبيعي 100%، فعالية مثبتة في تخفيف الالتهابات، خشونة الركبة، وعرق النسا (بوزلوم) من أول أسبوع.';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT 'https://assets.mixkit.co/videos/preview/mixkit-doctor-explaining-a-treatment-41846-large.mp4';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS anatomy_image_url TEXT DEFAULT 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/joint_relief_anatomical.jpg';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS desert_bg_image_url TEXT DEFAULT 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/hero_camel_balm_desert.jpg';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS facebook_pixel_id TEXT DEFAULT '';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS tiktok_pixel_id TEXT DEFAULT '';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS gemini_api_key TEXT DEFAULT '';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS ai_bot_settings JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS payment_settings JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS pixel_settings JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS about_story_p1 TEXT;

-- إدراج وتحديث الإعدادات الأساسية
INSERT INTO public.store_settings (
    id, 
    store_name, 
    store_slogan, 
    phone, 
    whatsapp, 
    announcement_text, 
    currency, 
    free_shipping_threshold,
    admin_pin,
    video_url,
    anatomy_image_url,
    desert_bg_image_url
) VALUES (
    'main',
    'Sanambio Maroc',
    'دهن سنام الجمل الطبيعي 100% الأصلي',
    '+212 661-894520',
    '+212661894520',
    '🔥 عرض خاص اليوم فقط: تخفيض يصل إلى 50% + توصيل بالمجان والدفع بعد استلام وفحص المنتج في جميع مدن المغرب',
    'درهم',
    0,
    '1234',
    'https://assets.mixkit.co/videos/preview/mixkit-doctor-explaining-a-treatment-41846-large.mp4',
    'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/joint_relief_anatomical.jpg',
    'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/hero_camel_balm_desert.jpg'
) ON CONFLICT (id) DO UPDATE SET 
    admin_pin = COALESCE(public.store_settings.admin_pin, '1234');

-- -------------------------------------------------------------------------
-- 4. ADMIN AUTH TABLE (جدول أمان ورمز الدخول للوحة تحكم الأدمن)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_auth (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    pin_code TEXT NOT NULL DEFAULT '1234',
    username TEXT DEFAULT 'admin',
    last_login TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.admin_auth (id, pin_code, username)
VALUES ('primary', '1234', 'admin')
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 5. OFFERS TABLE (جدول باقات وعروض المنتجات)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.offers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    quantity INTEGER DEFAULT 1,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    discount_percent INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT false,
    is_best_value BOOLEAN DEFAULT false,
    badge_text TEXT,
    gifts JSONB DEFAULT '[]'::jsonb,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.offers (
    id, title, subtitle, description, quantity, price, original_price, discount_percent, is_popular, is_best_value, badge_text, gifts, sort_order
) VALUES 
(
    'offer-1',
    'علبة واحدة (100ml)',
    'تجربة العلاج الأولية',
    'تكفي لمدة 3 إلى 4 أسابيع من الاستعمال المنتظم لتخفيف الآلام اليومية',
    1,
    199,
    299,
    33,
    false,
    false,
    'تجربة أولية',
    '["توصيل مجاني لجميع المدن"]'::jsonb,
    1
),
(
    'offer-2',
    '2 علب + هدية مجانية',
    'كورس العلاج المكثف',
    'كورس موصى به لتخفيف الاحتكاك وتسكين آلام المفاصل والظهر.',
    2,
    299,
    598,
    50,
    false,
    false,
    'تخفيض 50%',
    '["صابونة الكبريت والأعشاب الطبيعية مجاناً 🎁"]'::jsonb,
    2
),
(
    'offer-3',
    '4 علب + علبة مجاناً (5 علب)',
    'الباقة العائلية الاقتصادية الكبرى (العلاج الجذري المتكامل)',
    'العرض الأقوى والأوفر على الإطلاق: كورس علاجي متكامل ومثالي للاستخدام العائلي أو لحالات الآلام المزمنة الشديدة لضمان الشفاء التام وحماية الغضاريف على المدى الطويل.',
    5,
    399,
    995,
    60,
    true,
    true,
    'الباقة الأساسية الأوفر والأكثر طلباً 🔥',
    '["علبة خامسة مجاناً + صابونة الأعشاب الطبيعية 🎁", "توصيل سريع مجاني VIP"]'::jsonb,
    3
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    quantity = EXCLUDED.quantity,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percent = EXCLUDED.discount_percent,
    is_popular = EXCLUDED.is_popular,
    is_best_value = EXCLUDED.is_best_value,
    badge_text = EXCLUDED.badge_text,
    gifts = EXCLUDED.gifts,
    sort_order = EXCLUDED.sort_order;

-- -------------------------------------------------------------------------
-- 6. REVIEWS TABLE (جدول تقييمات وآراء الزبائن)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_name TEXT NOT NULL,
    city TEXT DEFAULT 'المغرب',
    rating INTEGER DEFAULT 5,
    comment TEXT NOT NULL,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.reviews (author_name, city, rating, comment, verified) VALUES
('الحاج أحمد العمراني', 'فاس', 5, 'والله العظيم من أول أسبوع حسيت براحة كبيرة في الركبة ديالي بعدما عييت من الأدوية. منتج طبيعي وأصيل الله يجازيكم بخير.', true),
('فاطمة الزهراء ب.', 'الدار البيضاء', 5, 'شريتو للوالدة كتعاني من آلام أسفل الظهر وبوزلوم، الحمد لله دابا ولات كتمشى مرتاحة. التوصيل كان في 24 ساعة.', true),
('عبد الرحيم التازي', 'مراكش', 5, 'جودة ممتازة ورائحة الأعشاب الطبيعية طيبة بزاف، خديت باقة 3 علب والتخفيض كان ممتاز مع الهدايا.', true),
('سعاد العلمي', 'طنجة', 5, 'منتج فعال جداً لخشونة الركبة والمفاصل، وخدمة الزبناء في الواتساب جد محترمة وسريعة.', true)
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------------------
-- 7. COUPONS TABLE (جدول كوبونات الخصم)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT DEFAULT 'percentage',
    discount_value NUMERIC NOT NULL,
    min_order_amount NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    max_uses INTEGER DEFAULT 1000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to orders for anon" ON public.orders;
DROP POLICY IF EXISTS "Allow all access to customers for anon" ON public.customers;
DROP POLICY IF EXISTS "Allow all access to store_settings for anon" ON public.store_settings;
DROP POLICY IF EXISTS "Allow all access to admin_auth for anon" ON public.admin_auth;
DROP POLICY IF EXISTS "Allow all access to offers for anon" ON public.offers;
DROP POLICY IF EXISTS "Allow all access to reviews for anon" ON public.reviews;
DROP POLICY IF EXISTS "Allow all access to coupons for anon" ON public.coupons;

CREATE POLICY "Allow all access to orders for anon" ON public.orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to customers for anon" ON public.customers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to store_settings for anon" ON public.store_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to admin_auth for anon" ON public.admin_auth FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to offers for anon" ON public.offers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to reviews for anon" ON public.reviews FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to coupons for anon" ON public.coupons FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- -------------------------------------------------------------------------
-- 9. GRANT FULL PERMISSIONS TO anon, authenticated & service_role
-- -------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role, postgres;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role, postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role, postgres;

-- -------------------------------------------------------------------------
-- 10. REALTIME REPLICATION
-- -------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'store_settings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'admin_auth'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_auth;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'offers'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.offers;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'reviews'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'coupons'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.coupons;
    END IF;
END $$;

-- -------------------------------------------------------------------------
-- 11. SUPABASE STORAGE (سلة تخزين الوسائط والصور وفيديوهات الدكتور)
-- -------------------------------------------------------------------------
-- إنشاء سلة التخزين store_media إن لم تكن موجودة وجعلها عامة (Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'store_media',
    'store_media',
    true,
    104857600, -- 100MB للصور والفيديوهات
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime', 'video/ogg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 104857600,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime', 'video/ogg'];

-- سياسات الوصول لسلة التخزين store_media (قراءة ورفع وتعديل وحذف للجميع)
DROP POLICY IF EXISTS "Public Access for store_media" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload for store_media" ON storage.objects;
DROP POLICY IF EXISTS "Public Update for store_media" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete for store_media" ON storage.objects;

CREATE POLICY "Public Access for store_media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'store_media');

CREATE POLICY "Public Upload for store_media"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'store_media');

CREATE POLICY "Public Update for store_media"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'store_media');

CREATE POLICY "Public Delete for store_media"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'store_media');
`;
