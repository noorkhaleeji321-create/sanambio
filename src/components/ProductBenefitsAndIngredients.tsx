import React from 'react';
import { Leaf, Award, ShieldAlert, Sparkles, Check, HeartHandshake } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatImageUrl } from '../lib/videoUtils';

const DEFAULT_DESERT_HERO = 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/1791499254307_Gemini_Generated_Image_qydgyrqydgyrqydg.jpg';

export const ProductBenefitsAndIngredients: React.FC = () => {
  const { settings } = useStore();
  const lifestyleImg = formatImageUrl(settings.media?.lifestyleImage, DEFAULT_DESERT_HERO);

  return (
    <section id="benefits" className="-mt-[45px] ml-0 py-12 px-3.5 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="text-center mb-8 -mt-[44px]">
          <span className="text-[10px] sm:text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
            المكونات والأصالة الصحراوية
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mt-2 mb-1.5">
            سر تركيبة Sanambio® الطبيعية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            مستخلص نقي 100% يجمع بين التراث الصحراوي ومعايير الجودة الحديثة
          </p>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          
          <div className="bg-[#FDFBF7] p-4 rounded-2xl border-2 border-amber-300/80 border-r-4 border-r-amber-600 shadow-xs text-right hover:border-amber-500 transition-all">
            <div className="text-2xl mb-1.5">🐪</div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 mb-1">
              شحم سنام الإبل الخالص
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
              غني بأحماض أوميغا الدهنية المجددة للمفاصل والغضاريف.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-4 rounded-2xl border-2 border-amber-300/80 border-r-4 border-r-amber-600 shadow-xs text-right hover:border-amber-500 transition-all">
            <div className="text-2xl mb-1.5">🌿</div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 mb-1">
              الأوكالبتوس وإكليل الجبل
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
              زيوت مهدئة ترخي العضلات وتنشط الدورة الدموية.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-4 rounded-2xl border-2 border-amber-300/80 border-r-4 border-r-amber-600 shadow-xs text-right hover:border-amber-500 transition-all">
            <div className="text-2xl mb-1.5">✨</div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 mb-1">
              فيتامين E والزيوت المهدئة
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
              تسهل الامتصاص السريع لعمق المفصل بدون ملمس دهني.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-4 rounded-2xl border-2 border-amber-300/80 border-r-4 border-r-amber-600 shadow-xs text-right hover:border-amber-500 transition-all">
            <div className="text-2xl mb-1.5">🛡️</div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 mb-1">
              نقاء 100% طبيعي
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
              خالٍ من الكورتيزون والبارابين والمواد الكيميائية.
            </p>
          </div>

        </div>

        {/* Banner with Sourcing Visual */}
        <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-amber-400 border-r-[6px] border-r-amber-600 relative bg-slate-900 text-right">
          <img
            src={lifestyleImg}
            alt="أصالة سنام الجمل الصحراوي"
            referrerPolicy="no-referrer"
            className="w-full h-56 sm:h-72 object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent flex flex-col justify-center p-6 sm:p-10 text-white max-w-2xl">
            <span className="text-amber-400 font-bold text-xs mb-1.5 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>جودة صحراوية أصيلة</span>
            </span>
            <h3 className="text-lg sm:text-2xl font-black mb-2 leading-tight">
              لماذا تثق آلاف العائلات المغربية في Sanambio®؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
              نعتمد على أجود المصادر الصحراوية الطبيعية بدون تخفيف، لقوام فريد يمتصه الجلد بسرعة ويوفر راحة تدوم طويلاً.
            </p>
            <div>
              <a
                href="#offers"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md transition-all inline-block"
              >
                شاهد العروض المتوفرة اليوم
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
