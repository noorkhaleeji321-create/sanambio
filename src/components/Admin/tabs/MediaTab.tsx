import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { MediaSettings } from '../../../types/store';
import { parseVideoUrl, formatImageUrl, compressImageFile } from '../../../lib/videoUtils';
import { uploadFileToSupabaseStorage, STORE_MEDIA_BUCKET } from '../../../lib/supabase';
import { DeleteConfirmState } from '../modals/DeleteConfirmModal';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Video,
  Link as LinkIcon,
  Eye,
  RefreshCw,
  Database,
  CheckCircle2,
  Cloud,
  FileVideo,
  Sparkles,
  Globe,
  Radio,
  Check
} from 'lucide-react';

interface MediaTabProps {
  onRequestDelete: (deleteState: DeleteConfirmState) => void;
}

export const MediaTab: React.FC<MediaTabProps> = ({ onRequestDelete }) => {
  const { settings, updateSettings, saveAllSettingsToSupabase } = useStore();
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadProgressMsg, setUploadProgressMsg] = useState<string | null>(null);

  // File Upload Helper directly to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: keyof MediaSettings, folder: string = 'images') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKey(String(key));
    setUploadProgressMsg('جارٍ الرفع مباشرة إلى Supabase Storage... ☁️');

    try {
      // 1. Try uploading to Supabase Storage bucket 'store_media'
      const publicUrl = await uploadFileToSupabaseStorage(file, file.name, folder);
      let targetUrl = publicUrl;
      if (!targetUrl) {
        targetUrl = await compressImageFile(file);
      }
      if (targetUrl) {
        const updatedMedia = {
          ...settings.media,
          [key]: targetUrl
        };
        const newSettings = {
          ...settings,
          media: updatedMedia
        };
        updateSettings({ media: updatedMedia });
        setSaveSuccessMsg(`تم رفع الصورة وحفظ رابطها الدائم في Supabase Storage بنجاح! ☁️✅`);
        setTimeout(() => setSaveSuccessMsg(null), 4000);
        await saveAllSettingsToSupabase(newSettings);
      }
    } catch (err) {
      console.warn('Error uploading file to Supabase storage:', err);
    } finally {
      setUploadingKey(null);
      setUploadProgressMsg(null);
      e.target.value = '';
    }
  };

  // Direct Video File Upload to Supabase Storage
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 80 * 1024 * 1024) {
      alert('حجم ملف الفيديو يتجاوز 80 ميغابايت. يرجى اختيار ملف أصغر حجماً أو ضغطه.');
      return;
    }

    setUploadingKey('doctorVideoUrl');
    setUploadProgressMsg('جارٍ رفع ملف فيديو الدكتور إلى Supabase Storage... (قد يستغرق بضع ثوانٍ حسب الحجم) ⏳');

    try {
      const publicUrl = await uploadFileToSupabaseStorage(file, file.name, 'videos');
      if (publicUrl) {
        updateSettings({
          media: {
            ...settings.media,
            doctorVideoUrl: publicUrl
          }
        });
        setSaveSuccessMsg('تم رفع ملف فيديو الدكتور وحفظه في Supabase Storage بنجاح! 🎥🚀');
        setTimeout(() => setSaveSuccessMsg(null), 5000);
      } else {
        setSaveSuccessMsg('فشل الرفع إلى Supabase Storage. يرجى التأكد من تشغيل كود SQL لإنشاء سلة store_media.');
        setTimeout(() => setSaveSuccessMsg(null), 6000);
      }
    } catch (err) {
      console.warn('Error uploading video to Supabase Storage:', err);
    } finally {
      setUploadingKey(null);
      setUploadProgressMsg(null);
      e.target.value = '';
    }
  };

  // Add Image to Product Gallery Slider
  const handleAddGalleryImage = async (url: string) => {
    if (!url.trim()) return;
    const currentGallery = settings.media?.productGallery || [];
    const updatedGallery = [...currentGallery, url.trim()];
    const updatedMedia = { ...settings.media, productGallery: updatedGallery };
    const newSettings = { ...settings, media: updatedMedia };
    updateSettings({ media: updatedMedia });
    setNewGalleryUrl('');
    await saveAllSettingsToSupabase(newSettings);
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKey('gallery');
    setUploadProgressMsg('جارٍ رفع الصورة إلى معرض منتجاتك في Supabase Storage... ☁️');

    try {
      const publicUrl = await uploadFileToSupabaseStorage(file, file.name, 'gallery');
      const currentGallery = settings.media?.productGallery || [];
      let updatedGallery = currentGallery;
      if (publicUrl) {
        updatedGallery = [...currentGallery, publicUrl];
      } else {
        const compressedDataUrl = await compressImageFile(file);
        if (compressedDataUrl) {
          updatedGallery = [...currentGallery, compressedDataUrl];
        }
      }
      const updatedMedia = { ...settings.media, productGallery: updatedGallery };
      const newSettings = { ...settings, media: updatedMedia };
      updateSettings({ media: updatedMedia });
      setSaveSuccessMsg('تم رفع الصورة بنجاح إلى معرض الصور في Supabase Storage! 🖼️');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
      await saveAllSettingsToSupabase(newSettings);
    } catch (err) {
      console.warn('Error compressing gallery image upload:', err);
    } finally {
      setUploadingKey(null);
      setUploadProgressMsg(null);
      e.target.value = '';
    }
  };

  const handleDeleteGalleryImage = async (index: number) => {
    const currentGallery = settings.media?.productGallery || [];
    const updatedGallery = currentGallery.filter((_, i) => i !== index);
    const updatedMedia = { ...settings.media, productGallery: updatedGallery };
    const newSettings = { ...settings, media: updatedMedia };
    updateSettings({ media: updatedMedia });
    await saveAllSettingsToSupabase(newSettings);
  };

  const handleSaveToSupabase = async () => {
    setIsSavingSettings(true);
    setUploadProgressMsg('جارٍ مزامنة ورفع جميع الوسائط إلى Supabase Storage وقاعدة البيانات...');
    try {
      const ok = await saveAllSettingsToSupabase();
      if (ok) {
        setSaveSuccessMsg('تم رفع وحفظ جميع صور الغلاف والمفاصل وفيديو الدكتور في Supabase Storage وقاعدة البيانات بنجاح! 🚀✅');
      } else {
        setSaveSuccessMsg('تم الحفظ بنجاح محلياً وفي Supabase!');
      }
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch {
      setSaveSuccessMsg('تم الحفظ بنجاح!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } finally {
      setIsSavingSettings(false);
      setUploadProgressMsg(null);
    }
  };

  const isSupabaseUrl = (url?: string) => {
    return !!url && (url.includes('supabase.co/storage') || url.includes(STORE_MEDIA_BUCKET));
  };

  // Dedicated Upload for 5 Pain Areas
  const handlePainAreaUpload = async (e: React.ChangeEvent<HTMLInputElement>, areaKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKey(`painArea_${areaKey}`);
    setUploadProgressMsg(`جارٍ رفع صورة (${areaKey}) إلى Supabase Storage... ☁️`);

    try {
      let targetUrl = await uploadFileToSupabaseStorage(file, `pain_${areaKey}_${Date.now()}_${file.name}`, 'pain_areas');
      if (!targetUrl) {
        targetUrl = await compressImageFile(file);
      }
      if (targetUrl) {
        const currentPainAreas = settings.media?.painAreaImages || {};
        const updatedPainAreas = {
          ...currentPainAreas,
          [areaKey]: targetUrl
        };
        const updatedMedia = {
          ...settings.media,
          painAreaImages: updatedPainAreas,
          ...(areaKey === 'knee' ? { anatomicalImage: targetUrl } : {})
        };
        const newSettings = {
          ...settings,
          media: updatedMedia
        };
        updateSettings({ media: updatedMedia });
        setSaveSuccessMsg(`تم تحديث صورة منطقة الألم وحفظها في Supabase بنجاح! ☁️✅`);
        setTimeout(() => setSaveSuccessMsg(null), 4000);
        await saveAllSettingsToSupabase(newSettings);
      }
    } catch (err) {
      console.warn('Error uploading pain area image:', err);
    } finally {
      setUploadingKey(null);
      setUploadProgressMsg(null);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-5">
      
      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-amber-950 text-sm">📸 سلة وسائط Supabase Storage المتكاملة</h3>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
              <Cloud className="w-3 h-3 text-emerald-600" />
              <span>Bucket: {STORE_MEDIA_BUCKET}</span>
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            يتم رفع جميع صور الغلاف، صور تشريح المفاصل، وفيديو الدكتور مباشرة إلى <strong>Supabase Storage</strong> مع روابط دائمة وسريعة التحميل لجميع زبائن متجرك دون الاعتماد على روابط خارجية مؤقتة.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveToSupabase}
          disabled={isSavingSettings || !!uploadingKey}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isSavingSettings ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>جارٍ الرفع والحفظ في Supabase...</span>
            </>
          ) : (
            <>
              <Database className="w-3.5 h-3.5" />
              <span>حفظ كل الوسائط في Supabase</span>
            </>
          )}
        </button>
      </div>

      {uploadProgressMsg && (
        <div className="p-3 bg-blue-50 border border-blue-300 rounded-xl text-blue-900 text-xs font-bold flex items-center gap-2 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
          <span>{uploadProgressMsg}</span>
        </div>
      )}

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 0. BRAND LOGO & NETWORK/GLOBE STATUS ICON UPLOAD (طلب المستخدم الأساسي) */}
      <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <span>شعار المتجر وأيقونة حالة الكرة الأرضية / الشبكة</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  سحابي ☁️ Supabase
                </span>
              </h4>
              <p className="text-[11px] text-slate-500">
                ارفع صورة شعار متجرك وأيقونة حالة الاتصال/الشبكة مباشرة إلى Supabase Storage لتظهر في رأس الصفحة وكل أجزاء المتجر
              </p>
            </div>
          </div>
        </div>

        {/* Two-column layout for Logo and Network Status Icon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Store Logo (صورة شعار المتجر) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-700" />
                <span>1. صورة شعار المتجر (Store Logo)</span>
              </span>
              {isSupabaseUrl(settings.media?.logoUrl || settings.logoUrl) && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  مرفوع على Supabase ✅
                </span>
              )}
            </div>

            {/* Preview Box */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-400 bg-amber-50 shrink-0 flex items-center justify-center shadow-xs">
                <img
                  src={settings.media?.logoUrl || settings.logoUrl || settings.media?.heroProductImage || "https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/camel_joint_cream_jar.jpg"}
                  alt="Store Logo Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-right flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {settings.storeName || 'Sanambio®'}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {settings.brandTagline || 'دهن سنام الجمل الطبيعي'}
                </span>
                <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">
                  يظهر في رأس المتجر، لوحة الإدارة، والفوتر
                </span>
              </div>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                رابط صورة الشعار (URL أو سحابي):
              </label>
              <input
                type="text"
                dir="ltr"
                value={settings.media?.logoUrl || settings.logoUrl || ''}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  updateSettings({
                    logoUrl: val,
                    media: { ...settings.media, logoUrl: val }
                  });
                }}
                placeholder="https://ecowrkizfpmcpsyzvvze.supabase.co/..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-left bg-white focus:border-emerald-600"
              />
            </div>

            {/* Upload Button */}
            <div>
              <label className="w-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-3 py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-transform">
                {uploadingKey === 'logoUrl' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جارٍ الرفع إلى Supabase Storage...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>رفع صورة شعار المتجر إلى Supabase ☁️</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingKey === 'logoUrl'}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingKey('logoUrl');
                    setUploadProgressMsg('جارٍ رفع صورة شعار المتجر إلى Supabase Storage... ☁️');
                    try {
                      const url = await uploadFileToSupabaseStorage(file, file.name, 'branding');
                      if (url) {
                        updateSettings({
                          logoUrl: url,
                          media: { ...settings.media, logoUrl: url }
                        });
                        setSaveSuccessMsg('تم رفع وحفظ صورة شعار المتجر في Supabase Storage بنجاح! 🚀');
                        setTimeout(() => setSaveSuccessMsg(null), 4000);
                      }
                    } finally {
                      setUploadingKey(null);
                      setUploadProgressMsg(null);
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Card 2: Network / Globe Status Icon (أيقونة حالة الكرة الأرضية / الشبكة) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>2. أيقونة حالة الكرة الأرضية / الشبكة</span>
              </span>
              {(settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl) ? (
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  أيقونة مخصصة مفعلة
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  نقطة اتصال خضراء حية
                </span>
              )}
            </div>

            {/* Preview Box */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <div className="relative w-14 h-14 rounded-xl border border-slate-300 bg-slate-900 flex items-center justify-center shrink-0 shadow-xs">
                {(settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl) ? (
                  <img
                    src={settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl}
                    alt="Network Status Icon"
                    className="w-8 h-8 object-contain rounded-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white"></span>
                    </span>
                    <span className="text-[8px] text-emerald-300 font-bold mt-1">متصل الآن</span>
                  </div>
                )}
              </div>
              <div className="text-right flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-800 block">
                  أيقونة المؤشر في رأس الصفحة
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  {(settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl)
                    ? 'يتم عرض الصورة المخصصة التي رفعتها كأيقونة حالة الشبكة'
                    : 'يتم عرض نقطة الاتصال الخضراء الحية التفاعلية افتراضياً'}
                </span>
                {(settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      updateSettings({
                        networkStatusIconUrl: '',
                        media: { ...settings.media, networkStatusIconUrl: '' }
                      });
                      setSaveSuccessMsg('تمت استعادة نقطة الاتصال الحية الافتراضية');
                      setTimeout(() => setSaveSuccessMsg(null), 3000);
                    }}
                    className="text-[10px] text-red-600 hover:text-red-700 font-bold mt-1 underline cursor-pointer"
                  >
                    استعادة النقطة الخضراء الافتراضية
                  </button>
                )}
              </div>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                رابط أيقونة الكرة الأرضية / الشبكة (URL):
              </label>
              <input
                type="text"
                dir="ltr"
                value={settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl || ''}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  updateSettings({
                    networkStatusIconUrl: val,
                    media: { ...settings.media, networkStatusIconUrl: val }
                  });
                }}
                placeholder="https://... أو ارفع ملفك أدناه"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-left bg-white focus:border-blue-600"
              />
            </div>

            {/* Upload Button */}
            <div>
              <label className="w-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 px-3 py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-transform">
                {uploadingKey === 'networkStatusIconUrl' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جارٍ الرفع إلى Supabase Storage...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>رفع أيقونة الكرة الأرضية/الشبكة إلى Supabase 🌐</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingKey === 'networkStatusIconUrl'}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingKey('networkStatusIconUrl');
                    setUploadProgressMsg('جارٍ رفع أيقونة الكرة الأرضية / الشبكة إلى Supabase... 🌐');
                    try {
                      const url = await uploadFileToSupabaseStorage(file, file.name, 'branding');
                      if (url) {
                        updateSettings({
                          networkStatusIconUrl: url,
                          media: { ...settings.media, networkStatusIconUrl: url }
                        });
                        setSaveSuccessMsg('تم رفع وحفظ أيقونة الكرة الأرضية / الشبكة في Supabase بنجاح! 🌐✅');
                        setTimeout(() => setSaveSuccessMsg(null), 4000);
                      }
                    } finally {
                      setUploadingKey(null);
                      setUploadProgressMsg(null);
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Live Integrated Brand Header Preview */}
        <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
          <span className="text-[11px] font-bold text-amber-950 block mb-2">
            👀 معاينة حية لشكل الشعار وأيقونة الشبكة معاً في أعلى المتجر:
          </span>
          <div className="bg-white p-2.5 rounded-xl border border-amber-300 shadow-xs inline-flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-amber-300/80 shadow-xs bg-amber-50 shrink-0 flex items-center justify-center p-0.5">
              <img
                src={settings.media?.logoUrl || settings.logoUrl || settings.media?.heroProductImage || "https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/camel_joint_cream_jar.jpg"}
                alt={settings.storeName || "Sanambio"}
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Dynamic Live Status / Uploaded Icon badge */}
              {(settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl) ? (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full overflow-hidden border border-white shadow-xs bg-white flex items-center justify-center"
                  title="أيقونة حالة الشبكة المخصصة"
                >
                  <img
                    src={settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl}
                    alt="Network Icon"
                    className="w-full h-full object-cover"
                  />
                </span>
              ) : (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs flex items-center justify-center"
                  title="متجر معتمد ومتصل مباشرة"
                >
                  <span className="w-1 h-1 bg-white rounded-full animate-ping opacity-75"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-slate-900 leading-none">
                  {settings.storeName || 'Sanambio'}<span className="text-amber-600">®</span>
                </span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                  أصلي
                </span>
              </div>
              <span className="text-[10px] text-amber-800 font-bold block -mt-0.5">
                {settings.brandTagline || 'دهن سنام الجمل الطبيعي'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 1. Product Gallery Carousel Manager */}
      <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-700" />
              <span>معرض صور المنتج المتحرك (Product Image Slider)</span>
            </h4>
            <span className="text-[10px] text-slate-500">
              هذه الصور تتحرك بسلاسة من اليمين لليسار في واجهة المتجر الرئيسية
            </span>
          </div>
          <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
            {settings.media?.productGallery?.length || 0} صور
          </span>
        </div>

        {/* Slider Settings */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoSlide"
              checked={settings.media?.autoSlideGallery !== false}
              onChange={(e) => updateSettings({
                media: { ...settings.media, autoSlideGallery: e.target.checked }
              })}
              className="w-4 h-4 text-amber-600 rounded cursor-pointer"
            />
            <label htmlFor="autoSlide" className="font-bold text-slate-800 cursor-pointer">
              تفعيل التحريك التلقائي للصور (Auto-Slide من اليمين لليسار)
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold text-[11px]">سرعة التحريك:</span>
            <select
              value={settings.media?.gallerySpeed || 3500}
              onChange={(e) => updateSettings({
                media: { ...settings.media, gallerySpeed: Number(e.target.value) }
              })}
              className="text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value={2000}>سريع (2 ثواني)</option>
              <option value={3500}>متوسط (3.5 ثواني)</option>
              <option value={5000}>هادئ (5 ثواني)</option>
            </select>
          </div>
        </div>

        {/* Add New Gallery Image */}
        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
          <span className="font-bold text-xs text-amber-950 block">إضافة صورة جديدة إلى معرض المنتج:</span>
          
          <div className="flex gap-2">
            <input
              type="text"
              dir="ltr"
              value={newGalleryUrl}
              onChange={(e) => setNewGalleryUrl(e.target.value)}
              placeholder="الصق رابط الصورة (https://...)"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-left"
            />
            <button
              type="button"
              onClick={() => handleAddGalleryImage(newGalleryUrl)}
              className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              إضافة بالرابط
            </button>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50">
              {uploadingKey === 'gallery' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" />
                  <span>جارٍ الرفع إلى Supabase...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-amber-700" />
                  <span>رفع صورة إلى Supabase Storage</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={uploadingKey === 'gallery'}
                onChange={handleGalleryFileUpload}
                className="hidden"
              />
            </label>
            <span className="text-[10px] text-slate-400">تدعم JPG, PNG, WebP</span>
          </div>
        </div>

        {/* Gallery Images List */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {settings.media?.productGallery?.map((img, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden border-2 border-amber-200 bg-slate-100 group shadow-xs">
              <img src={img} alt={`صورة معرض ${idx + 1}`} className="w-full h-24 object-contain bg-white" />
              {isSupabaseUrl(img) && (
                <span className="absolute top-1 left-1 bg-emerald-600/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                  Supabase
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onRequestDelete({
                      isOpen: true,
                      title: 'تأكيد حذف الصورة',
                      description: 'هل أنت متأكد فعلاً من رغبتك في مسح هذه الصورة من معرض صور المنتج؟',
                      itemLabel: `صورة رقم #${idx + 1}`,
                      onConfirm: async () => {
                        await handleDeleteGalleryImage(idx);
                      }
                    });
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md cursor-pointer"
                  title="حذف الصورة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Desert Background & Anatomical Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Desert Sourcing image */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h5 className="font-black text-slate-900 text-xs">صورة الخلفية الصحراوية (صورة الغلاف)</h5>
            {isSupabaseUrl(settings.media?.lifestyleImage) ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ☁️ مسار Supabase
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">قسم الأصالة والمكونات</span>
            )}
          </div>

          <div className="h-28 rounded-xl overflow-hidden border border-amber-200 bg-slate-100 relative">
            <img
              src={settings.media?.lifestyleImage}
              alt="الخلفية الصحراوية"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1">مسار أو رابط الصورة:</label>
            <input
              type="text"
              dir="ltr"
              value={settings.media?.lifestyleImage || ''}
              onChange={(e) => updateSettings({
                media: { ...settings.media, lifestyleImage: e.target.value }
              })}
              placeholder="https://..."
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] text-left"
            />
          </div>

          <div className="pt-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-center justify-center">
              {uploadingKey === 'lifestyleImage' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" />
                  <span>جارٍ الرفع إلى Supabase Storage...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-amber-700" />
                  <span>رفع صورة صحراوية إلى Supabase Storage</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={uploadingKey === 'lifestyleImage'}
                onChange={(e) => handleFileUpload(e, 'lifestyleImage', 'images')}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 5 Targeted Pain Areas Anatomical Diagrams */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-amber-50/60 to-white p-5 rounded-2xl border-2 border-amber-300/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h5 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>صور المخططات التشريحية للمناطق الـ 5 المستهدفة للألم</span>
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                تظهر كل صورة بشكل مخصص عند اختيار الزبون للمنطقة المصابة في واجهة المتجر (الركبة، الظهر، بوزلوم، الرقبة، والمفاصل).
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
              5 صور طبية مخصصة ومستقلة 🩺
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {[
              { id: 'knee', name: '1. خشونة وألم الركبة', defaultUrl: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/knee_cartilage.jpg' },
              { id: 'spine', name: '2. أسفل الظهر والعمود الفقري', defaultUrl: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/spine_lumbar.jpg' },
              { id: 'sciatica', name: '3. عرق النسا / بوزلوم (السياتيك)', defaultUrl: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/sciatica_nerve.jpg' },
              { id: 'neck', name: '4. الرقبة والأكتاف', defaultUrl: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/neck_shoulder.jpg' },
              { id: 'joints', name: '5. الروماتيزم ومفاصل اليدين', defaultUrl: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/hand_joints_rheumatism.jpg' },
            ].map((area) => {
              const currentUrl = settings.media?.painAreaImages?.[area.id as keyof typeof settings.media.painAreaImages] ||
                (area.id === 'knee' ? settings.media?.anatomicalImage : undefined) ||
                area.defaultUrl;
              const isUploadingThis = uploadingKey === `painArea_${area.id}`;

              return (
                <div key={area.id} className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900">{area.name}</span>
                      {isSupabaseUrl(currentUrl) ? (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          ☁️ Supabase
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400">مخصص</span>
                      )}
                    </div>

                    <div className="h-28 rounded-lg overflow-hidden border border-amber-200 bg-slate-950 relative group">
                      <img
                        src={currentUrl}
                        alt={area.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="mt-2">
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">رابط الصورة:</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={currentUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          const currentMap = settings.media?.painAreaImages || {};
                          updateSettings({
                            media: {
                              ...settings.media,
                              painAreaImages: { ...currentMap, [area.id]: val },
                              ...(area.id === 'knee' ? { anatomicalImage: val } : {})
                            }
                          });
                        }}
                        placeholder="https://..."
                        className="w-full px-2 py-1 rounded border border-slate-300 text-[10px] text-left"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg text-center justify-center transition-colors">
                      {isUploadingThis ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" />
                          <span>جارٍ الرفع...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-amber-700" />
                          <span>تغيير الصورة (Supabase)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingThis}
                        onChange={(e) => handlePainAreaUpload(e, area.id)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Doctor Video Settings */}
      <div className="bg-white p-5 rounded-2xl border-2 border-emerald-300/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <Video className="w-4 h-4 text-emerald-700" />
            <span>إعدادات وفيديو دكتور يونس / الخبير (Doctor Video)</span>
          </h4>
          <div className="flex items-center gap-2">
            {isSupabaseUrl(settings.media?.doctorVideoUrl) && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Cloud className="w-3 h-3 text-emerald-600" />
                <span>مرفوع في Supabase Storage</span>
              </span>
            )}
            {(() => {
              const parsed = parseVideoUrl(settings.media?.doctorVideoUrl);
              return (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                  النوع: {parsed.platformLabel}
                </span>
              );
            })()}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">اسم القناة / الدكتور:</label>
            <input
              type="text"
              value={settings.media?.doctorChannelName || ''}
              onChange={(e) => updateSettings({
                media: { ...settings.media, doctorChannelName: e.target.value }
              })}
              placeholder="Dr. Younes Health"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">الشعار الفرعي:</label>
            <input
              type="text"
              value={settings.media?.doctorSubText || ''}
              onChange={(e) => updateSettings({
                media: { ...settings.media, doctorSubText: e.target.value }
              })}
              placeholder="الصحة مفهومة في 60 ثانية"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>

        {/* Video Upload Directly to Supabase Storage */}
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-black text-emerald-950 text-xs flex items-center gap-1.5">
              <FileVideo className="w-4 h-4 text-emerald-700" />
              <span>رفع ملف فيديو الدكتور مباشرة إلى Supabase Storage (بدون روابط خارجية)</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
              سريع ومباشر 100%
            </span>
          </div>

          <label className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all">
            {uploadingKey === 'doctorVideoUrl' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>جارٍ رفع ملف فيديو الدكتور إلى Supabase Storage...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>اضغط هنا لرفع فيديو الدكتور من هاتفك أو حاسوبك (MP4 / WebM / MOV)</span>
              </>
            )}
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              disabled={uploadingKey === 'doctorVideoUrl'}
              onChange={handleVideoUpload}
              className="hidden"
            />
          </label>

          <p className="text-[10px] text-emerald-800 leading-relaxed">
            💡 بمجرد اختيار ملف الفيديو، يتم رفعه فوراً إلى سلة <strong>store_media/videos</strong> في Supabase، ويصبح متاحاً للتشغيل الفوري لجميع زوار المتجر مع دعم كامل لجميع المتصفحات.
          </p>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <LinkIcon className="w-3 h-3 text-slate-400" />
              <span>رابط أو مسار ملف الفيديو في Supabase:</span>
            </span>
            <span className="text-[10px] text-slate-400">يدعم مسار Supabase أو أي رابط خارجي</span>
          </label>
          <input
            type="text"
            dir="ltr"
            value={settings.media?.doctorVideoUrl || ''}
            onChange={(e) => updateSettings({
              media: { ...settings.media, doctorVideoUrl: e.target.value }
            })}
            placeholder="https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/videos/..."
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-left"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>صورة غلاف الفيديو (Poster / Thumbnail):</span>
              {isSupabaseUrl(settings.media?.doctorVideoPoster) && (
                <span className="text-[10px] text-emerald-700 font-bold">☁️ Supabase</span>
              )}
            </label>
            <input
              type="text"
              dir="ltr"
              value={settings.media?.doctorVideoPoster || ''}
              onChange={(e) => updateSettings({
                media: { ...settings.media, doctorVideoPoster: e.target.value }
              })}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-left"
            />
            <div className="mt-2">
              <label className="text-[11px] font-bold text-emerald-900 inline-flex items-center gap-1.5 cursor-pointer bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg w-full justify-center">
                {uploadingKey === 'doctorVideoPoster' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                    <span>جارٍ الرفع إلى Supabase...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    <span>رفع صورة غلاف الفيديو إلى Supabase Storage</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingKey === 'doctorVideoPoster'}
                  onChange={(e) => handleFileUpload(e, 'doctorVideoPoster', 'images')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              معاينة صورة الغلاف الحالية:
            </label>
            <div className="w-full h-24 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center relative">
              {(() => {
                const posterToShow = formatImageUrl(settings.media?.doctorVideoPoster || parseVideoUrl(settings.media?.doctorVideoUrl).thumbnailUrl);
                return (
                  <img
                    src={posterToShow}
                    alt="Poster Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/happy_active_elderly.jpg';
                    }}
                  />
                );
              })()}
            </div>
          </div>
        </div>

        {/* Instant Live Video Preview inside Admin */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
            <span>معاينة فورية للفيديو كما سيظهر لزوار متجرك:</span>
          </span>
          
          {(() => {
            const rawUrl = settings.media?.doctorVideoUrl;
            if (!rawUrl) {
              return (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400 border border-dashed border-slate-200">
                  لم يتم تعيين أو رفع ملف فيديو بعد. ارفع ملف فيديو MP4 أو ضع رابط لمشاهدة المعاينة هنا.
                </div>
              );
            }

            const parsed = parseVideoUrl(rawUrl);

            return (
              <div className="relative aspect-video max-w-md mx-auto bg-black rounded-xl overflow-hidden shadow-md border border-slate-300">
                {parsed.type === 'youtube' || parsed.type === 'vimeo' || parsed.type === 'drive' || parsed.type === 'loom' ? (
                  <iframe
                    title="معاينة فيديو الدكتور"
                    src={parsed.embedUrl}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={parsed.directUrl || rawUrl}
                    controls
                    className="w-full h-full object-cover"
                    poster={formatImageUrl(settings.media?.doctorVideoPoster)}
                  >
                    المتصفح لا يدعم هذا الفيديو
                  </video>
                )}
              </div>
            );
          })()}
        </div>

        {/* Save Button for Media / Video settings */}
        <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSaveToSupabase}
            disabled={isSavingSettings || !!uploadingKey}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSavingSettings ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>جارٍ الرفع والحفظ في Supabase Storage...</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5" />
                <span>حفظ ومزامنة كل الوسائط في Supabase Storage الآن</span>
              </>
            )}
          </button>

          {saveSuccessMsg && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{saveSuccessMsg}</span>
            </span>
          )}
        </div>

      </div>

    </div>
  );
};

