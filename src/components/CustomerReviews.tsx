import React, { useState } from 'react';
import { Star, ThumbsUp, CheckCircle, MessageSquarePlus, Filter, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerReview } from '../types/store';

export const CustomerReviews: React.FC = () => {
  const { reviews, addReview, voteHelpful } = useStore();
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form State for new review
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const filtered = filterRating
    ? approvedReviews.filter(r => r.rating === filterRating)
    : approvedReviews;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    addReview({
      name: name.trim(),
      city: city.trim() || 'المغرب',
      rating,
      comment: comment.trim(),
      verified: true,
      tag: 'شراء مؤكد'
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmittedSuccess(false);
      setName('');
      setCity('');
      setComment('');
      setRating(5);
    }, 1500);
  };

  return (
    <section id="reviews" className="py-16 bg-white border-t border-slate-100 relative">
      <div className="-mt-[59px] max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            شهادات وتجارب حقيقية
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-3">
            ماذا يقول عملاؤنا في المغرب عن دهن Sanambio؟
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            تجارب حية من أمهات وآباء ورياضيين استعادوا راحتهم ونشاطهم اليومي بفضل الله ثم بفضل دهن السنام
          </p>
        </div>

        {/* Rating Summary Card */}
        <div className="bg-[#FAF8F3] rounded-3xl p-6 sm:p-8 border-2 border-amber-300 border-r-[6px] border-r-amber-600 shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Overall Score */}
            <div className="md:col-span-4 text-center md:border-l md:border-amber-200/80 md:pl-6">
              <span className="text-5xl font-black text-amber-700 block">4.9</span>
              <div className="flex justify-center gap-1 text-amber-500 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-600 block">
                بناءً على أكثر من 340 تقييم معتمد
              </span>
              <span className="text-[11px] text-emerald-700 font-bold block mt-1">
                ✓ 98.4% نسبة رضا وتوصية بالمنتج
              </span>
            </div>

            {/* Bars */}
            <div className="md:col-span-5 space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-12 text-left font-bold">5 نجوم</span>
                <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[94%]" />
                </div>
                <span className="w-8 text-right font-bold">94%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-left font-bold">4 نجوم</span>
                <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[5%]" />
                </div>
                <span className="w-8 text-right font-bold">5%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-left font-bold">3 نجوم</span>
                <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[1%]" />
                </div>
                <span className="w-8 text-right font-bold">1%</span>
              </div>
            </div>

            {/* Add Review Button */}
            <div className="md:col-span-3 text-center flex flex-col gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>شاركنا تجربتك وتقييمك</span>
              </button>
              <span className="text-[10px] text-slate-400">نرحب بجميع تجارب زبنائنا الكرام</span>
            </div>

          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-amber-700" />
            <span>تصفية التقييمات:</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterRating === null ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              جميع التقييمات ({approvedReviews.length})
            </button>
            <button
              onClick={() => setFilterRating(5)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterRating === 5 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ⭐ 5 نجوم
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((review) => (
            <div
              key={review.id}
              className="bg-[#FCFBF8] p-6 rounded-3xl border-2 border-amber-300/80 border-r-4 border-r-amber-500 shadow-xs hover:border-amber-400 transition-all text-right flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-900 font-black flex items-center justify-center text-sm shadow-xs">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                      <span className="text-[11px] text-slate-500">{review.city} · {review.date}</span>
                    </div>
                  </div>

                  {review.verified && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>{review.tag || 'شراء مؤكد'}</span>
                    </span>
                  )}
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 text-amber-400 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              {/* Helpful Vote Button */}
              <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                <span>هل كان هذا الرأي مفيداً؟</span>
                <button
                  onClick={() => voteHelpful(review.id)}
                  className="flex items-center gap-1.5 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>مفيد ({review.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-right">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              شاركنا رأيك في دهن سنام الجمل Sanambio
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              رأيك يهمنا ويساعد الآخرين على اتخاذ القرار الصحي المناسب
            </p>

            {submittedSuccess ? (
              <div className="p-6 text-center bg-emerald-50 rounded-2xl text-emerald-800 font-bold">
                ✓ شكراً جزيلاً لك! تمت إضافة تقييمك بنجاح.
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: يوسف العلمي"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المدينة *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثال: الرباط"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تقييمك للمنتج (بالنجوم)</label>
                  <div className="flex gap-2 justify-start py-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل تجربتك مع المنتج *</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="اكتب كيف ساعدك دهن السنام في تخفيف الألم والراحة..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm cursor-pointer"
                >
                  نشر التقييم الآن
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
