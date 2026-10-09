import React from 'react';
import { Phone, MessageCircle, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatWhatsAppUrl, formatPhoneCallUrl } from '../lib/contactUtils';
import { trackContactEvent } from '../lib/pixelEvents';

interface HeaderProps {
  onOpenTracking?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTracking }) => {
  const { settings } = useStore();

  const handleWhatsAppContact = () => {
    trackContactEvent('whatsapp', 'أيقونة الواتساب - رأس الصفحة', settings.pixel);
  };

  const handlePhoneContact = () => {
    trackContactEvent('phone', 'أيقونة الاتصال - رأس الصفحة', settings.pixel);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      {/* Mobile Announcement Bar with 100% gapless continuous streaming ticker */}
      {settings.enableAnnouncement && (
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-100 text-[11px] py-1.5 shadow-inner border-b border-amber-800/40 w-full overflow-hidden">
          <div className="continuous-marquee-wrapper">
            {/* Track 1 */}
            <div className="continuous-marquee-track" dir="rtl">
              <span className="inline-flex items-center gap-1.5 px-3">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                <span>{settings.announcementText}</span>
              </span>
              <span className="text-amber-400/90 px-2 shrink-0">✦</span>
              <span className="inline-flex items-center gap-1.5 px-3">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                <span>{settings.announcementText}</span>
              </span>
              <span className="text-amber-400/90 px-2 shrink-0">✦</span>
            </div>

            {/* Track 2 (Exact Clone for Infinite 0-gap continuous stream) */}
            <div className="continuous-marquee-track" dir="rtl" aria-hidden="true">
              <span className="inline-flex items-center gap-1.5 px-3">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                <span>{settings.announcementText}</span>
              </span>
              <span className="text-amber-400/90 px-2 shrink-0">✦</span>
              <span className="inline-flex items-center gap-1.5 px-3">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                <span>{settings.announcementText}</span>
              </span>
              <span className="text-amber-400/90 px-2 shrink-0">✦</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-amber-300/80 shadow-xs bg-amber-50 shrink-0 flex items-center justify-center p-0.5 group">
            <img
              src={settings.media?.logoUrl || settings.logoUrl || "https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/branding/1791456167148_653709227_122105396001285073_676431221204038800_n.jpg"}
              alt={settings.storeName || "Sanambio"}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              fetchPriority="high"
            />
            {/* Live Network & Online Status Indicator */}
            {(settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl) ? (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full overflow-hidden border border-white shadow-xs bg-white flex items-center justify-center"
                title="أيقونة حالة الشبكة / الكرة الأرضية"
              >
                <img
                  src={settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl}
                  alt="Network Status"
                  className="w-full h-full object-cover"
                />
              </span>
            ) : (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs flex items-center justify-center"
                title="متجر معتمد ومتصل مباشرة (Live)"
              >
                <span className="w-1 h-1 bg-white rounded-full animate-ping opacity-75"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-base font-black text-slate-900 leading-none">Sanambio<span className="text-amber-600">®</span></span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">أصلي</span>
            </div>
            <span className="text-[10px] text-amber-800 font-bold block -mt-0.5">
              دهن سنام الجمل الطبيعي
            </span>
          </div>
        </a>

        {/* Quick WhatsApp, Call & Tracking Action Icons */}
        <div className="flex items-center gap-1.5">
          {onOpenTracking && (
            <button
              type="button"
              onClick={onOpenTracking}
              className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 active:scale-95 text-xs font-bold py-1.5 px-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="تتبع حالة طلبيتك"
            >
              <Truck className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">تتبع الطلب</span>
            </button>
          )}

          <a
            href={formatWhatsAppUrl(settings.whatsappNumber, 'السلام عليكم، بغيت نستفسر على مرهم سنام الجمل SanamBio')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppContact}
            className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
            title="محادثة واتساب سريعة ومباشرة"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          <a
            href={formatPhoneCallUrl(settings.phone)}
            onClick={handlePhoneContact}
            className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
            title="اتصال هاتفي مباشر"
          >
            <Phone className="w-4 h-4" />
          </a>

          <a
            href="#order-form"
            className="bg-gradient-to-r from-amber-600 to-amber-500 active:scale-95 text-white text-xs font-black py-1.5 px-3 rounded-xl shadow-xs"
          >
            طلب سريع
          </a>
        </div>

      </div>
    </header>
  );
};

