import React from 'react';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatWhatsAppUrl } from '../lib/contactUtils';
import { trackContactEvent, trackInitiateCheckoutEvent } from '../lib/pixelEvents';

export const StickyMobileBar: React.FC = () => {
  const { offers, selectedOfferId, settings } = useStore();
  const currentOffer = offers.find(o => o.id === selectedOfferId) || offers[0];

  const handleWhatsAppClick = () => {
    trackContactEvent('whatsapp', 'شريط الشراء السفلي StickyBar', settings.pixel);
  };

  const handleOrderClick = () => {
    trackInitiateCheckoutEvent({
      name: currentOffer.title,
      price: currentOffer.price,
      quantity: currentOffer.quantity
    }, settings.pixel);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200 py-2.5 px-3 sm:px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-3">
        
        {/* Price & Shipping Info */}
        <div className="text-right">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-xl font-black text-amber-900">{currentOffer.price} {settings.currency}</span>
            <span className="text-xs text-slate-400 line-through">{currentOffer.originalPrice} {settings.currency}</span>
          </div>
          <span className="text-[10.5px] sm:text-[11px] text-emerald-700 font-bold block">
            توصيل مجاني بالمغرب · دفع عند الاستلام
          </span>
        </div>

        {/* Action Buttons: WhatsApp & Direct Order */}
        <div className="flex items-center gap-2 flex-1 max-w-[240px] sm:max-w-[260px] justify-end">
          <a
            href={formatWhatsAppUrl(settings.whatsappNumber, 'السلام عليكم، بغيت نستفسر على مرهم سنام الجمل SanamBio')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center shadow-md shrink-0 cursor-pointer"
            title="تواصل معنا عبر الواتساب"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          <a
            href="#order-form"
            onClick={handleOrderClick}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 active:scale-95 text-white font-black text-xs sm:text-sm py-2.5 px-3 rounded-xl shadow-md transition-all text-center"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>اطلب الآن</span>
          </a>
        </div>

      </div>
    </div>
  );
};
