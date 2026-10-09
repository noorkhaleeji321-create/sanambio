import React, { useState, useEffect } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  dispatchPixelEvent,
  fireTestPixelEvent,
  getPixelLogHistory,
  subscribeToPixelEvents,
  PixelLogEntry
} from '../../../lib/pixelEvents';
import {
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Save,
  Radio,
  Eye,
  ShoppingCart,
  Send,
  MessageCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const PixelSettingsTab: React.FC = () => {
  const { settings, updateSettings, saveAllSettingsToSupabase } = useStore();

  const currentPixel = settings.pixel || {
    facebookPixelId: '',
    enableFacebookPixel: true,
    tiktokPixelId: '',
    enableTiktokPixel: true,
    googleAnalyticsId: '',
    enableGoogleAnalytics: false,
    trackPageView: true,
    trackViewContent: true,
    trackAddToCart: true,
    trackInitiateCheckout: true,
    trackPurchase: true,
    trackLead: true,
    trackContact: true,
    testEventMode: false
  };

  const [fbId, setFbId] = useState(currentPixel.facebookPixelId || '');
  const [fbEnabled, setFbEnabled] = useState(currentPixel.enableFacebookPixel !== false);

  const [ttId, setTtId] = useState(currentPixel.tiktokPixelId || '');
  const [ttEnabled, setTtEnabled] = useState(currentPixel.enableTiktokPixel !== false);

  const [gaId, setGaId] = useState(currentPixel.googleAnalyticsId || '');
  const [gaEnabled, setGaEnabled] = useState(!!currentPixel.enableGoogleAnalytics);

  // Event toggles
  const [trackPageView, setTrackPageView] = useState(currentPixel.trackPageView !== false);
  const [trackViewContent, setTrackViewContent] = useState(currentPixel.trackViewContent !== false);
  const [trackAddToCart, setTrackAddToCart] = useState(currentPixel.trackAddToCart !== false);
  const [trackInitiateCheckout, setTrackInitiateCheckout] = useState(currentPixel.trackInitiateCheckout !== false);
  const [trackPurchase, setTrackPurchase] = useState(currentPixel.trackPurchase !== false);
  const [trackLead, setTrackLead] = useState(currentPixel.trackLead !== false);
  const [trackContact, setTrackContact] = useState(currentPixel.trackContact !== false);

  // Real-time Event Log State
  const [logs, setLogs] = useState<PixelLogEntry[]>(() => getPixelLogHistory());
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Subscribe to live pixel events
  useEffect(() => {
    const unsubscribe = subscribeToPixelEvents((newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    });
    return unsubscribe;
  }, []);

  // Sync internal state when settings change from remote/Supabase
  useEffect(() => {
    if (settings.pixel) {
      setFbId(settings.pixel.facebookPixelId || '');
      setFbEnabled(settings.pixel.enableFacebookPixel !== false);
      setTtId(settings.pixel.tiktokPixelId || '');
      setTtEnabled(settings.pixel.enableTiktokPixel !== false);
      setGaId(settings.pixel.googleAnalyticsId || '');
      setGaEnabled(!!settings.pixel.enableGoogleAnalytics);
      setTrackPageView(settings.pixel.trackPageView !== false);
      setTrackViewContent(settings.pixel.trackViewContent !== false);
      setTrackAddToCart(settings.pixel.trackAddToCart !== false);
      setTrackInitiateCheckout(settings.pixel.trackInitiateCheckout !== false);
      setTrackPurchase(settings.pixel.trackPurchase !== false);
      setTrackLead(settings.pixel.trackLead !== false);
      setTrackContact(settings.pixel.trackContact !== false);
    }
  }, [settings.pixel]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const updatedPixel = {
      facebookPixelId: fbId.trim(),
      enableFacebookPixel: fbEnabled,
      tiktokPixelId: ttId.trim(),
      enableTiktokPixel: ttEnabled,
      googleAnalyticsId: gaId.trim(),
      enableGoogleAnalytics: gaEnabled,
      trackPageView,
      trackViewContent,
      trackAddToCart,
      trackInitiateCheckout,
      trackPurchase,
      trackLead,
      trackContact,
      testEventMode: false
    };

    updateSettings({ pixel: updatedPixel });

    // Also persist directly to Supabase
    try {
      await saveAllSettingsToSupabase();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch {
      // Local state is already updated
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunTestEvent = () => {
    const tempPixel = {
      facebookPixelId: fbId.trim(),
      enableFacebookPixel: fbEnabled,
      tiktokPixelId: ttId.trim(),
      enableTiktokPixel: ttEnabled,
      googleAnalyticsId: gaId.trim(),
      enableGoogleAnalytics: gaEnabled,
      trackPageView,
      trackViewContent,
      trackAddToCart,
      trackInitiateCheckout,
      trackPurchase,
      trackLead,
      trackContact,
      testEventMode: true
    };

    const res = fireTestPixelEvent(tempPixel);
    setTestResult(res);
    setTimeout(() => setTestResult(null), 5000);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  // Inspect scripts present in DOM
  const isFbScriptInDOM = typeof window !== 'undefined' && Boolean(window.fbq);
  const isTtScriptInDOM = typeof window !== 'undefined' && Boolean(window.ttq);

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-sm border border-indigo-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="font-black text-base md:text-lg text-white">
              ربط إعلانات فيسبوك وتيك توك (Meta & TikTok Pixel Tracking)
            </h3>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
              Real Dispatching ⚡
            </span>
          </div>
          <p className="text-xs text-indigo-200 mt-1 max-w-2xl leading-relaxed">
            ربط مباشر وسريع لإرسال كافة أحداث الشراء (Purchase)، بدء الطلب (InitiateCheckout)، إدخال البيانات (Lead)، والنقر على الواتساب فورياً لحساباتك الإعلانية لتحسين الخوارزمية وتخفيض تكلفة الاستحواذ (CPA).
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handleRunTestEvent}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>إرسال حدث تجريبي فوري ⚡</span>
          </button>

          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'جارٍ الحفظ...' : saveSuccess ? 'تم الحفظ! ✅' : 'حفظ الإعدادات'}</span>
          </button>
        </div>
      </div>

      {/* Test Result Toast Banner */}
      {testResult && (
        <div className={`p-4 rounded-xl text-xs font-bold border flex items-center justify-between ${
          testResult.success
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : 'bg-amber-50 text-amber-900 border-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span>{testResult.message}</span>
          </div>
          <span className="text-[10px] text-slate-500">تم تسجيل الحدث في شريط المراقبة بالأسفل</span>
        </div>
      )}

      {/* Two Main Cards: Meta & TikTok */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* FACEBOOK / META PIXEL CARD */}
        <div className="bg-white rounded-2xl border-2 border-blue-200/80 shadow-xs p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1877F2] text-white flex items-center justify-center font-black text-lg shadow-sm">
                f
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                  Facebook & Meta Pixel
                  {fbEnabled && fbId.trim() && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  )}
                </h4>
                <p className="text-[10px] text-slate-500">تتبع إعلانات فيسبوك وانستغرام</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-[11px] font-bold text-slate-700">تفعيل:</span>
              <input
                type="checkbox"
                checked={fbEnabled}
                onChange={(e) => setFbEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label className="block font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>معرف البكسل (Meta Pixel ID):</span>
              <span className="text-[10px] font-mono text-slate-400">15-16 أرقام</span>
            </label>
            <input
              type="text"
              dir="ltr"
              value={fbId}
              onChange={(e) => setFbId(e.target.value)}
              placeholder="مثال: 1842938472910482"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-left bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
              💡 تجده في مدير إعلانات Meta: <strong>Events Manager &gt; Data Sources &gt; Pixel ID</strong>.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-[11px]">
            <span className="text-blue-900 font-medium">حالة الكود في المتصفح:</span>
            <span className={`font-bold flex items-center gap-1 ${
              fbEnabled && fbId.trim() ? 'text-emerald-700' : 'text-slate-500'
            }`}>
              {fbEnabled && fbId.trim() ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>جاهز للإرسال ({fbId.trim().slice(-4)}...)</span>
                </>
              ) : (
                <span>غير متصل (أدخل المعرف أعلاه)</span>
              )}
            </span>
          </div>

          {/* Meta Pixel Helper tip */}
          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
            <span>تأكد من تشغيل إضافة:</span>
            <a
              href="https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5"
            >
              <span>Meta Pixel Helper</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* TIKTOK PIXEL CARD */}
        <div className="bg-white rounded-2xl border-2 border-slate-900/40 shadow-xs p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-black text-[#EE1D52] flex items-center justify-center font-black text-base shadow-sm border border-slate-800">
                ♪
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                  TikTok Pixel
                  {ttEnabled && ttId.trim() && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  )}
                </h4>
                <p className="text-[10px] text-slate-500">تتبع إعلانات وحملات تيك توك Ads</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-[11px] font-bold text-slate-700">تفعيل:</span>
              <input
                type="checkbox"
                checked={ttEnabled}
                onChange={(e) => setTtEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label className="block font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>معرف البكسل (TikTok Pixel ID):</span>
              <span className="text-[10px] font-mono text-slate-400">حروف وأرقام (20 حرفاً)</span>
            </label>
            <input
              type="text"
              dir="ltr"
              value={ttId}
              onChange={(e) => setTtId(e.target.value)}
              placeholder="مثال: C9ABCDEFGHIJKL123456"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-left bg-slate-50 focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-200"
            />
            <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
              💡 تجده في مدير إعلانات تيك توك: <strong>Assets &gt; Events &gt; Web Events &gt; Pixel ID</strong>.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-[11px]">
            <span className="text-slate-800 font-medium">حالة الكود في المتصفح:</span>
            <span className={`font-bold flex items-center gap-1 ${
              ttEnabled && ttId.trim() ? 'text-emerald-700' : 'text-slate-500'
            }`}>
              {ttEnabled && ttId.trim() ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>جاهز للإرسال ({ttId.trim().slice(-4)}...)</span>
                </>
              ) : (
                <span>غير متصل (أدخل المعرف أعلاه)</span>
              )}
            </span>
          </div>

          {/* TikTok Pixel Helper tip */}
          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
            <span>تأكد من تشغيل إضافة:</span>
            <a
              href="https://chromewebstore.google.com/detail/tiktok-pixel-helper/aeljmnnnhekenekbmjfolcjflocfneim"
              target="_blank"
              rel="noreferrer"
              className="text-slate-900 font-bold hover:underline inline-flex items-center gap-0.5"
            >
              <span>TikTok Pixel Helper</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

      </div>

      {/* EVENT DISPATCH CONFIGURATION (CHECKBOXES) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b pb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-600" />
            <h4 className="font-black text-sm text-slate-900">
              الأحداث المتتبعة تلقائياً (Tracked Conversion Events)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">تُرسل الأحداث متزامنة مع فيسبوك وتيك توك</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          {/* Purchase Event */}
          <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="event-purchase"
              checked={trackPurchase}
              onChange={(e) => setTrackPurchase(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
            <label htmlFor="event-purchase" className="flex-1 cursor-pointer select-none">
              <span className="font-black text-emerald-950 block">Purchase / CompletePayment</span>
              <span className="text-[10px] text-emerald-800 leading-tight block mt-0.5">
                تأكيد الطلبية مع إرسال القيمة الإجمالية (MAD) ورقم الطلب واسم الباقة.
              </span>
            </label>
          </div>

          {/* Initiate Checkout */}
          <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="event-checkout"
              checked={trackInitiateCheckout}
              onChange={(e) => setTrackInitiateCheckout(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <label htmlFor="event-checkout" className="flex-1 cursor-pointer select-none">
              <span className="font-black text-blue-950 block">InitiateCheckout</span>
              <span className="text-[10px] text-blue-800 leading-tight block mt-0.5">
                بدء ملء معلومات الشحن في استمارة الطلب السريع.
              </span>
            </label>
          </div>

          {/* Add To Cart */}
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="event-cart"
              checked={trackAddToCart}
              onChange={(e) => setTrackAddToCart(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-amber-600 rounded cursor-pointer"
            />
            <label htmlFor="event-cart" className="flex-1 cursor-pointer select-none">
              <span className="font-black text-amber-950 block">AddToCart</span>
              <span className="text-[10px] text-amber-800 leading-tight block mt-0.5">
                اختيار ونقر الزبون على إحدى الباقات والعروض.
              </span>
            </label>
          </div>

          {/* View Content */}
          <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/50 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="event-view"
              checked={trackViewContent}
              onChange={(e) => setTrackViewContent(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-purple-600 rounded cursor-pointer"
            />
            <label htmlFor="event-view" className="flex-1 cursor-pointer select-none">
              <span className="font-black text-purple-950 block">ViewContent</span>
              <span className="text-[10px] text-purple-800 leading-tight block mt-0.5">
                تصفح تفاصيل المنتج وفوائد سنام الجمل عند فتح الصفحة.
              </span>
            </label>
          </div>

          {/* Contact / WhatsApp */}
          <div className="p-3 rounded-xl border border-teal-200 bg-teal-50/50 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="event-contact"
              checked={trackContact}
              onChange={(e) => setTrackContact(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-teal-600 rounded cursor-pointer"
            />
            <label htmlFor="event-contact" className="flex-1 cursor-pointer select-none">
              <span className="font-black text-teal-950 block">Contact (WhatsApp / Call)</span>
              <span className="text-[10px] text-teal-800 leading-tight block mt-0.5">
                الضغط على زر محادثة الواتساب أو الاتصال الهاتفي المباشر.
              </span>
            </label>
          </div>

          {/* PageView */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="event-page"
              checked={trackPageView}
              onChange={(e) => setTrackPageView(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-slate-800 rounded cursor-pointer"
            />
            <label htmlFor="event-page" className="flex-1 cursor-pointer select-none">
              <span className="font-black text-slate-900 block">PageView</span>
              <span className="text-[10px] text-slate-600 leading-tight block mt-0.5">
                تتبع كل زيارة فريدة لصفحة الهبوط.
              </span>
            </label>
          </div>

        </div>
      </div>

      {/* OPTIONAL GOOGLE ANALYTICS CARD */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold">📊</span>
            <div>
              <h5 className="font-black text-xs text-slate-900">
                Google Analytics 4 (GA4 - اختياري)
              </h5>
              <p className="text-[10px] text-slate-500">معرف القياس Measurement ID لحساب Google</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-[11px] font-bold text-slate-700">تفعيل:</span>
            <input
              type="checkbox"
              checked={gaEnabled}
              onChange={(e) => setGaEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 accent-amber-600 cursor-pointer"
            />
          </label>
        </div>

        <div className="max-w-md">
          <input
            type="text"
            dir="ltr"
            value={gaId}
            onChange={(e) => setGaId(e.target.value)}
            placeholder="مثال: G-ABC123XYZ4"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-left bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* LIVE EVENT INSPECTOR / MONITOR */}
      <div className="bg-slate-950 text-white rounded-2xl p-5 space-y-3.5 shadow-md border border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <h4 className="font-black text-sm text-white flex items-center gap-2">
              شاشة مراقبة الأحداث المباشرة (Live Pixel Events Log)
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                {logs.length} أحداث مسجلة
              </span>
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRunTestEvent}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>تجربة فورية</span>
            </button>

            {logs.length > 0 && (
              <button
                type="button"
                onClick={handleClearLogs}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                title="مسح السجل"
              >
                <Trash2 className="w-3 h-3" />
                <span>مسح</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          تظهر هنا في الوقت الفعلي كافة الأحداث المرسلة إلى فيسبوك وتيك توك عند قيام أي زائر بالطلب أو النقر.
        </p>

        {logs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
            لا توجد أحداث مسجلة حالياً. اضغط على «إرسال حدث تجريبي فوري» بالأعلى للتأكد من اشتغال البكسل!
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
            {logs.map((log) => {
              const isFB = log.platform === 'facebook';
              const isTT = log.platform === 'tiktok';
              const isGA = log.platform === 'google';

              return (
                <div
                  key={log.id}
                  className="bg-slate-900/90 hover:bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 text-right"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>

                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] shrink-0 ${
                      isFB
                        ? 'bg-blue-600 text-white'
                        : isTT
                        ? 'bg-black text-[#EE1D52] border border-[#EE1D52]'
                        : 'bg-amber-600 text-white'
                    }`}>
                      {isFB ? 'Meta' : isTT ? 'TikTok' : 'GA4'}
                    </span>

                    <span className="font-bold text-white text-xs">
                      {log.eventName}
                    </span>

                    {log.data?.value && (
                      <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                        {log.data.value} {log.data.currency || 'MAD'}
                      </span>
                    )}

                    {log.data?.content_name && (
                      <span className="text-[10px] text-slate-400 hidden sm:inline truncate max-w-xs">
                        ({log.data.content_name})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      Dispatched ✅
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Button Footer */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black px-6 py-3 rounded-2xl text-xs transition-all cursor-pointer shadow-lg"
        >
          <Save className="w-4 h-4 text-emerald-400" />
          <span>{isSaving ? 'جارٍ حفظ الإعدادات...' : saveSuccess ? 'تم الحفظ والمزامنة بنجاح! ✅' : 'حفظ إعدادات البكسل'}</span>
        </button>
      </div>

    </div>
  );
};
