import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  AlertCircle, 
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types/store';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialQuery = ''
}) => {
  const { orders, settings } = useStore();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  // Auto-search if initialQuery changes
  React.useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  if (!isOpen) return null;

  const performSearch = (q: string) => {
    const clean = q.trim().toUpperCase();
    if (!clean) return;

    setSearched(true);
    // Search by orderNumber, phone, id, or trackingCode
    const match = orders.find(o => 
      o.orderNumber.toUpperCase() === clean ||
      o.id.toUpperCase() === clean ||
      o.phone.replace(/\s+/g, '').includes(clean.replace(/\s+/g, '')) ||
      (o.trackingCode && o.trackingCode.toUpperCase().includes(clean))
    );

    setFoundOrder(match || null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return {
          title: 'تم استلام طلبك وجارٍ مراجعته',
          step: 1,
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
          desc: 'تم تسجيل معلوماتك في نظامنا بنجاح، وسيتصل بك فريقنا الهاتفي لتأكيد موعد الشحن.'
        };
      case 'confirmed':
        return {
          title: 'تم تأكيد طلبك وجارٍ التجهيز والتغليف',
          step: 2,
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          desc: 'تم تأكيد طلبيتك بنجاح، ويتم حالياً تغليف طردك بعناية تمهيداً لتسليمه لشركة الشحن السريع.'
        };
      case 'shipping':
        return {
          title: 'الطلبية في طريقها إليك مع موزع التوصيل 🚚',
          step: 3,
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
          desc: 'طردك الآن مع موزع التوصيل الخاص بمدينتك، وسيتصل بك الموزع لتحديد ساعة التسليم بدقة.'
        };
      case 'delivered':
        return {
          title: 'تم تسليم الطلبية بنجاح 🎉',
          step: 4,
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          desc: 'تم تسليم الطرد للزبون بالكامل. نتمنى لك دوام الصحة والعافية والشفاء التام!'
        };
      case 'cancelled':
        return {
          title: 'تم إلغاء الطلبية',
          step: 0,
          badgeColor: 'bg-red-100 text-red-800 border-red-300',
          desc: 'تم إلغاء هذا الطلب بناءً على رغبة الزبون أو عدم الرد على المكالمات الهاتفية.'
        };
      default:
        return {
          title: 'قيد المعالجة',
          step: 1,
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
          desc: 'طلبك قيد المتابعة حالياً.'
        };
    }
  };

  const statusInfo = foundOrder ? getStatusInfo(foundOrder.status) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in" dir="rtl">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-amber-300 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base">تتبع حالة طلبيتك مباشرة 📦</h3>
              <p className="text-[10px] text-amber-100">أدخل رقم الطلب أو رقم هاتفك لمعرفة موقع ومرحلة شحنتك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-amber-50/50 border-b border-amber-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="أدخل رقم طلبك (مثال: SNB-1090) أو رقم هاتفك..."
                className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs bg-white text-right focus:border-amber-600 focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              تتبع الطلب
            </button>
          </form>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-right">
          {searched && !foundOrder && (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-black text-slate-800 text-sm">لم يتم العثور على أي طلب بهذا الرقم</h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                تأكد من كتابة رقم الطلب بشكل صحيح (مثال: <strong>SNB-XXXX</strong>) أو جرب البحث برقم هاتفك الذي سجلت به الطلب.
              </p>
            </div>
          )}

          {foundOrder && statusInfo && (
            <div className="space-y-4">
              {/* Order Status Badge & Title */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${statusInfo.badgeColor}`}>
                    {statusInfo.title}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-600">
                    رقم الطلب: <strong className="text-amber-800">{foundOrder.orderNumber}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {statusInfo.desc}
                </p>

                {foundOrder.trackingCode && (
                  <div className="text-[11px] bg-slate-100 p-2 rounded-lg text-slate-600 font-mono flex items-center justify-between">
                    <span>رقم بوليصة الإرسال السريع:</span>
                    <strong className="text-slate-900">{foundOrder.trackingCode}</strong>
                  </div>
                )}
              </div>

              {/* Progress Steps Timeline */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-3">مسار الشحنة:</span>
                <div className="space-y-3 relative pr-3">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3 relative">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      statusInfo.step >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      ✓
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">1. استلام وتسجيل الطلب</span>
                      <span className="text-[10px] text-slate-500 block">تم استلام معلومات الزبون بنجاح</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3 relative">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      statusInfo.step >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {statusInfo.step >= 2 ? '✓' : '2'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">2. تأكيد الطلب هاتفياً</span>
                      <span className="text-[10px] text-slate-500 block">تأكيد العنوان وجهوزية الزبون للاستلام</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3 relative">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      statusInfo.step >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {statusInfo.step >= 3 ? '✓' : '3'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">3. خروج الطرد مع موزع التوصيل</span>
                      <span className="text-[10px] text-slate-500 block">التوصيل جاري لعنوان الزبون (24-48 ساعة)</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-3 relative">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      statusInfo.step >= 4 ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {statusInfo.step >= 4 ? '✓' : '4'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">4. التسليم والدفع بعد المعاينة</span>
                      <span className="text-[10px] text-slate-500 block">معاينة الطرد والتأكد منه ثم الدفع للموزع</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Info Card */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">اسم الزبون:</span>
                  <span className="font-bold text-slate-900">{foundOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">الباقة:</span>
                  <span className="font-bold text-slate-900">{foundOrder.offerTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">المدينة والعنوان:</span>
                  <span className="font-bold text-slate-900">{foundOrder.city} - {foundOrder.address}</span>
                </div>
                <div className="flex justify-between border-t pt-1.5 mt-1.5">
                  <span className="text-slate-700 font-bold">المبلغ المطلوب عند الاستلام:</span>
                  <span className="font-black text-emerald-700 text-sm">
                    {foundOrder.totalAmount} {settings.currency || 'درهم'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!searched && (
            <div className="text-center py-6 text-slate-400 space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto text-amber-300 opacity-60" />
              <p className="text-xs text-slate-500">
                أدخل رقم طلبك أعلاه لعرض مسار الشحنة بالكامل في ثوانٍ معدودة.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
