import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Clock, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  MessageCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { Order, StoreSettings } from '../types/store';
import { formatWhatsAppUrl, formatPhoneCallUrl } from '../lib/contactUtils';

interface OrderConfirmationPageProps {
  order: Order;
  settings: StoreSettings;
  onResetOrder: () => void;
  onOpenTracking: (orderNumber: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  settings,
  onResetOrder,
  onOpenTracking
}) => {
  const [copied, setCopied] = useState(false);

  const copyOrderNumber = () => {
    navigator.clipboard?.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'new': return 1;
      case 'confirmed': return 2;
      case 'shipping': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const currentStep = getStatusStep(order.status);

  const whatsappConfirmMessage = `السلام عليكم ورحمة الله، قمت بتأكيد طلبي في موقع Sanambio:\n- رقم الطلب: ${order.orderNumber}\n- الاسم: ${order.customerName}\n- الباقة: ${order.offerTitle}\n- المبلغ الإجمالي: ${order.totalAmount} ${settings.currency || 'درهم'}\n- المدينة: ${order.city}\n- العنوان: ${order.address}\n\nيرجى تأكيد موعد الشحن والتسليم. شكراً لكم!`;

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-3.5 sm:px-6 animate-fade-in" dir="rtl">
      {/* Top Success Banner */}
      <div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-400 overflow-hidden mb-6 text-center">
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="w-20 h-20 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg ring-8 ring-white/20 animate-bounce">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>

          <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-1 rounded-full mb-2 border border-white/30">
            تم تسجيل طلبك بنجاح وسرعة فائقة 🎉
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-white drop-shadow-sm">
            شكراً لثقتك بنا يا {order.customerName} ❤️
          </h1>

          <p className="text-sm sm:text-base text-emerald-50 font-medium max-w-xl mx-auto leading-relaxed">
            طلبك الآن مسجل في نظامنا وجارٍ تجهيزه. سيتصل بك فريق خدمة العملاء خلال ساعات قليلة لتأكيد موعد الشحن والتسليم حتى باب منزلك.
          </p>

          {/* Order ID Tag with Instant Copy */}
          <div className="mt-5 inline-flex items-center gap-2 bg-emerald-950/40 backdrop-blur-md border border-emerald-300/40 px-4 py-2 rounded-2xl">
            <span className="text-xs text-emerald-200">رقم تتبع طلبك:</span>
            <strong className="font-mono text-base sm:text-lg text-amber-300 tracking-wider">
              {order.orderNumber}
            </strong>
            <button
              onClick={copyOrderNumber}
              type="button"
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer text-white"
              title="نسخ رقم الطلب"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && (
            <span className="block text-[11px] text-amber-200 font-bold mt-1">
              ✓ تم نسخ رقم الطلب إلى الحافظة!
            </span>
          )}
        </div>

        {/* Live Tracking Visual Progress Bar */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>مراحل معالجة وشحن طلبيتك:</span>
            </span>
            <button
              onClick={() => onOpenTracking(order.orderNumber)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 underline cursor-pointer"
            >
              <span>تتبع طلبيتي بالتفصيل</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            {/* Step 1: Received */}
            <div className="space-y-1.5">
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                currentStep >= 1 ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-500'
              }`}>
                ✓
              </div>
              <span className={`text-[11px] font-bold block ${currentStep >= 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
                تم استلام الطلب
              </span>
              <span className="text-[9px] text-slate-400 block hidden sm:block">قيد المراجعة</span>
            </div>

            {/* Step 2: Confirmed */}
            <div className="space-y-1.5">
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                currentStep >= 2 ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-500'
              }`}>
                2
              </div>
              <span className={`text-[11px] font-bold block ${currentStep >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
                تأكيد المكالمة
              </span>
              <span className="text-[9px] text-slate-400 block hidden sm:block">خلال ساعات</span>
            </div>

            {/* Step 3: Out for delivery */}
            <div className="space-y-1.5">
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                currentStep >= 3 ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-500'
              }`}>
                3
              </div>
              <span className={`text-[11px] font-bold block ${currentStep >= 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
                مع شركة الشحن
              </span>
              <span className="text-[9px] text-slate-400 block hidden sm:block">24 إلى 48 ساعة</span>
            </div>

            {/* Step 4: Delivered */}
            <div className="space-y-1.5">
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                currentStep >= 4 ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-500'
              }`}>
                4
              </div>
              <span className={`text-[11px] font-bold block ${currentStep >= 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
                التسليم والدفع
              </span>
              <span className="text-[9px] text-slate-400 block hidden sm:block">عند المعاينة</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Immediate VIP Action */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-white to-amber-50/50 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-right flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-black text-emerald-900 text-sm block mb-0.5">
                ⚡ هل ترغب في تسريع معالجة طلبيتك وشحنها كأولوية قصوى؟
              </span>
              <p className="text-xs text-emerald-700 leading-relaxed">
                تواصل معنا مباشرة عبر الواتساب بنقرة واحدة لتأكيد طلبيتك فوراً بدون انتظار مكالمة هاتفية!
              </p>
            </div>
            <a
              href={formatWhatsAppUrl(settings.whatsappNumber, whatsappConfirmMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>تأكيد عبر الواتساب فوراً</span>
            </a>
          </div>

          {/* Order Details Invoice-like Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 text-right space-y-3">
            <h3 className="font-black text-slate-900 text-sm border-b pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <span>ملخص تفاصيل الطلب</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500 font-mono">
                {new Date(order.createdAt).toLocaleDateString('ar-MA')}
              </span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-500">الباقة المختارة:</span>
                <span className="font-black text-slate-900 text-sm">{order.offerTitle}</span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-500">طريقة الأداء:</span>
                <span className="font-bold text-slate-800">
                  {order.paymentMethod === 'BANK_TRANSFER' ? 'تحويل بنكي مباشر' : 'الدفع نقداً عند الاستلام (COD)'}
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-500">مصاريف الشحن:</span>
                <span className="font-bold text-emerald-700">توصيل مجاني لجميع المدن (0 درهم)</span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-amber-50/60 -mx-4 px-4 rounded-xl">
                <span className="font-black text-slate-900 text-sm">المبلغ الإجمالي المطلوب عند الاستلام:</span>
                <span className="font-black text-emerald-700 text-base sm:text-lg">
                  {order.totalAmount} {settings.currency || 'درهم'}
                </span>
              </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2 mt-3">
              <span className="font-bold text-slate-700 block text-[11px] mb-1">معلومات التسليم المسجلة:</span>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>المدينة والعنوان:</strong> {order.city} - {order.address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>رقم الهاتف:</strong> <span dir="ltr" className="font-mono font-bold">{order.phone}</span></span>
              </div>
              {order.notes && (
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <strong>ملاحظات التسليم:</strong> {order.notes}
                </div>
              )}
            </div>

            {/* Satisfaction Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ضمان أصالة المنتج 100% وحق معاينة الطرد والتأكد من محتواه قبل الدفع لموزع التوصيل.</span>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              onClick={() => onOpenTracking(order.orderNumber)}
              type="button"
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>تتبع حالة هذه الطلبية الآن</span>
            </button>

            <button
              onClick={onResetOrder}
              type="button"
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>العودة للمتجر</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
