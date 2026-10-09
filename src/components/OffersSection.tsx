import React from 'react';
import { Check, Flame, Gift, Sparkles, ShieldCheck, Truck, ArrowDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { trackAddToCartEvent, trackInitiateCheckoutEvent } from '../lib/pixelEvents';

export const OffersSection: React.FC = () => {
  const { offers, selectedOfferId, setSelectedOfferId, settings } = useStore();

  const handleSelectOffer = (offerId: string) => {
    setSelectedOfferId(offerId);
    
    // Dispatch Pixel Events (AddToCart + InitiateCheckout)
    const chosenOffer = offers.find(o => o.id === offerId);
    if (chosenOffer) {
      trackAddToCartEvent({
        name: chosenOffer.title,
        price: chosenOffer.price,
        quantity: chosenOffer.quantity,
        id: chosenOffer.id
      }, settings.pixel);
      
      trackInitiateCheckoutEvent({
        name: chosenOffer.title,
        price: chosenOffer.price,
        quantity: chosenOffer.quantity
      }, settings.pixel);
    }

    const formElement = document.getElementById('order-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="offers" className="-mt-[37px] py-12 px-3.5 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="text-center mb-8 -mt-[42px]">
          <span className="text-[10px] sm:text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase">
            عروض وتخفيضات اليوم
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mt-2 mb-1.5">
            اختر الباقة الأنسب لك
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            توصيل مجاني 100% والدفع عند الاستلام بعد معاينة الطرد
          </p>
        </div>

        {/* Offers Grid (1 col on mobile, 3 cols on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 items-stretch">
          {offers.map((offer) => {
            const isSelected = offer.id === selectedOfferId;
            const isPopular = offer.popular;
            const isBestValue = offer.bestValue;

            return (
              <div
                key={offer.id}
                onClick={() => handleSelectOffer(offer.id)}
                className={`relative rounded-3xl p-5 sm:p-6 transition-all active:scale-98 cursor-pointer text-right border-2 flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/80 shadow-xl ring-2 ring-amber-400/30 border-r-[6px] border-r-amber-700'
                    : isPopular
                    ? 'border-amber-400 bg-[#FCFBF8] shadow-md hover:border-amber-500 border-r-[6px] border-r-amber-600'
                    : 'border-amber-300/80 bg-white hover:border-amber-500 border-r-[6px] border-r-amber-500 shadow-sm'
                }`}
              >
                {/* Tag Badge */}
                {offer.tag && (
                  <div className={`absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                    isPopular
                      ? 'bg-amber-600 text-white'
                      : isBestValue
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-800 text-white'
                  }`}>
                    {offer.tag}
                  </div>
                )}

                <div>
                  {/* Title & Price Header */}
                  <div className="flex items-start justify-between gap-2 mt-1 mb-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                        {offer.title}
                      </h3>
                      <span className="text-xs text-slate-500 block mt-0.5">{offer.subtitle}</span>
                    </div>

                    <div className="text-left" dir="ltr">
                      <span className="text-xl sm:text-2xl font-black text-amber-900 block">{offer.price} {settings.currency}</span>
                      <span className="text-xs text-slate-400 line-through">{offer.originalPrice} {settings.currency}</span>
                    </div>
                  </div>

                  {/* Free Gift Strip */}
                  {offer.freeGift && (
                    <div className="mb-3 bg-emerald-100/80 text-emerald-900 text-xs font-bold p-2 rounded-xl flex items-center gap-2">
                      <Gift className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{offer.freeGift}</span>
                    </div>
                  )}

                  {/* Short feature description */}
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                {/* Button */}
                <button
                  type="button"
                  className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-800 border border-slate-300'
                  }`}
                >
                  <span>{isSelected ? '✓ تم اختيار هذه الباقة' : 'اختر هذه الباقة'}</span>
                  <ArrowDown className="w-4 h-4" />
                </button>

              </div>
            );
          })}
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center text-xs text-slate-700">
          <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-amber-200/90 border-r-4 border-r-amber-600 shadow-xs">
            <Truck className="w-5 h-5 text-amber-700 mx-auto mb-1.5" />
            <span className="font-bold block text-xs sm:text-sm">توصيل مجاني</span>
            <span className="text-[10px] sm:text-xs text-slate-400">24-48 ساعة</span>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-amber-200/90 border-r-4 border-r-emerald-600 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-700 mx-auto mb-1.5" />
            <span className="font-bold block text-xs sm:text-sm">دفع عند الاستلام</span>
            <span className="text-[10px] sm:text-xs text-slate-400">بعد المعاينة</span>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-amber-200/90 border-r-4 border-r-amber-500 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
            <span className="font-bold block text-xs sm:text-sm">ضمان الفعالية</span>
            <span className="text-[10px] sm:text-xs text-slate-400">30 يوماً</span>
          </div>
        </div>

      </div>
    </section>
  );
};
