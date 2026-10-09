import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

export interface DeleteConfirmState {
  isOpen: boolean;
  title: string;
  description: string;
  itemLabel?: string;
  onConfirm: () => Promise<void> | void;
}

interface DeleteConfirmModalProps {
  confirmState: DeleteConfirmState | null;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ confirmState, onClose }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!confirmState || !confirmState.isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await confirmState.onConfirm();
    } catch (err) {
      console.warn('Error during delete action:', err);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-red-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <Trash2 className="w-8 h-8" />
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5 text-right">
          <h4 className="font-black text-base text-slate-900 text-center">
            {confirmState.title || 'تأكيد الحذف'}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium text-center">
            {confirmState.description || 'هل أنت متأكد فعلاً من رغبتك في مسح هذا العنصر؟'}
          </p>
        </div>

        {/* Target Item Label badge */}
        {confirmState.itemLabel && (
          <div className="bg-slate-100 border border-slate-200 py-2 px-3 rounded-xl text-xs font-bold text-slate-800 break-words">
            {confirmState.itemLabel}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            إلغاء والتراجع
          </button>
          
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-red-600/30 flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>جارٍ المسح من Supabase...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>نعم، مسح الآن</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
