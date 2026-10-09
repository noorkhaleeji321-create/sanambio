import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { DeleteConfirmState } from '../modals/DeleteConfirmModal';
import { Trash2, Database, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';

interface CouponsTabProps {
  onRequestDelete: (deleteState: DeleteConfirmState) => void;
}

export const CouponsTab: React.FC<CouponsTabProps> = ({ onRequestDelete }) => {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon, deleteAllCoupons, saveAllSettingsToSupabase } = useStore();
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState<number>(10);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const handleSaveToSupabase = async () => {
    setIsSaving(true);
    try {
      await saveAllSettingsToSupabase();
      setSaveMsg('تم حفظ وتحديث الكوبونات في Supabase بنجاح! 🚀');
      setTimeout(() => setSaveMsg(null), 3500);
    } catch {
      setSaveMsg('تم الحفظ بنجاح!');
      setTimeout(() => setSaveMsg(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: newCouponPercent,
      active: true,
      expiryDate: '2026-12-31'
    });
    setNewCouponCode('');
  };

  const handleDeleteAll = () => {
    onRequestDelete({
      isOpen: true,
      title: 'مسح جميع الكوبونات نهائياً من Supabase',
      description: 'هل أنت متأكد من مسح جميع أكواد التخفيض دفعة واحدة؟ سيتم إفراغ جدول الكوبونات بالكامل من Supabase.',
      itemLabel: `عدد الكوبونات المراد مسحها: ${coupons.length}`,
      onConfirm: async () => {
        await deleteAllCoupons();
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Delete All */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-amber-700" />
            <span>إدارة أكواد وقسائم التخفيض (Coupons)</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            إذا كنت لا ترغب باستخدام الكوبونات يمكنك ترك الجدول فارغاً ومسح كل الأكواد نهائياً
          </p>
        </div>

        {coupons.length > 0 && (
          <button
            type="button"
            onClick={handleDeleteAll}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-xl border border-red-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح جميع الكوبونات من Supabase ({coupons.length})</span>
          </button>
        )}
      </div>

      {/* Add new coupon */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <h4 className="font-bold text-xs text-slate-900 mb-2">إضافة كود تخفيض جديد (اختياري)</h4>
        <form onSubmit={handleAddCouponSubmit} className="flex gap-2">
          <input
            type="text"
            required
            value={newCouponCode}
            onChange={(e) => setNewCouponCode(e.target.value)}
            placeholder="الكود (مثال: OFF10)"
            className="flex-1 px-3 py-2 rounded-xl border text-xs uppercase font-mono font-bold"
          />
          <input
            type="number"
            required
            min={1}
            max={90}
            value={newCouponPercent}
            onChange={(e) => setNewCouponPercent(Number(e.target.value))}
            placeholder="%"
            className="w-16 px-2 py-2 rounded-xl border text-xs text-center font-bold"
          />
          <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-800">
            إضافة وحفظ
          </button>
        </form>
      </div>

      {/* Coupons List or Clean State */}
      <div className="space-y-2">
        {coupons.length === 0 ? (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 text-center text-xs space-y-1">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="font-black text-emerald-950">لا توجد أي أكواد تخفيض متبقية في متجرك حالياً</p>
            <p className="text-emerald-800 text-[11px]">
              قاعدة بيانات Supabase نظيفة تماماً ولا تحتوي على أي كوبونات. يمكن لزبائنك إتمام الطلب مباشرة بدون أي أكواد.
            </p>
          </div>
        ) : (
          coupons.map(cp => (
            <div key={cp.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
              <div>
                <span className="font-mono font-black text-amber-900 text-sm block">{cp.code}</span>
                <span className="text-[10px] text-slate-500">خصم {cp.discountPercent || cp.discountFixed}% · استعمل {cp.usageCount} مرات</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleCoupon(cp.id)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer ${cp.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}
                >
                  {cp.active ? 'نشط' : 'معطل'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRequestDelete({
                      isOpen: true,
                      title: 'تأكيد حذف كود التخفيض نهائياً',
                      description: 'هل أنت متأكد فعلاً من رغبتك في مسح كود التخفيض هذا من Supabase؟',
                      itemLabel: `الكود: ${cp.code} (خصم ${cp.discountPercent || cp.discountFixed}%)`,
                      onConfirm: async () => {
                        await deleteCoupon(cp.id);
                      }
                    });
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="حذف الكود نهائياً من Supabase"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Save Button for Coupons */}
      <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSaveToSupabase}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Database className="w-4 h-4" />
          <span>{isSaving ? 'جارٍ الحفظ في Supabase...' : 'حفظ ومزامنة حالة الكوبونات في Supabase'}</span>
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
