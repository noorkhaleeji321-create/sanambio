import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, ArrowRight, X, Loader2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { supabase } from '../../lib/supabase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { setViewMode, settings, updateSettings } = useStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const currentLocalPin = (settings.adminPin || '1234').trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(false);

    const enteredPin = pin.trim();

    // 1. Direct match with current active state
    if (enteredPin === currentLocalPin) {
      setViewMode('admin');
      onClose();
      setPin('');
      setIsVerifying(false);
      return;
    }

    // 2. Real-time fetch check directly from Supabase Cloud
    try {
      let cloudPin: string | null = null;

      // Check admin_auth table
      const { data: authRow } = await supabase
        .from('admin_auth')
        .select('pin_code')
        .eq('id', 'primary')
        .maybeSingle();

      if (authRow?.pin_code) {
        cloudPin = String(authRow.pin_code).trim();
      } else {
        // Check store_settings table
        const { data: storeRow } = await supabase
          .from('store_settings')
          .select('admin_pin')
          .eq('id', 'main')
          .maybeSingle();

        if (storeRow?.admin_pin) {
          cloudPin = String(storeRow.admin_pin).trim();
        }
      }

      if (cloudPin && enteredPin === cloudPin) {
        // Update state to sync
        updateSettings({ adminPin: cloudPin });
        setViewMode('admin');
        onClose();
        setPin('');
        setIsVerifying(false);
        return;
      }
    } catch (err) {
      console.warn('Direct Supabase PIN check error:', err);
    }

    // If incorrect
    setError(true);
    setIsVerifying(false);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl mx-auto flex items-center justify-center shadow-inner mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900">دخول لوحة إدارة المتجر</h3>
          <p className="text-xs text-slate-500 mt-1">
            أدخل الرقم السري للوصول للطلبات والإعدادات
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              الرمز السري (PIN):
            </label>
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                autoFocus
                disabled={isVerifying}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••"
                className={`w-full px-4 py-3 text-center text-xl tracking-widest font-black rounded-xl border focus:outline-hidden transition-all ${
                  error 
                    ? 'border-red-500 bg-red-50/50 text-red-900 focus:ring-2 focus:ring-red-200' 
                    : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                }`}
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {error && (
              <p className="text-red-600 text-[11px] font-bold mt-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>الرمز السري غير صحيح! يرجى إدخال الرمز الخاص بك.</span>
              </p>
            )}
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 text-center font-medium">
            🔒 الدخول محمي بالرمز السري الخاص بالمتجر والمحفوظ سحابياً
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isVerifying || !pin.trim()}
              className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 disabled:opacity-50 text-white font-black py-3 rounded-xl shadow-md active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ التحقق...</span>
                </>
              ) : (
                <>
                  <span>دخول للوحة التحكم</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl transition-colors text-xs cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
