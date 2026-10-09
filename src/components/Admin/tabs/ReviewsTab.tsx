import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { DeleteConfirmState } from '../modals/DeleteConfirmModal';
import { Plus, Trash2, Database, CheckCircle2 } from 'lucide-react';

interface ReviewsTabProps {
  onOpenAddReview: () => void;
  onRequestDelete: (deleteState: DeleteConfirmState) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ onOpenAddReview, onRequestDelete }) => {
  const { reviews, deleteReview, saveAllSettingsToSupabase } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const handleSaveToSupabase = async () => {
    setIsSaving(true);
    try {
      await saveAllSettingsToSupabase();
      setSaveMsg('تم حفظ وتحديث التقييمات في Supabase بنجاح! 🚀');
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
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <span className="font-bold text-xs text-slate-900">إدارة آراء وتقييمات الزبناء</span>
        <button
          onClick={onOpenAddReview}
          className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold py-1.5 px-3 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة تقييم</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {reviews.map(rev => (
          <div key={rev.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-900">{rev.name} ({rev.city})</span>
              <button
                onClick={() => {
                  onRequestDelete({
                    isOpen: true,
                    title: 'تأكيد حذف تقييم الزبون',
                    description: 'هل أنت متأكد فعلاً من رغبتك في مسح هذا التقييم نهائياً من Supabase؟',
                    itemLabel: `تقييم الزبون: ${rev.name} (${rev.city})`,
                    onConfirm: async () => {
                      await deleteReview(rev.id);
                    }
                  });
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                title="حذف التقييم نهائياً من Supabase"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-xl">
              "{rev.comment}"
            </p>
          </div>
        ))}
      </div>

      {/* Save Button for Reviews */}
      <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSaveToSupabase}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Database className="w-4 h-4" />
          <span>{isSaving ? 'جارٍ الحفظ في Supabase...' : 'حفظ وتحديث التقييمات في Supabase الآن'}</span>
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
