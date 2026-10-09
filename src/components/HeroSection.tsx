import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Clock, Sparkles, CheckCircle2, Award, ArrowDown, Flame, PackageCheck, MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const DEFAULT_PRODUCT_JAR = 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/gallery/1791533269028_1000pexel.jpg';

export const HeroSection: React.FC = () => {
  const { settings, offers, setSelectedOfferId } = useStore();

  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 12 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Gallery array
  const gallery = settings.media?.productGallery && settings.media.productGallery.length > 0
    ? settings.media.productGallery
    : [settings.media?.heroProductImage || DEFAULT_PRODUCT_JAR];

  // Auto-slide gallery timer
  useEffect(() => {
    if (!settings.media?.autoSlideGallery || gallery.length <= 1) return;

    const slideInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % gallery.length);
    }, settings.media?.gallerySpeed || 3500);

    return () => clearInterval(slideInterval);
  }, [gallery.length, settings.media?.autoSlideGallery, settings.media?.gallerySpeed]);

  // Flash sale countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + gallery.length) % gallery.length);
  };

  const bestOffer = offers.find(o => o.popular) || offers[0];

  return (
    <section className="relative px-3.5 sm:px-6 lg:px-8 pt-4 pb-10 bg-gradient-to-b from-[#FAF7F0] via-white to-[#FDFBF7]">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Desktop 2-Column Grid / Mobile Stack */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center">
          
          {/* Content Column (Headline, Benefits, CTA) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Trust Badges Strip */}
            <div className="flex items-center lg:justify-start justify-center gap-1.5 mb-3 text-[10px] sm:text-xs font-bold text-amber-950 flex-wrap">
              <span className="bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>طبيعي 100% مغربي</span>
              </span>
              <span className="bg-emerald-100/90 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>ضمان 30 يوماً</span>
              </span>
              <span className="bg-blue-100/90 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-300 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-700" />
                <span>توصيل مجاني بالمغرب</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 lg:text-right text-center leading-tight mb-2.5">
              {settings.heroHeadline}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 lg:text-right text-center leading-relaxed mb-4 px-1">
              {settings.heroSubheadline}
            </p>

            {/* Mobile-only image position */}
            <div className="lg:hidden">
              {/* Product Image Showcase Carousel */}
              <div className="relative mb-5 mx-auto max-w-sm">
                
                {/* Floating Top Badge */}
                <div className="absolute top-2.5 right-2.5 z-20 bg-amber-500 text-white font-black text-[11px] px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sanambio® 100ML الأصلي</span>
                </div>

                {/* Floating Bottom Social Badge */}
                <div className="absolute -bottom-2.5 left-2 z-20 bg-slate-900/95 text-white px-2.5 py-1 rounded-xl shadow-lg text-[10px] font-bold border border-white/20 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span>+14,800 زبون راضٍ بالمغرب</span>
                </div>

                {/* Product Box Slider */}
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-3 border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100 p-1.5 group aspect-square flex items-center justify-center">
                  <img
                    src={gallery[currentImageIndex] || DEFAULT_PRODUCT_JAR}
                    alt={`صورة منتج دهن سنام الجمل Sanambio رقم ${currentImageIndex + 1}`}
                    referrerPolicy="no-referrer"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full aspect-square object-cover rounded-2xl transition-all duration-500 transform scale-100"
                  />

                  {/* Carousel Next / Prev Controls */}
                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        aria-label="الصورة السابقة"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer z-20"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      <button
                        onClick={nextImage}
                        aria-label="الصورة التالية"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer z-20"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {/* Dot Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                        {gallery.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-2 rounded-full transition-all cursor-pointer ${
                              idx === currentImageIndex ? 'w-5 bg-amber-400' : 'w-2 bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails row */}
                {gallery.length > 1 && (
                  <div className="flex justify-center gap-2 mt-3 overflow-x-auto pb-1">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          idx === currentImageIndex ? 'border-amber-500 scale-105 shadow-md' : 'border-slate-200 opacity-60'
                        }`}
                      >
                        <img src={img} alt="صورة مصغرة" className="w-full h-full object-contain bg-white" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3 Key Ingredients Quick Pills */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="bg-white p-2.5 rounded-xl border-2 border-amber-200/90 border-r-3 border-r-amber-600 shadow-xs">
                <span className="block text-[11px] sm:text-xs font-black text-amber-900">سنام الإبل الخالص</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500">من صحراء المغرب</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border-2 border-amber-200/90 border-r-3 border-r-amber-600 shadow-xs">
                <span className="block text-[11px] sm:text-xs font-black text-amber-900">أوميغا 3 و 6 و 9</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500">تغذية عميقة للغضروف</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border-2 border-amber-200/90 border-r-3 border-r-amber-600 shadow-xs">
                <span className="block text-[11px] sm:text-xs font-black text-amber-900">طبيعي 100%</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500">بدون كيماويات</span>
              </div>
            </div>

            {/* Direct Bullet Pain Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2 bg-amber-50/80 p-2.5 rounded-xl border-2 border-amber-200/90 border-r-3 border-r-emerald-600 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>علاج فوري لخشونة الركبة</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-50/80 p-2.5 rounded-xl border-2 border-amber-200/90 border-r-3 border-r-emerald-600 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تسكين آلام أسفل الظهر</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-50/80 p-2.5 rounded-xl border-2 border-amber-200/90 border-r-3 border-r-emerald-600 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>علاج عرق النسا (بوزلوم)</span>
              </div>
            </div>

            {/* Special Promo Card */}
            <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/60 p-4 sm:p-5 rounded-2xl border-2 border-amber-400 border-r-[6px] border-r-amber-600 shadow-md">
              {/* Price & Discount header */}
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-amber-200">
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 block">عرض خاص ومحدود:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-amber-900">{bestOffer.price} {settings.currency}</span>
                    <span className="text-xs sm:text-sm text-slate-400 line-through">{bestOffer.originalPrice} {settings.currency}</span>
                    <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md">
                      توفير {bestOffer.discountPercentage}%
                    </span>
                  </div>
                </div>

                {settings.enableStockTicker && (
                  <div className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-red-600" />
                    <span>متبقي {settings.remainingStock} فقط</span>
                  </div>
                )}
              </div>

              {/* Timer */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-3">
                <span className="flex items-center gap-1.5 text-amber-900">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>ينتهي العرض بعد:</span>
                </span>
                <div className="font-mono text-xs sm:text-sm font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-md" dir="ltr">
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                </div>
              </div>

              {/* Main CTA Order Button */}
              <a
                href="#order-form"
                onClick={() => setSelectedOfferId(bestOffer.id)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 active:scale-95 text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-xl shadow-lg transition-transform text-center mb-2"
              >
                <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>اضغط هنا للطلب - الدفع عند الاستلام</span>
              </a>

              <div className="text-center text-[10px] sm:text-xs text-slate-500 font-semibold">
                🔒 توصيل مجاني وسريع لكافة المدن · الدفع بعد المعاينة
              </div>
            </div>

          </div>

          {/* Desktop-only Right/Left Column (Image Showcase) */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="relative mx-auto max-w-md sticky top-24">
              {/* Floating Top Badge */}
              <div className="absolute -top-3 right-3 z-20 bg-amber-500 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Sanambio® 100ML الأصلي</span>
              </div>

              {/* Floating Bottom Social Badge */}
              <div className="absolute -bottom-3 left-3 z-20 bg-slate-900/95 text-white px-3 py-1.5 rounded-xl shadow-lg text-xs font-bold border border-white/20 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span>+14,800 زبون راضٍ بالمغرب</span>
              </div>

              {/* Product Box Slider */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100 p-2 group aspect-square flex items-center justify-center">
                <img
                  src={gallery[currentImageIndex] || DEFAULT_PRODUCT_JAR}
                  alt={`صورة منتج دهن سنام الجمل Sanambio رقم ${currentImageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full aspect-square object-cover rounded-2xl transition-all duration-500 transform scale-100"
                />

                {/* Carousel Next / Prev Controls */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="الصورة السابقة"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer z-20"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    <button
                      onClick={nextImage}
                      aria-label="الصورة التالية"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer z-20"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-xs">
                      {gallery.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-2.5 rounded-full transition-all cursor-pointer ${
                            idx === currentImageIndex ? 'w-6 bg-amber-400' : 'w-2.5 bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails row */}
              {gallery.length > 1 && (
                <div className="flex justify-center gap-2.5 mt-4 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        idx === currentImageIndex ? 'border-amber-500 scale-105 shadow-md ring-2 ring-amber-400/40' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="صورة مصغرة" className="w-full h-full object-contain bg-white" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
