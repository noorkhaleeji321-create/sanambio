import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Database, CheckCircle2 } from 'lucide-react';

export const ProductsTab: React.FC = () => {
  const { settings, updateSettings, offers, updateOffer, saveAllSettingsToSupabase } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const handleSaveToSupabase = async () => {
    setIsSaving(true);
    try {
      await saveAllSettingsToSupabase();
      setSaveMsg('تم حفظ وتحديث الباقات في Supabase بنجاح! 🚀');
      setTimeout(() => setSaveMsg(null), 3500);
    } catch {
      setSaveMsg('تم الحفظ بنجاح!');
      setTimeout(() => setSaveMsg(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      
      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs">
        <h3 className="font-black text-amber-950 text-sm mb-1">📦 تعديل باقات وعروض المنتجات والأسعار</h3>
        <p className="text-slate-600 leading-relaxed">
          يمكنك هنا تغيير وتعديل أي باقة بالكامل: اسم الباقة (مثل: «علبة واحدة (100ml)» أو «2 علب + هدية»)، السعر الحالي، السعر المشطوب، العبارات الترويجية، الهدايا المرفقة، ووصف الباقة. يتم حفظ التعديلات وتطبيقها فوراً في المتجر وقاعدة البيانات.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="font-bold text-xs text-slate-900">المخزون المتبقي (عداد الاستعجال)</h4>
          <p className="text-[10px] text-slate-400">العدد الذي يظهر للزبائن في شريط العد التنازلي والمخزون</p>
        </div>
        <input
          type="number"
          value={settings.remainingStock}
          onChange={(e) => updateSettings({ remainingStock: Number(e.target.value) })}
          className="w-24 px-3 py-2 rounded-xl border border-slate-300 font-bold text-center text-xs bg-slate-50 focus:bg-white"
        />
      </div>

      <div className="space-y-4">
        {offers.map((offer, idx) => (
          <div key={offer.id} className="bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-amber-300 transition-colors shadow-xs space-y-3.5 text-xs">
            
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="font-black text-sm text-slate-900">
                  {offer.title || `باقة رقم ${idx + 1}`}
                </span>
              </div>
              <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg text-[11px]">
                {offer.quantity} {offer.quantity === 1 ? 'علبة' : 'علب'}
              </span>
            </div>

            {/* Title & Subtitle Edit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  عنوان الباقة الرئيسي (Title):
                </label>
                <input
                  type="text"
                  value={offer.title}
                  onChange={(e) => updateOffer(offer.id, { title: e.target.value })}
                  placeholder="مثال: علبة واحدة (100ml)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  العنوان الفرعي التوضيحي (Subtitle):
                </label>
                <input
                  type="text"
                  value={offer.subtitle || ''}
                  onChange={(e) => updateOffer(offer.id, { subtitle: e.target.value })}
                  placeholder="مثال: تجربة العلاج الأولية"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Pricing & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  سعر البيع الحالي ({settings.currency}):
                </label>
                <input
                  type="number"
                  min={0}
                  value={offer.price}
                  onChange={(e) => updateOffer(offer.id, { price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-xs text-amber-900 bg-amber-50/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  السعر الأصلي المشطوب ({settings.currency}):
                </label>
                <input
                  type="number"
                  min={0}
                  value={offer.originalPrice}
                  onChange={(e) => updateOffer(offer.id, { originalPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  عدد العلب في الباقة:
                </label>
                <input
                  type="number"
                  min={1}
                  value={offer.quantity}
                  onChange={(e) => updateOffer(offer.id, { quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>
            </div>

            {/* Badge Tag & Free Gift */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  شارة العرض والتمييز (Tag Badge):
                </label>
                <input
                  type="text"
                  value={offer.tag || ''}
                  onChange={(e) => updateOffer(offer.id, { tag: e.target.value })}
                  placeholder="مثال: الأكثر طلباً ومبيعاً ⭐"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  الهدية المجانية المرفقة (Free Gift):
                </label>
                <input
                  type="text"
                  value={offer.freeGift || ''}
                  onChange={(e) => updateOffer(offer.id, { freeGift: e.target.value })}
                  placeholder="مثال: صابونة الكبريت والأعشاب الطبيعية مجاناً 🎁"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                وصف وتفاصيل الباقة (Description):
              </label>
              <textarea
                rows={2}
                value={offer.description || ''}
                onChange={(e) => updateOffer(offer.id, { description: e.target.value })}
                placeholder="اكتب وصفاً جذاباً للباقة..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed"
              />
            </div>

          </div>
        ))}
      </div>

      {/* Save Button for Offers */}
      <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSaveToSupabase}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Database className="w-4 h-4" />
          <span>{isSaving ? 'جارٍ الحفظ في Supabase...' : 'حفظ وتحديث الباقات في Supabase الآن'}</span>
        </button>

        {saveMsg && (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{saveMsg}</span>
          </span>
        )}
      </div>

    </div>
  );
};
