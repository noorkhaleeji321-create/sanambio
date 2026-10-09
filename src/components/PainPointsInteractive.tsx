import React, { useState } from 'react';
import { PAIN_AREAS } from '../data/initialData';
import { Activity, ShieldAlert, Zap, HeartPulse, Sparkles, CheckCircle2, Clock, ArrowLeft, Stethoscope } from 'lucide-react';
import { PainPoint } from '../types/store';
import { useStore } from '../context/StoreContext';
import { formatImageUrl } from '../lib/videoUtils';

const PAIN_AREA_DEFAULT_IMAGES: Record<string, { image: string; title: string }> = {
  knee: {
    image: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/knee_cartilage.jpg',
    title: 'تشريح مفصل الركبة: تزييت الغضروف وتعويض السائل الزلالي لمنع الاحتكاك والتآكل'
  },
  spine: {
    image: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/spine_lumbar.jpg',
    title: 'تشريح الفقرات القطنية L1-L5: إزالة تشنج عضلات الظهر وتخفيف الضغط على الأقراص الفقرية'
  },
  sciatica: {
    image: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/sciatica_nerve.jpg',
    title: 'تشريح مسار العصب الوركي (بوزلوم): تسكين التهاب العصب المضغوط ووقف تنميل الساق الممتد'
  },
  neck: {
    image: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/neck_shoulder.jpg',
    title: 'تشريح الفقرات العنقية C1-C7 والأكتاف: فك تشنج العضلات واستعادة مرونة الرقبة'
  },
  joints: {
    image: 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/pain_areas/hand_joints_rheumatism.jpg',
    title: 'تشريح مفاصل اليدين والأصابع: طرد البرودة والرطوبة وتهدئة تورم وتصلب المفاصل'
  }
};

export const PainPointsInteractive: React.FC = () => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>('knee');
  const [imageLoaded, setImageLoaded] = useState<boolean>(true);
  const { settings } = useStore();

  const selectedArea: PainPoint = PAIN_AREAS.find(a => a.id === selectedAreaId) || PAIN_AREAS[0];
  const defaultInfo = PAIN_AREA_DEFAULT_IMAGES[selectedArea.id] || PAIN_AREA_DEFAULT_IMAGES.knee;

  // Custom override if configured by admin in settings
  const customOverride = settings.media?.painAreaImages?.[selectedArea.id] ||
    (selectedArea.id === 'knee' ? settings.media?.anatomicalImage : undefined);

  const activeImage = formatImageUrl(customOverride || selectedArea.imageUrl, defaultInfo.image);
  const activeDiagramTitle = selectedArea.diagramTitle || defaultInfo.title;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'HeartPulse': return <HeartPulse className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <section id="pain-points" className="pb-[40px] px-[14px] mt-0 mb-0 mx-0 bg-white border-y border-amber-100">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase">
            استهدف مصدر الألم
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mt-2 mb-1">
            أين يتركز الألم لديك؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            انقر على منطقتك لاكتشاف مفعول دهن سنام الجمل السريع
          </p>
        </div>

        {/* Responsive Grid / Wrap Tabs for Pain Areas - All 5 fully visible on Desktop & Mobile */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-2.5 mb-6">
          {PAIN_AREAS.map((area, index) => {
            const isSelected = area.id === selectedAreaId;
            const isLastOddOnMobile = index === PAIN_AREAS.length - 1 && PAIN_AREAS.length % 2 !== 0;
            return (
              <button
                key={area.id}
                onClick={() => {
                  setSelectedAreaId(area.id);
                  setImageLoaded(false);
                }}
                className={`flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm text-center transition-all duration-200 active:scale-95 cursor-pointer shadow-xs ${
                  isLastOddOnMobile ? 'col-span-2 sm:col-auto' : ''
                } ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md ring-2 ring-amber-400/50 scale-[1.02] border-2 border-amber-600 border-r-[5px] border-r-amber-800'
                    : 'bg-white hover:bg-amber-50/80 text-slate-800 hover:text-amber-900 border-2 border-amber-300/80 hover:border-amber-400 border-r-4 border-r-amber-500'
                }`}
              >
                <span className={`p-1 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  {getIcon(area.iconName)}
                </span>
                <span className="leading-tight">{area.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Area Card */}
        <div className="bg-[#FAF8F2] rounded-3xl p-5 sm:p-7 border-2 border-amber-300 border-r-[6px] border-r-amber-600 shadow-md text-right space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-amber-800">
              العلاج المستهدف: {selectedArea.name}
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-md border border-emerald-300">
              فعالية مثبتة
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900">
            {selectedArea.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {selectedArea.description}
          </p>

          {/* Anatomical Diagram Banner with Loading Skeleton & Guaranteed Distinct Image */}
          <div className="rounded-2xl overflow-hidden border border-amber-200/80 bg-slate-900 shadow-sm relative group my-2 min-h-[176px] sm:min-h-[224px] md:min-h-[256px]">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-800 animate-pulse flex flex-col items-center justify-center text-amber-400 gap-2 z-10">
                <Stethoscope className="w-8 h-8 animate-bounce text-amber-400" />
                <span className="text-xs font-bold text-amber-200">جارٍ تحميل المخطط الطبي لـ {selectedArea.name}...</span>
              </div>
            )}
            <img
              key={selectedArea.id}
              src={activeImage}
              alt={activeDiagramTitle}
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-44 sm:h-56 md:h-64 object-cover opacity-95 group-hover:scale-105 transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== defaultInfo.image) {
                  target.src = defaultInfo.image;
                }
                setImageLoaded(true);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-3 sm:p-4 text-white pointer-events-none">
              <span className="text-[11px] sm:text-xs font-bold flex items-center gap-1.5 leading-snug">
                <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span>{activeDiagramTitle}</span>
              </span>
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-2 pt-2 border-t border-amber-200/60">
            <span className="text-xs font-bold text-slate-500 block">الأعراض المعالجة:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedArea.symptoms.map((sym, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 bg-white p-2.5 rounded-xl border-2 border-amber-200/80 border-r-3 border-r-emerald-600 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{sym}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Speed of relief */}
          <div className="bg-amber-100/70 p-3 rounded-xl text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-2 border-2 border-amber-300/80 border-r-4 border-r-amber-600">
            <Clock className="w-4 h-4 text-amber-800 shrink-0" />
            <span>سرعة الراحة: {selectedArea.reliefTime}</span>
          </div>

          {/* Link to order */}
          <div className="pt-2 text-center">
            <a
              href="#order-form"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-amber-800 hover:text-amber-950 underline decoration-amber-500"
            >
              <span>اطلب باقتك للتخلص من ألم {selectedArea.name}</span>
              <ArrowLeft className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
