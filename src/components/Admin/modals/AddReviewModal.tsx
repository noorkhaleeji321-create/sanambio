import React, { useState } from 'react';
import { CustomerReview } from '../../../types/store';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (review: Omit<CustomerReview, 'id' | 'date' | 'helpfulCount' | 'status'>) => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({ isOpen, onClose, onAddReview }) => {
  const [newRevName, setNewRevName] = useState('');
  const [newRevCity, setNewRevCity] = useState('');
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevComment, setNewRevComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRevName.trim() || !newRevComment.trim()) return;
    onAddReview({
      name: newRevName.trim(),
      city: newRevCity.trim() || 'المغرب',
      rating: newRevRating,
      comment: newRevComment.trim(),
      verified: true,
      tag: 'شراء مؤكد'
    });
    setNewRevName('');
    setNewRevCity('');
    setNewRevComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full text-right text-xs space-y-3">
        <h4 className="font-black text-sm text-slate-900">إضافة تقييم زبون جديد</h4>
        <div>
          <label className="block font-bold mb-1">اسم الزبون:</label>
          <input
            type="text"
            required
            value={newRevName}
            onChange={(e) => setNewRevName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">المدينة:</label>
          <input
            type="text"
            required
            value={newRevCity}
            onChange={(e) => setNewRevCity(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">التقييم (النجوم):</label>
          <select
            value={newRevRating}
            onChange={(e) => setNewRevRating(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border bg-white"
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5/5 ممتاز)</option>
            <option value={4}>⭐⭐⭐⭐ (4/5 جيد جداً)</option>
            <option value={3}>⭐⭐⭐ (3/5 متوسط)</option>
          </select>
        </div>
        <div>
          <label className="block font-bold mb-1">نص التقييم:</label>
          <textarea
            rows={3}
            required
            value={newRevComment}
            onChange={(e) => setNewRevComment(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border"
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-amber-600 text-white font-bold py-2 rounded-xl cursor-pointer hover:bg-amber-700"
          >
            نشر التقييم
          </button>
          <button
            onClick={onClose}
            className="bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-xl cursor-pointer hover:bg-slate-200"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
