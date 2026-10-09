import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, CheckCircle2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const MOROCCAN_BUYERS = [
  { name: 'الحاج إبراهيم', city: 'أكادير' },
  { name: 'للا فاطمة الزهراء', city: 'الدار البيضاء' },
  { name: 'رشيد البقالي', city: 'وجـدة' },
  { name: 'سي محمد العراقي', city: 'مراكش' },
  { name: 'عمر الناصري', city: 'طنجة' },
  { name: 'خديجة الفاسية', city: 'فاس' },
  { name: 'عبد الرحيم الرباطي', city: 'الرباط' },
  { name: 'مريم السوسي', city: 'تطوان' },
  { name: 'يوسف العمراني', city: 'القنيطرة' },
  { name: 'حسناء الشاوية', city: 'سطات' },
  { name: 'سي مصطفى', city: 'تمارة' },
  { name: 'أمينة السلاوية', city: 'سلا' },
  { name: 'حميد الدكالي', city: 'الجديدة' },
  { name: 'عائشة البكاري', city: 'بني ملال' },
  { name: 'سعيد الورزازي', city: 'ورزازات' },
  { name: 'نجاة الزيانية', city: 'خنيفرة' },
  { name: 'مراد الريفي', city: 'الناظور' },
  { name: 'لحسن التازي', city: 'تازة' },
  { name: 'سناء بنجلون', city: 'مراكش' },
  { name: 'عبد العالي المسفيوي', city: 'آسفي' },
  { name: 'كنزة الهواري', city: 'تارودانت' },
  { name: 'طارق البركاني', city: 'بركان' },
  { name: 'حكيمة الصحراوية', city: 'العيون' },
  { name: 'ياسين', city: 'الداخلة' },
  { name: 'وفاء', city: 'كلميم' },
  { name: 'الحاج عبد الله', city: 'فاس' },
  { name: 'لالة رجاء', city: 'الدار البيضاء' },
  { name: 'أحمد التزنيتي', city: 'تيزنيت' },
  { name: 'سميرة', city: 'برشيد' },
  { name: 'عزيز الرشيدي', city: 'الرشيدية' },
  { name: 'فدوى', city: 'العرائش' },
  { name: 'مصطفى السوسي', city: 'أيت ملول' },
  { name: 'إدريس', city: 'الرباط' },
  { name: 'الحاجة زهرة', city: 'مراكش' },
  { name: 'رضوان', city: 'الحسيمة' },
  { name: 'نادية', city: 'المحمدية' },
  { name: 'عبد الكريم', city: 'أكادير' },
  { name: 'جمال الدين', city: 'خريبكة' }
];

const TIME_PHRASES = [
  'منذ دقيقة واحدة',
  'منذ 3 دقائق',
  'منذ 5 دقائق',
  'منذ 8 دقائق',
  'منذ 12 دقيقة',
  'منذ 18 دقيقة',
  'منذ 24 دقيقة',
  'منذ لحظات'
];

export const LiveSalesNotifier: React.FC = () => {
  const { orders, offers, newOrderAlert, setSelectedOfferId } = useStore();
  const [currentSale, setCurrentSale] = useState<{
    name: string;
    city: string;
    offerTitle: string;
    offerId?: string;
    time: string;
    isRealNewOrder?: boolean;
  } | null>(null);
  const [visible, setVisible] = useState(false);
  const indexRef = useRef(Math.floor(Math.random() * MOROCCAN_BUYERS.length));

  // 1. Instantly pop up when a real customer submits an order on the site
  useEffect(() => {
    if (newOrderAlert) {
      setCurrentSale({
        name: newOrderAlert.customerName,
        city: newOrderAlert.city ? newOrderAlert.city.replace(/\s*\(.*\)/, '') : 'المغرب',
        offerTitle: newOrderAlert.offerTitle,
        offerId: newOrderAlert.offerId,
        time: 'الآن (طلب جديد تم تأكيده! 🎉)',
        isRealNewOrder: true
      });
      setVisible(true);

      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 8000);

      return () => clearTimeout(hideTimer);
    }
  }, [newOrderAlert]);

  // 2. Regular background rotation with rich Moroccan names & real Supabase orders
  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    let cycleTimer: NodeJS.Timeout;
    let isMounted = true;

    const showNextSale = () => {
      if (!isMounted) return;

      indexRef.current += 1;
      const idx = indexRef.current;

      // Mix in real orders from Supabase/Store if available (35% probability)
      if (orders && orders.length > 0 && idx % 3 === 0) {
        const realOrder = orders[idx % orders.length];
        setCurrentSale({
          name: realOrder.customerName,
          city: realOrder.city ? realOrder.city.replace(/\s*\(.*\)/, '') : 'المغرب',
          offerTitle: realOrder.offerTitle,
          offerId: realOrder.offerId,
          time: 'منذ لحظات قليلة',
          isRealNewOrder: true
        });
      } else {
        const activeOffers = offers && offers.length > 0 ? offers : [];
        let selectedOffer = activeOffers[0];

        // Heavy bias towards the best value offer (4+1 bundle)
        const primaryOffer = activeOffers.find(o => o.bestValue || o.title.includes('4 علب') || o.quantity >= 4);
        if (primaryOffer && (idx % 2 === 0 || activeOffers.length === 1)) {
          selectedOffer = primaryOffer;
        } else if (activeOffers.length > 0) {
          selectedOffer = activeOffers[idx % activeOffers.length];
        } else {
          selectedOffer = { id: 'offer-3', title: '4 علب + علبة مجاناً (الباقة العائلية)' } as any;
        }

        const buyer = MOROCCAN_BUYERS[idx % MOROCCAN_BUYERS.length];
        const timePhrase = TIME_PHRASES[idx % TIME_PHRASES.length];

        setCurrentSale({
          name: buyer.name,
          city: buyer.city,
          offerTitle: selectedOffer.title,
          offerId: selectedOffer.id,
          time: timePhrase
        });
      }

      setVisible(true);

      hideTimer = setTimeout(() => {
        if (isMounted) {
          setVisible(false);
        }
      }, 5500);
    };

    const initialTimer = setTimeout(() => {
      showNextSale();

      cycleTimer = setInterval(() => {
        showNextSale();
      }, 15000);
    }, 2500);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearInterval(cycleTimer);
    };
  }, [orders, offers]);

  const handleClickPopup = () => {
    if (currentSale?.offerId) {
      setSelectedOfferId(currentSale.offerId);
    }
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
      orderForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!visible || !currentSale) return null;

  return (
    <aside 
      aria-label="إشعار طلب مباشر"
      onClick={handleClickPopup}
      className={`fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-40 max-w-[310px] sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.15)] border-2 ${
        currentSale.isRealNewOrder ? 'border-emerald-500 ring-2 ring-emerald-400/30' : 'border-amber-400'
      } text-right flex items-center gap-3 transition-all duration-500 animate-slide-up cursor-pointer hover:border-amber-500 hover:shadow-2xl`}
      dir="rtl"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-500 text-white flex items-center justify-center shrink-0 shadow-md relative">
        <ShoppingBag className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-black text-slate-900 truncate">
            {currentSale.name} من {currentSale.city}
          </span>
          <span className="text-[10px] text-slate-400 font-medium shrink-0">
            {currentSale.time}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-bold mt-0.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">اشترى: {currentSale.offerTitle}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
        }}
        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        title="إغلاق الإشعار"
        aria-label="إغلاق"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};
