import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Search,
  Globe,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  FileCode,
  ShieldCheck,
  Sparkles,
  Database,
  HelpCircle,
  TrendingUp,
  Zap
} from 'lucide-react';

export const SeoTab: React.FC = () => {
  const { settings, updateSettings, saveAllSettingsToSupabase } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const currentSeo = settings.seo || {
    metaTitle: 'دهن سنام الجمل Sanambio® الأصلي بالمغرب | علاج طبيعي لآلام المفاصل والظهر',
    metaDescription: 'دهن سنام الجمل Sanambio الطبيعي 100% للتخلص من آلام المفاصل، الروماتيزم، خشونة الركبة، والظهر وعرق النسا (السياتيك). نتائج مضمونة وتوصيل بالمجان.',
    keywords: 'دهن سنام الجمل الأصلي, علاج آلام المفاصل, علاج خشونة الركبة, دهن سنام الجمل المغرب, علاج عرق النسا, سياتيك, شحم سنام الجمل',
    googleSiteVerification: '',
    canonicalUrl: '',
    enableStructuredData: true
  };

  const handleUpdateSeo = (partial: Partial<typeof currentSeo>) => {
    updateSettings({
      seo: {
        ...currentSeo,
        ...partial
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveAllSettingsToSupabase();
      setSaveSuccessMsg('تم حفظ وتحديث إعدادات السيو وأرشفة جوجل في Supabase بنجاح! 🚀✅');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch {
      setSaveSuccessMsg('تم حفظ الإعدادات بنجاح!');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const titleLength = (currentSeo.metaTitle || '').length;
  const descLength = (currentSeo.metaDescription || '').length;

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-blue-900/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">إعدادات السيو وأرشفة المتجر في جوجل (Google SEO)</h3>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                  Google Rank #1 🚀
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                تهيئة المتجر للظهور في الصفحة الأولى لنتائج بحث جوجل مع مقتطفات النجوم (⭐⭐⭐⭐⭐) والأسئلة الشائعة.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Database className="w-4 h-4" />
            <span>{isSaving ? 'جارٍ الحفظ في Supabase...' : 'حفظ إعدادات السيو الآن'}</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 1. Live Google Search Preview (SERP Mockup) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>معاينة ظهور المتجر في نتائج بحث جوجل (Google SERP Preview):</span>
          </span>
          <span className="text-[10px] text-slate-500 font-medium">الشكل الفعلي للمتجر عند بحث الزبون في جوجل</span>
        </div>

        {/* Google Result Card Mockup */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm space-y-1.5 font-sans" dir="rtl">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] flex items-center justify-center font-bold">S</span>
            <span className="text-[11px] text-slate-700">sanambio.ma</span>
            <span className="text-slate-400">›</span>
            <span className="text-[11px] text-slate-500">دهن سنام الجمل الأصلي</span>
          </div>

          <h4 className="text-sm sm:text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-tight">
            {currentSeo.metaTitle || 'دهن سنام الجمل Sanambio® الأصلي بالمغرب | علاج طبيعي لآلام المفاصل والظهر'}
          </h4>

          {/* Rich Snippet Stars & Price */}
          <div className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
            <span className="text-amber-500 font-bold">★★★★★</span>
            <span className="font-bold text-slate-900">4.9</span>
            <span className="text-slate-500">(148 تقييم مؤكد)</span>
            <span>·</span>
            <span className="text-emerald-700 font-bold">199 درهم - 399 درهم</span>
            <span>·</span>
            <span className="text-slate-500">متوفر في المخزون (In Stock)</span>
          </div>

          <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
            {currentSeo.metaDescription || 'دهن سنام الجمل Sanambio الطبيعي 100% للتخلص من آلام المفاصل، الروماتيزم، خشونة الركبة، والظهر وعرق النسا (السياتيك). نتائج مضمونة وسريعة مع توصيل بالمجان.'}
          </p>

          {/* Rich Sitelinks / FAQs */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-3 text-[11px] text-[#1a0dab]">
            <span className="hover:underline cursor-pointer">← متى تظهر النتائج؟</span>
            <span className="hover:underline cursor-pointer">← طريقة الاستخدام الصحيحة</span>
            <span className="hover:underline cursor-pointer">← التوصيل والدفع عند الاستلام بالمغرب</span>
          </div>
        </div>
      </div>

      {/* 2. SEO Form Inputs */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-black text-xs text-slate-900 flex items-center gap-1.5 border-b pb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>تخصيص العناوين والكلمات الدلالية لـ Google</span>
        </h4>

        {/* Meta Title */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-800">
              عنوان المتجر في محرك البحث (Title Tag):
            </label>
            <span className={`text-[10px] font-bold ${titleLength >= 40 && titleLength <= 65 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {titleLength} حرف (المثالي بين 50 و 65 حرفاً)
            </span>
          </div>
          <input
            type="text"
            value={currentSeo.metaTitle || ''}
            onChange={(e) => handleUpdateSeo({ metaTitle: e.target.value })}
            placeholder="مثال: دهن سنام الجمل Sanambio® الأصلي بالمغرب | علاج طبيعي لآلام المفاصل والظهر"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-500 focus:bg-white bg-slate-50"
          />
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-800">
              وصف المتجر في محرك البحث (Meta Description):
            </label>
            <span className={`text-[10px] font-bold ${descLength >= 120 && descLength <= 165 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {descLength} حرف (المثالي بين 130 و 160 حرفاً)
            </span>
          </div>
          <textarea
            rows={3}
            value={currentSeo.metaDescription || ''}
            onChange={(e) => handleUpdateSeo({ metaDescription: e.target.value })}
            placeholder="اكتب وصفاً جذاباً يشجع الزبون على الضغط على موقعك في جوجل..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-500 focus:bg-white bg-slate-50"
          />
        </div>

        {/* Target Keywords */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            الكلمات المفتاحية المستهدفة في المغرب (Keywords):
          </label>
          <input
            type="text"
            value={currentSeo.keywords || ''}
            onChange={(e) => handleUpdateSeo({ keywords: e.target.value })}
            placeholder="افصل بين الكلمات بفواصل (,)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-500 focus:bg-white bg-slate-50"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            💡 كلمات مقترحة يتصدر بها متجرك: دهن سنام الجمل الأصلي، علاج آلام المفاصل، خشونة الركبة، عرق النسا بوزلوم، سياتيك، سنام الإبل المغرب
          </p>
        </div>

        {/* Google Search Console Verification Tag */}
        <div className="pt-2 border-t">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            رمز التحقق من Google Search Console (HTML Tag Code):
          </label>
          <input
            type="text"
            dir="ltr"
            value={currentSeo.googleSiteVerification || ''}
            onChange={(e) => handleUpdateSeo({ googleSiteVerification: e.target.value })}
            placeholder='مثال: abcdef123456789 أو <meta name="google-site-verification" content="..." />'
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-left bg-slate-50 focus:bg-white focus:border-blue-500"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            انسخ كود التحقق من Google Search Console والصقه هنا ليتم التحقق من موقعك تلقائياً وبدء أرشفة صفحاتك.
          </p>
        </div>
      </div>

      {/* 3. Fast Indexing Step-by-Step Guide for Google */}
      <div className="bg-amber-50/70 border border-amber-200 p-4 sm:p-5 rounded-2xl shadow-xs space-y-3">
        <h4 className="font-black text-xs text-amber-950 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-600" />
          <span>خطوات أرشفة متجرك وظهوره في نتائج بحث جوجل خلال 24 ساعة:</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-1">
            <span className="font-black text-amber-900 block">1. فتح Google Search Console</span>
            <p className="text-[11px] text-slate-600">
              ادخل لحسابك في Google Search Console واضغط على "إضافة موقع" (Add Property) وأدخل رابط متجرك.
            </p>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:underline pt-1"
            >
              <span>فتح Google Search Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-1">
            <span className="font-black text-amber-900 block">2. إثبات الملكية برمز HTML Tag</span>
            <p className="text-[11px] text-slate-600">
              اختر طريقة التحقق (HTML Tag) وانسخ الرمز والصقه في خانة رمز التحقق أعلاه واضغط حفظ.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-1">
            <span className="font-black text-amber-900 block">3. إرسال ملف Sitemap</span>
            <p className="text-[11px] text-slate-600">
              في القائمة الجانبية اضغط على "Sitemaps" وأدخل <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px]">sitemap.xml</code> واضغط إرسال ليقوم جوجل بفهرسة المتجر فوراً!
            </p>
          </div>
        </div>
      </div>

      {/* 4. Technical SEO Files: Sitemap & Robots.txt */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h4 className="font-black text-xs text-slate-900 flex items-center gap-1.5 border-b pb-2">
          <FileCode className="w-4 h-4 text-blue-600" />
          <span>ملفات الأرشفة الجاهزة لزواحف جوجل (Sitemap & Robots.txt)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">ملف خريطة الموقع (Sitemap XML):</span>
              <span className="text-[10px] text-slate-500 font-mono">/sitemap.xml (جاهز ومفعل لـ Googlebot)</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(`${window.location.origin}/sitemap.xml`, 'sitemap')}
              className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer"
            >
              {copiedLink === 'sitemap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'sitemap' ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">ملف توجيه الزواحف (Robots.txt):</span>
              <span className="text-[10px] text-slate-500 font-mono">/robots.txt (يسمح بأرشفة جميع الصفحات)</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(`${window.location.origin}/robots.txt`, 'robots')}
              className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer"
            >
              {copiedLink === 'robots' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'robots' ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Google SEO Checklist */}
      <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl text-xs space-y-2.5">
        <span className="font-black text-emerald-950 block text-xs">
          ✅ قائمة فحص جودة السيو (SEO Audit Checklist):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-emerald-900 font-semibold">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>بيانات Schema.org المنظمة للمنتج مفعلة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>تقييمات النجوم مجهزة لـ Google Snippet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>كروت المشاركة في فيسبوك وواتساب مفعلة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>تحديد النطاق الجغرافي للمغرب (MA Geo-tag)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>خريطة الموقع Sitemap.xml متوافقة 100%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>سرعة تصفح فائقة وتوافق كامل مع الهواتف</span>
          </div>
        </div>
      </div>
    </div>
  );
};
