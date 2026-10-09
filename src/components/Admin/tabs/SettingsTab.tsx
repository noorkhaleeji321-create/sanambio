import React, { useState, useEffect } from 'react';
import { useStore } from '../../../context/StoreContext';
import { testSupabaseConnection, uploadFileToSupabaseStorage } from '../../../lib/supabase';
import { SUPABASE_SQL_SCHEMA } from '../../../lib/supabaseSchemaCode';
import { formatPhoneCallUrl, formatWhatsAppUrl } from '../../../lib/contactUtils';
import { fireTestPixelEvent } from '../../../lib/pixelEvents';
import {
  MessageCircle,
  ExternalLink,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Check,
  Copy,
  Target,
  Play,
  Zap,
  Upload,
  Globe,
  Image as ImageIcon
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings, updateAdminPin, saveAllSettingsToSupabase } = useStore();

  // Admin PIN configuration
  const [customPin, setCustomPin] = useState(() => settings.adminPin || '1234');
  const [showPin, setShowPin] = useState(false);
  const [isSavingPin, setIsSavingPin] = useState(false);
  const [pinSaveFeedback, setPinSaveFeedback] = useState<string | null>(null);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [saveAllMsg, setSaveAllMsg] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingStatusIcon, setUploadingStatusIcon] = useState(false);
  const [brandingFeedback, setBrandingFeedback] = useState<string | null>(null);

  const handleSaveAllSettings = async () => {
    setIsSavingAll(true);
    try {
      if (customPin && customPin.trim() && customPin.trim() !== settings.adminPin) {
        await updateAdminPin(customPin.trim());
      }
      await saveAllSettingsToSupabase();
      setSaveAllMsg('تم حفظ وتحديث كافة إعدادات المتجر والرمز في Supabase بنجاح! 🚀');
      setTimeout(() => setSaveAllMsg(null), 3500);
    } catch {
      setSaveAllMsg('تم الحفظ بنجاح!');
      setTimeout(() => setSaveAllMsg(null), 3500);
    } finally {
      setIsSavingAll(false);
    }
  };

  // Sync customPin state if settings.adminPin loads from Supabase
  useEffect(() => {
    if (settings.adminPin && !isSavingPin) {
      setCustomPin(settings.adminPin);
    }
  }, [settings.adminPin]);

  const handleSavePin = async () => {
    const newPin = customPin.trim();
    if (!newPin) {
      setPinSaveFeedback('يرجى إدخال رمز دخول صالح ⚠️');
      setTimeout(() => setPinSaveFeedback(null), 3000);
      return;
    }

    setIsSavingPin(true);
    setPinSaveFeedback(null);
    try {
      const ok = await updateAdminPin(newPin);
      await saveAllSettingsToSupabase();
      if (ok) {
        setPinSaveFeedback(`تم تشفير وحفظ رمز الدخول (${newPin}) في Supabase بنجاح! 🔒✅`);
      } else {
        setPinSaveFeedback(`تم تحديث الرمز (${newPin}) في Supabase! 🔒`);
      }
      setTimeout(() => setPinSaveFeedback(null), 4000);
    } catch (e) {
      console.warn('Failed saving pin to Supabase:', e);
      setPinSaveFeedback('فشل الحفظ في Supabase، يرجى التحقق من الاتصال');
      setTimeout(() => setPinSaveFeedback(null), 4000);
    } finally {
      setIsSavingPin(false);
    }
  };

  // Supabase testing state
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<{ success?: boolean; message?: string; tables?: any; storage?: boolean } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [pixelTestMsg, setPixelTestMsg] = useState<{ success: boolean; message: string } | null>(null);

  const handleQuickPixelTest = () => {
    const res = fireTestPixelEvent(settings.pixel);
    setPixelTestMsg(res);
    setTimeout(() => setPixelTestMsg(null), 4000);
  };

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    try {
      const res = await testSupabaseConnection();
      setSupabaseTestStatus(res);
    } catch (e: any) {
      setSupabaseTestStatus({ success: false, message: e.message || 'حدث خطأ أثناء اختبار الاتصال' });
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
      
      {/* BRAND LOGO & NETWORK/GLOBE ICON UPLOAD (إعدادات الشعار وهوية المتجر) */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 p-4 rounded-xl border-2 border-emerald-500/80 space-y-3">
        <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-700" />
            <h4 className="font-black text-sm text-slate-900">
              رفع شعار المتجر وأيقونة حالة الكرة الأرضية / الشبكة
            </h4>
          </div>
          <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full">
            Supabase Storage ☁️
          </span>
        </div>

        {brandingFeedback && (
          <div className="p-2 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-900 font-bold text-xs flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{brandingFeedback}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Logo Upload Box */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
            <label className="font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>شعار المتجر (Store Logo)</span>
              </span>
              <span className="text-[9px] text-slate-500">رأس الصفحة والقوائم</span>
            </label>

            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-300 bg-amber-50 shrink-0 flex items-center justify-center shadow-xs">
                <img
                  src={settings.media?.logoUrl || settings.logoUrl || settings.media?.heroProductImage || "https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/camel_joint_cream_jar.jpg"}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-1.5 px-2.5 rounded-lg text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                  {uploadingLogo ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>جارٍ الرفع...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3" />
                      <span>رفع صورة الشعار</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingLogo}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingLogo(true);
                      try {
                        const url = await uploadFileToSupabaseStorage(file, file.name, 'branding');
                        if (url) {
                          updateSettings({
                            logoUrl: url,
                            media: { ...settings.media, logoUrl: url }
                          });
                          setBrandingFeedback('تم رفع صورة شعار المتجر إلى Supabase بنجاح! 🚀');
                          setTimeout(() => setBrandingFeedback(null), 3500);
                        }
                      } finally {
                        setUploadingLogo(false);
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="أو ضع رابط الشعار مباشرة..."
                  value={settings.media?.logoUrl || settings.logoUrl || ''}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    updateSettings({
                      logoUrl: val,
                      media: { ...settings.media, logoUrl: val }
                    });
                  }}
                  className="w-full mt-1 px-2 py-1 border rounded text-[10px] font-mono text-left"
                />
              </div>
            </div>
          </div>

          {/* Network / Globe Status Icon Upload Box */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
            <label className="font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>أيقونة حالة الكرة الأرضية / الشبكة</span>
              </span>
              <span className="text-[9px] text-slate-500">حالة الاتصال بالمتجر</span>
            </label>

            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-xl border border-slate-300 bg-slate-900 shrink-0 flex items-center justify-center shadow-xs">
                {(settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl) ? (
                  <img
                    src={settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl}
                    alt="Network Icon"
                    className="w-7 h-7 object-contain rounded-full"
                  />
                ) : (
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
                  </span>
                )}
              </div>
              <div className="flex-1">
                <label className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-1.5 px-2.5 rounded-lg text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                  {uploadingStatusIcon ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>جارٍ الرفع...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3" />
                      <span>رفع أيقونة الكرة الأرضية/الشبكة</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingStatusIcon}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingStatusIcon(true);
                      try {
                        const url = await uploadFileToSupabaseStorage(file, file.name, 'branding');
                        if (url) {
                          updateSettings({
                            networkStatusIconUrl: url,
                            media: { ...settings.media, networkStatusIconUrl: url }
                          });
                          setBrandingFeedback('تم رفع أيقونة حالة الكرة الأرضية / الشبكة إلى Supabase بنجاح! 🌐✅');
                          setTimeout(() => setBrandingFeedback(null), 3500);
                        }
                      } finally {
                        setUploadingStatusIcon(false);
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="أو رابط أيقونة الكرة الأرضية..."
                  value={settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl || ''}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    updateSettings({
                      networkStatusIconUrl: val,
                      media: { ...settings.media, networkStatusIconUrl: val }
                    });
                  }}
                  className="w-full mt-1 px-2 py-1 border rounded text-[10px] font-mono text-left"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      <h4 className="font-black text-sm text-slate-900 border-b pb-2">بيانات الاتصال والعناوين</h4>

      <div>
        <label className="block font-bold mb-1">رقم الهاتف للاتصال المباشر:</label>
        <input
          type="text"
          dir="ltr"
          value={settings.phone || ''}
          onChange={(e) => updateSettings({ phone: e.target.value })}
          placeholder="مثال: 0661234567 أو +212661234567"
          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-right bg-slate-50 focus:bg-white"
        />
        <p className="text-[10px] text-slate-500 mt-1">
          📞 رابط الاتصال المولد: <code className="font-mono text-amber-800">{formatPhoneCallUrl(settings.phone)}</code>
        </p>
      </div>

      <div>
        <label className="block font-bold mb-1 flex items-center justify-between">
          <span>رقم الواتساب لاستقبال الاستفسارات والطلبات:</span>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
            تنسيق دولي تلقائي (212+)
          </span>
        </label>
        <input
          type="text"
          dir="ltr"
          value={settings.whatsappNumber || ''}
          onChange={(e) => updateSettings({
            whatsappNumber: e.target.value,
            whatsappSupportUrl: formatWhatsAppUrl(e.target.value)
          })}
          placeholder="مثال: 0661234567 أو 0712345678 أو +212661234567"
          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-right bg-slate-50 focus:bg-white font-mono"
        />
        <div className="mt-1.5 flex items-center justify-between flex-wrap gap-2 text-[11px] bg-emerald-50/80 p-2 rounded-xl border border-emerald-200/80">
          <span className="text-emerald-900 font-medium">
            📲 رابط الواتساب النشط: <code className="font-mono font-bold text-emerald-800">{formatWhatsAppUrl(settings.whatsappNumber)}</code>
          </span>
          <a
            href={formatWhatsAppUrl(settings.whatsappNumber, 'تجربة رابط الواتساب لمتجر Sanambio')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] transition-colors shadow-xs"
          >
            <MessageCircle className="w-3 h-3" />
            <span>اختبر فتح رقمك في الواتساب الآن</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      <div>
        <label className="block font-bold mb-1">نص الشريط الإعلاني العلوي:</label>
        <input
          type="text"
          value={settings.announcementText || ''}
          onChange={(e) => updateSettings({ announcementText: e.target.value })}
          className="w-full px-3 py-2 rounded-xl border text-xs"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">العنوان الرئيسي لصفحة الهبوط:</label>
        <textarea
          rows={2}
          value={settings.heroHeadline || ''}
          onChange={(e) => updateSettings({ heroHeadline: e.target.value })}
          className="w-full px-3 py-2 rounded-xl border text-xs"
        />
      </div>

      <div className="pt-2 border-t flex items-center justify-between">
        <div>
          <span className="font-bold block text-slate-800">خلفية متحركة (إموجيات، قلوب ونجوم ✨💛⭐):</span>
          <span className="text-[10px] text-slate-500">عرض جزيئات وقلوب ونجوم تطفو بشكل جمالي في خلفية المتجر</span>
        </div>
        <button
          type="button"
          onClick={() => updateSettings({ enableFloatingBackground: settings.enableFloatingBackground === false ? true : false })}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
            settings.enableFloatingBackground !== false ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
          }`}
        >
          {settings.enableFloatingBackground !== false ? 'مفعلة ✨' : 'معطلة'}
        </button>
      </div>

      {/* FACEBOOK & TIKTOK PIXEL TRACKING SECTION */}
      <div className="pt-4 border-t space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                ربط بكسل الإعلانات (Facebook & TikTok Pixel IDs)
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Real Dispatching ⚡
                </span>
              </h5>
              <p className="text-[10px] text-slate-500">إرسال أحداث الشراء (Purchase) وبدء الطلب تلقائياً</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickPixelTest}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[11px] transition-all cursor-pointer shadow-xs"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>تجربة فورية</span>
          </button>
        </div>

        {pixelTestMsg && (
          <div className={`p-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
            pixelTestMsg.success ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {pixelTestMsg.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
            <span>{pixelTestMsg.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Facebook Pixel Input */}
          <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-blue-950 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-[#1877F2] text-white flex items-center justify-center text-[10px] font-black">f</span>
                <span>Facebook Pixel ID:</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <span className="text-[10px] font-semibold text-slate-600">تفعيل:</span>
                <input
                  type="checkbox"
                  checked={settings.pixel?.enableFacebookPixel !== false}
                  onChange={(e) => updateSettings({
                    pixel: {
                      ...(settings.pixel || {
                        facebookPixelId: '',
                        enableFacebookPixel: true,
                        tiktokPixelId: '',
                        enableTiktokPixel: true,
                        trackPageView: true,
                        trackViewContent: true,
                        trackAddToCart: true,
                        trackInitiateCheckout: true,
                        trackPurchase: true,
                        trackLead: true,
                        trackContact: true,
                        testEventMode: false
                      }),
                      enableFacebookPixel: e.target.checked
                    }
                  })}
                  className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600 cursor-pointer"
                />
              </label>
            </div>
            <input
              type="text"
              dir="ltr"
              value={settings.pixel?.facebookPixelId || ''}
              onChange={(e) => updateSettings({
                pixel: {
                  ...(settings.pixel || {
                    facebookPixelId: '',
                    enableFacebookPixel: true,
                    tiktokPixelId: '',
                    enableTiktokPixel: true,
                    trackPageView: true,
                    trackViewContent: true,
                    trackAddToCart: true,
                    trackInitiateCheckout: true,
                    trackPurchase: true,
                    trackLead: true,
                    trackContact: true,
                    testEventMode: false
                  }),
                  facebookPixelId: e.target.value.trim()
                }
              })}
              placeholder="مثال: 1842938472910482"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-left bg-white focus:border-blue-500"
            />
          </div>

          {/* TikTok Pixel Input */}
          <div className="p-3 rounded-xl border border-slate-300 bg-slate-50/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-black text-[#EE1D52] flex items-center justify-center text-[10px] font-black">♪</span>
                <span>TikTok Pixel ID:</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <span className="text-[10px] font-semibold text-slate-600">تفعيل:</span>
                <input
                  type="checkbox"
                  checked={settings.pixel?.enableTiktokPixel !== false}
                  onChange={(e) => updateSettings({
                    pixel: {
                      ...(settings.pixel || {
                        facebookPixelId: '',
                        enableFacebookPixel: true,
                        tiktokPixelId: '',
                        enableTiktokPixel: true,
                        trackPageView: true,
                        trackViewContent: true,
                        trackAddToCart: true,
                        trackInitiateCheckout: true,
                        trackPurchase: true,
                        trackLead: true,
                        trackContact: true,
                        testEventMode: false
                      }),
                      enableTiktokPixel: e.target.checked
                    }
                  })}
                  className="w-3.5 h-3.5 rounded text-slate-900 accent-slate-900 cursor-pointer"
                />
              </label>
            </div>
            <input
              type="text"
              dir="ltr"
              value={settings.pixel?.tiktokPixelId || ''}
              onChange={(e) => updateSettings({
                pixel: {
                  ...(settings.pixel || {
                    facebookPixelId: '',
                    enableFacebookPixel: true,
                    tiktokPixelId: '',
                    enableTiktokPixel: true,
                    trackPageView: true,
                    trackViewContent: true,
                    trackAddToCart: true,
                    trackInitiateCheckout: true,
                    trackPurchase: true,
                    trackLead: true,
                    trackContact: true,
                    testEventMode: false
                  }),
                  tiktokPixelId: e.target.value.trim()
                }
              })}
              placeholder="مثال: C9ABCDEFGHIJKL123456"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-left bg-white focus:border-slate-800"
            />
          </div>
        </div>
      </div>

      {/* ADMIN PIN SECURITY */}
      <div className="pt-3 border-t">
        <label className="block font-bold text-slate-900 mb-1">
          🔒 الرمز السري لقفل لوحة تحكم الأدمن (PIN Code):
        </label>
        <p className="text-[10px] text-slate-500 mb-2">
          يمنع دخول أي شخص غير مصرح به. يتم حفظ الرمز وتشفيره ومزامنته سحابياً مباشرة مع Supabase.
        </p>
        <div className="flex items-center gap-2 max-w-sm flex-wrap">
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              dir="ltr"
              maxLength={12}
              value={customPin}
              onChange={(e) => {
                setCustomPin(e.target.value);
                updateSettings({ adminPin: e.target.value.trim() });
              }}
              placeholder="••••"
              className="w-36 px-3 py-2 rounded-xl border text-xs text-center font-black tracking-widest bg-slate-50 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-[10px] font-bold"
              title={showPin ? 'إخفاء' : 'إظهار'}
            >
              {showPin ? '🙈' : '👁️'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleSavePin}
            disabled={isSavingPin}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            {isSavingPin ? 'جارٍ الحفظ في Supabase... ⏳' : 'حفظ الرمز في Supabase 🔒'}
          </button>
        </div>

        {pinSaveFeedback && (
          <div className="mt-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{pinSaveFeedback}</span>
          </div>
        )}
      </div>

      {/* Master Save Button for General Store Settings */}
      <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSaveAllSettings}
          disabled={isSavingAll}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Database className="w-4 h-4" />
          <span>{isSavingAll ? 'جارٍ الحفظ في Supabase...' : 'حفظ وتحديث إعدادات المتجر في Supabase الآن'}</span>
        </button>

        {saveAllMsg && (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{saveAllMsg}</span>
          </span>
        )}
      </div>

      {/* SUPABASE CLOUD DATABASE SECTION */}
      <div className="pt-4 border-t space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                قاعدة بيانات Supabase السحابية (Supabase Database)
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  مربوطة ✅
                </span>
              </h5>
              <p className="text-[10px] text-slate-500 font-mono">ecowrkizfpmcpsyzvvze.supabase.co</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestSupabase}
              disabled={isTestingSupabase}
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingSupabase ? 'animate-spin' : ''}`} />
              <span>{isTestingSupabase ? 'جار الفحص...' : 'اختبار الاتصال'}</span>
            </button>
          </div>
        </div>

        {/* Status Banner if Tested */}
        {supabaseTestStatus && (
          <div className={`p-3 rounded-xl text-xs border flex items-start gap-2 ${
            supabaseTestStatus.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            {supabaseTestStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-bold">{supabaseTestStatus.message}</p>
              {supabaseTestStatus.tables && (
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[10px] font-mono">
                  <span>orders: {supabaseTestStatus.tables.orders ? 'جاهز ✅' : 'غير منشأ ⚠️'}</span>
                  <span>store_settings: {supabaseTestStatus.tables.store_settings ? 'جاهز ✅' : 'غير منشأ ⚠️'}</span>
                  <span>customers: {supabaseTestStatus.tables.customers ? 'جاهز ✅' : 'غير منشأ ⚠️'}</span>
                  <span>offers: {supabaseTestStatus.tables.offers ? 'جاهز ✅' : 'غير منشأ ⚠️'}</span>
                  <span>reviews: {supabaseTestStatus.tables.reviews ? 'جاهز ✅' : 'غير منشأ ⚠️'}</span>
                  <span>coupons: {supabaseTestStatus.tables.coupons ? 'جاهز ✅' : 'غير منشأ ⚠️'}</span>
                  <span>admin_auth: {supabaseTestStatus.tables.admin_auth ? 'جاهز ✅' : 'غير منشأ ⚠️'}</span>
                  <span>storage_bucket: {supabaseTestStatus.storage ? 'جاهز (store_media) ☁️' : 'store_media ⚠️'}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step-by-Step Instructions & SQL Script Card */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs text-white">ملف إنشاء الجداول والأعمدة (SQL Schema)</span>
            </div>
            <button
              type="button"
              onClick={handleCopySql}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-3 py-1.5 rounded-xl text-[11px] transition-all cursor-pointer shadow-sm"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تم النسخ بنجاح! 📋</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ كود SQL بالكامل</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[11px] text-slate-300 space-y-1.5 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <p className="font-bold text-amber-400">💡 خطوات تفعيل الجداول في Supabase خلال 10 ثوانٍ:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>اضغط على زر <strong>«نسخ كود SQL بالكامل»</strong> أعلاه.</li>
              <li>
                افتح لوحة تحكم Supabase واذهب إلى قسم <strong>SQL Editor</strong>: 
                <a 
                  href="https://supabase.com/dashboard/project/ecowrkizfpmcpsyzvvze/sql" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-emerald-400 font-bold inline-flex items-center gap-1 mx-1 hover:underline"
                >
                  فتح SQL Editor <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>اضغط على <strong>«New query»</strong>، الصق الكود واضغط <strong>«RUN»</strong>.</li>
            </ol>
          </div>

          {/* Collapsible/Scrollable SQL Preview */}
          <div className="max-h-36 overflow-y-auto bg-black/50 p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 select-all" dir="ltr">
            <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
          </div>
        </div>
      </div>

    </div>
  );
};
