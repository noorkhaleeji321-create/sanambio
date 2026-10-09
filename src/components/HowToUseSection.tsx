import React from 'react';
import { Sparkles, Sun, Moon, CheckCircle2 } from 'lucide-react';

export const HowToUseSection: React.FC = () => {
  return (
    <section id="how-to-use" className="-mt-[55px] py-16 bg-[#FAF8F3] border-b border-amber-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            طريقة الاستعمال الصحيحة
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-3">
            3 خطوات بسيطة للحصول على أفضل وأسرع نتيجة
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            لتحقيق أقصى استفادة من الخصائص العلاجية لدهن سنام الجمل Sanambio، ننصح باتباع هذه الخطوات:
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border-2 border-amber-300/90 border-r-[5px] border-r-amber-600 shadow-sm hover:border-amber-500 transition-all relative text-right flex flex-col justify-between">
            <div className="absolute -top-4 right-6 w-9 h-9 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-md">
              1
            </div>
            <div>
              <div className="text-3xl mb-3 mt-1">🚿</div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                الخطوة الأولى: تنظيف وتدفئة المنطقة
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                اغسل موضع الألم (الركبة، الظهر، الكتف) بالماء الدافئ وجففه جيداً بمنشفة ناعمة. التدفئة تساعد في فتح مسام الجلد لاستقبال الزيوت المغذية.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-700">
              ✓ يساعد على تسريع الامتصاص بنسبة 80%
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border-2 border-amber-400 border-r-[5px] border-r-amber-700 shadow-md hover:border-amber-500 transition-all relative text-right flex flex-col justify-between">
            <div className="absolute -top-4 right-6 w-9 h-9 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-md">
              2
            </div>
            <div>
              <div className="text-3xl mb-3 mt-1">💆‍♂️</div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                الخطوة الثانية: التدليك الدائري اللطيف
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                ضع كمية مناسبة بحجم حبة الحمص من دهن Sanambio، وقم بالتدليك بلطف بحركات دائرية هادئة لمدة 5 إلى 7 دقائق حتى يتشربه الجلد كلياً وتصل الحرارة للمفصل.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700">
              ✓ إحساس فوري بالدفء واسترخاء العضلات
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border-2 border-amber-300/90 border-r-[5px] border-r-amber-600 shadow-sm hover:border-amber-500 transition-all relative text-right flex flex-col justify-between">
            <div className="absolute -top-4 right-6 w-9 h-9 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-md">
              3
            </div>
            <div>
              <div className="text-3xl mb-3 mt-1">🧣</div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                الخطوة الثالثة: التدفئة والتكرار اليومي
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                غطِ المنطقة بلباس قطني دافئ وتجنب التعرض المباشر لتيارات الهواء البارد. كرر هذه العملية مرتين يومياً (صباحاً وقبل النوم) لمدة أسبوعين لنتائج دائمة.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-700">
              ✓ حماية المفصل وبناء مرونة الغضاريف
            </div>
          </div>

        </div>

        {/* Schedule Recommendation Box */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Sun className="w-5 h-5" />
              </span>
              <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <Moon className="w-5 h-5" />
              </span>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold block text-slate-900">
                برنامج الاستعمال الموصى به: مرتان في اليوم (صباحاً ومساءً)
              </span>
              <span className="text-[11px] text-slate-500">
                عبوة واحدة تكفي لمدة شهر تقريباً · باقة 2 أو 3 علب تضمن إتمام الكورس العلاجي الشامل
              </span>
            </div>
          </div>
          
          <a
            href="#offers"
            className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all whitespace-nowrap"
          >
            اطلب كورس العلاج الآن
          </a>
        </div>

      </div>
    </section>
  );
};
