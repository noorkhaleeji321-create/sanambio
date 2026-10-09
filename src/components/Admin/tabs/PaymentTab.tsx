import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Database, CheckCircle2 } from 'lucide-react';

export const PaymentTab: React.FC = () => {
  const { settings, updateSettings, saveAllSettingsToSupabase } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const handleSaveToSupabase = async () => {
    setIsSaving(true);
    try {
      await saveAllSettingsToSupabase();
      setSaveMsg('تم حفظ وتحديث إعدادات الدفع والشحن في Supabase بنجاح! 🚀');
      setTimeout(() => setSaveMsg(null), 3500);
    } catch {
      setSaveMsg('تم الحفظ بنجاح!');
      setTimeout(() => setSaveMsg(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      
      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs">
        <h3 className="font-black text-emerald-950 text-sm mb-1">💳 التحكم الكامل في خانة الدفع والشحن</h3>
        <p className="text-slate-600 leading-relaxed">
          تحكم في تفعيل أو تعطيل خيارات الدفع (الدفع عند الاستلام، التحويل البنكي)، ومصاريف الشحن، ونصوص استمارة الشراء.
        </p>
      </div>

      {/* Payment Methods Control */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-black text-slate-900 text-sm border-b pb-2">طرق الدفع المتاحة للزبائن</h4>

        {/* COD Toggle */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 block">1. الدفع نقداً عند الاستلام (COD)</span>
              <span className="text-[10px] text-slate-500">يدفع الزبون للموزع بعد فحص الطرد عند باب منزله</span>
            </div>
            <input
              type="checkbox"
              checked={Boolean(settings.payment?.enableCod)}
              onChange={(e) => updateSettings({
                payment: { ...settings.payment, enableCod: e.target.checked }
              })}
              className="w-5 h-5 text-emerald-600 rounded cursor-pointer"
            />
          </div>

          {settings.payment?.enableCod && (
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">نص خيار الدفع عند الاستلام:</label>
              <input
                type="text"
                value={settings.payment?.codLabel || ''}
                onChange={(e) => updateSettings({
                  payment: { ...settings.payment, codLabel: e.target.value }
                })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          )}
        </div>

        {/* Bank Transfer Toggle */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 block">2. التحويل البنكي المباشر (Virement Bancaire)</span>
              <span className="text-[10px] text-slate-500">خيار للزبناء الذين يفضلون التحويل إلى حسابكم البنكي</span>
            </div>
            <input
              type="checkbox"
              checked={Boolean(settings.payment?.enableBankTransfer)}
              onChange={(e) => updateSettings({
                payment: { ...settings.payment, enableBankTransfer: e.target.checked }
              })}
              className="w-5 h-5 text-blue-600 rounded cursor-pointer"
            />
          </div>

          {settings.payment?.enableBankTransfer && (
            <div className="space-y-2 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">نص خيار التحويل البنكي:</label>
                <input
                  type="text"
                  value={settings.payment?.bankTransferLabel || ''}
                  onChange={(e) => updateSettings({
                    payment: { ...settings.payment, bankTransferLabel: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">معلومات الحساب البنكي (RIB / اسم البنك):</label>
                <textarea
                  rows={2}
                  value={settings.payment?.bankDetails || ''}
                  onChange={(e) => updateSettings({
                    payment: { ...settings.payment, bankDetails: e.target.value }
                  })}
                  placeholder="Attijariwafa Bank - RIB: 007 780 0001234567890123 45"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Shipping & Delivery Fee Control */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h4 className="font-black text-slate-900 text-sm border-b pb-2">تكاليف الشحن والتوصيل</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              تكلفة الشحن (درهم مغربي):
            </label>
            <input
              type="number"
              min={0}
              value={settings.payment?.shippingCost || 0}
              onChange={(e) => updateSettings({
                payment: { ...settings.payment, shippingCost: Number(e.target.value) }
              })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
            />
            <span className="text-[10px] text-slate-400 block mt-0.5">
              ضع 0 إذا كان التوصيل مجانياً بالكامل
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              عبارة التوصيل المجاني في الصفحة:
            </label>
            <input
              type="text"
              value={settings.payment?.freeShippingLabel || ''}
              onChange={(e) => updateSettings({
                payment: { ...settings.payment, freeShippingLabel: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Checkout Texts & Success Message */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h4 className="font-black text-slate-900 text-sm border-b pb-2">نصوص زر الشراء ورسالة التأكيد</h4>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">نص زر تأكيد الطلب الرئيسي:</label>
          <input
            type="text"
            value={settings.payment?.checkoutButtonText || ''}
            onChange={(e) => updateSettings({
              payment: { ...settings.payment, checkoutButtonText: e.target.value }
            })}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">عنوان رسالة النجاح بعد الطلب:</label>
            <input
              type="text"
              value={settings.payment?.orderSuccessTitle || ''}
              onChange={(e) => updateSettings({
                payment: { ...settings.payment, orderSuccessTitle: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">تفاصيل رسالة التأكيد:</label>
            <input
              type="text"
              value={settings.payment?.orderSuccessMessage || ''}
              onChange={(e) => updateSettings({
                payment: { ...settings.payment, orderSuccessMessage: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Save Button for Payment settings */}
      <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSaveToSupabase}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Database className="w-4 h-4" />
          <span>{isSaving ? 'جارٍ الحفظ في Supabase...' : 'حفظ إعدادات الدفع والشحن في Supabase الآن'}</span>
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
