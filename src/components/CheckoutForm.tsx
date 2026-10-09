import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { MOROCCAN_CITIES } from '../data/initialData';
import { ShoppingBag, CheckCircle2, ShieldCheck, Truck, Tag, Phone, MapPin, User, FileText, Gift, Sparkles, MessageCircle, CreditCard, Banknote, ExternalLink } from 'lucide-react';
import { Order, PaymentMethod } from '../types/store';
import { formatWhatsAppUrl } from '../lib/contactUtils';
import { trackPurchaseEvent, trackInitiateCheckoutEvent, trackContactEvent } from '../lib/pixelEvents';
import { validateMoroccanPhone, checkDuplicatePhoneOrder, recordSubmittedPhone } from '../lib/spamProtection';

interface CheckoutFormProps {
  onOrderSuccess?: (order: Order) => void;
  onOpenTracking?: (orderNumber?: string) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onOrderSuccess, onOpenTracking }) => {
  const { offers, selectedOfferId, setSelectedOfferId, addOrder, coupons, applyCoupon, settings } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(MOROCCAN_CITIES[0]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ valid: boolean; discountAmount: number; message: string } | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasTriggeredInitiateCheckout, setHasTriggeredInitiateCheckout] = useState(false);

  // Debounce cooldown timer for submit button lock
  useEffect(() => {
    if (submitCooldown <= 0) return;
    const timer = setInterval(() => {
      setSubmitCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [submitCooldown]);

  const currentOffer = offers.find(o => o.id === selectedOfferId) || offers[0];

  // Trigger InitiateCheckout when user first interacts with the checkout inputs
  const handleInputFocus = () => {
    if (!hasTriggeredInitiateCheckout) {
      setHasTriggeredInitiateCheckout(true);
      trackInitiateCheckoutEvent({
        name: currentOffer.title,
        price: currentOffer.price,
        quantity: currentOffer.quantity
      }, settings.pixel);
    }
  };
  const paymentSettings = settings.payment || {
    enableCod: true,
    codLabel: 'الدفع عند الاستلام (COD)',
    enableBankTransfer: false,
    bankTransferLabel: 'تحويل بنكي مباشر (RIB)',
    bankDetails: '',
    shippingCost: 0,
    freeShippingLabel: 'توصيل مجاني لجميع المدن المغربية',
    checkoutButtonText: 'تأكيد الطلب الآن (الدفع عند الاستلام)',
    orderSuccessTitle: 'تم تسجيل طلبك بنجاح!',
    orderSuccessMessage: 'سيتصل بك فريقنا خلال ساعات لتأكيد موعد التسليم.'
  };

  const basePrice = currentOffer.price;
  const discount = appliedCoupon?.valid ? appliedCoupon.discountAmount : 0;
  const shipping = paymentSettings.shippingCost || 0;
  const finalPrice = Math.max(0, basePrice - discount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode, basePrice);
    setAppliedCoupon(res);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Debounce / Double-click lock
    if (isSubmitting || submitCooldown > 0) {
      return;
    }

    // 2. Validate Full Name
    const cleanName = fullName.trim();
    if (!cleanName || cleanName.length < 3) {
      setErrorMsg('يرجى إدخال اسمك الكامل بشكل صحيح (3 أحرف على الأقل)');
      return;
    }
    if (/^\d+$/.test(cleanName)) {
      setErrorMsg('الاسم يجب أن يتكون من حروف وليس أرقاماً عشوائية');
      return;
    }

    // 3. Strict Moroccan Phone Validation (06, 07, 05)
    const phoneCheck = validateMoroccanPhone(phone);
    if (!phoneCheck.isValid) {
      setErrorMsg(phoneCheck.error || 'يرجى إدخال رقم هاتف مغربي صحيح يبدأ بـ 06 أو 07 أو 05 (10 أرقام)');
      return;
    }

    // 4. Anti-Duplicate Order Protection (Block duplicates for 3 minutes per phone)
    const dupCheck = checkDuplicatePhoneOrder(phoneCheck.formatted, 3);
    if (dupCheck.isDuplicate) {
      setErrorMsg(
        `🛡️ تنبيه: تم تسجيل طلب مسبقاً بنفس رقم الهاتف (${phoneCheck.formatted}) قبل لحظات! طلبك ${dupCheck.orderNumber ? `رقم (${dupCheck.orderNumber})` : ''} قيد المعالجة وسيتصل بك فريقنا لتأكيده. لا داعي لتكرار الطلب.`
      );
      return;
    }

    // 5. Address Validation
    const cleanAddress = address.trim();
    if (!cleanAddress || cleanAddress.length < 3) {
      setErrorMsg('يرجى كتابة العنوان أو الحي لضمان دقة وسرعة التوصيل');
      return;
    }

    // Lock submission button for 5 seconds against rapid clicks
    setIsSubmitting(true);
    setSubmitCooldown(5);

    try {
      const order = await addOrder({
        customerName: cleanName,
        phone: phoneCheck.formatted,
        city,
        address: cleanAddress,
        offerId: currentOffer.id,
        offerTitle: currentOffer.title,
        quantity: currentOffer.quantity,
        totalAmount: finalPrice,
        shippingCost: shipping,
        notes: notes.trim() || undefined,
        couponCode: appliedCoupon?.valid ? couponCode.toUpperCase() : undefined,
        discountAmount: discount > 0 ? discount : undefined,
        paymentMethod
      });

      // Record phone submit history to prevent double orders
      recordSubmittedPhone(phoneCheck.formatted, order.orderNumber);

      setCreatedOrder(order);
      if (onOrderSuccess) {
        onOrderSuccess(order);
      }

      // Smoothly scroll to the success card
      setTimeout(() => {
        const formElement = document.getElementById('order-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);

      // Real Dispatching: Track Purchase Event to Facebook & TikTok Pixel
      trackPurchaseEvent({
        orderNumber: order.orderNumber,
        offerTitle: order.offerTitle,
        totalAmount: order.totalAmount,
        quantity: order.quantity,
        customerName: order.customerName,
        phone: order.phone,
        city: order.city
      }, settings.pixel);
    } catch (err) {
      setErrorMsg('حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مرة أخرى أو الطلب عبر الواتساب.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    trackContactEvent('whatsapp', 'استمارة الطلب (زر الواتساب البديل)', settings.pixel);
    const text = `السلام عليكم ورحمة الله، أود طلب دهن سنام الجمل Sanambio:
- الباقة: ${currentOffer.title}
- طريقة الدفع: ${paymentMethod === 'COD' ? 'الدفع عند الاستلام' : 'تحويل بنكي'}
- السعر الإجمالي: ${finalPrice} درهم (${shipping === 0 ? 'توصيل مجاني' : `شحن: ${shipping} درهم`})
- الاسم: ${fullName || 'زبون'}
- المدينة: ${city}
- العنوان: ${address || 'سأزودكم به'}`;
    const url = formatWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  return (
    <section id="order-form" className="-mt-[33px] py-12 px-3.5 sm:px-6 lg:px-8 bg-[#F8F6F0] relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-amber-300 overflow-hidden">
          
          {/* Form Header Banner */}
          <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white p-5 text-center">
            <span className="inline-block bg-amber-900/60 text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1.5 border border-amber-400/30">
              ⚡ استمارة الطلب السريع
            </span>
            <h2 className="text-xl sm:text-2xl font-black mb-1">
              املأ معلوماتك لتأكيد طلبك الآن
            </h2>
            <p className="text-[11px] text-amber-100 font-medium">
              {shipping === 0 ? paymentSettings.freeShippingLabel : `مصاريف التوصيل: ${shipping} ${settings.currency}`}
            </p>
          </div>

          {/* If Order Submitted Successfully */}
          {createdOrder ? (
            <div className="p-6 text-center bg-emerald-50/60">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                {paymentSettings.orderSuccessTitle}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2 mb-1">
                شكراً لثقتك بنا يا {createdOrder.customerName}
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                رقم طلبك: <strong className="text-amber-800 font-mono text-sm">{createdOrder.orderNumber}</strong>. {paymentSettings.orderSuccessMessage}
              </p>

              {/* Bank Transfer Instructions if selected */}
              {createdOrder.paymentMethod === 'BANK_TRANSFER' && paymentSettings.bankDetails && (
                <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-right mb-4 text-xs">
                  <span className="font-bold text-blue-900 block mb-1">معلومات الحساب البنكي للتحويل (RIB):</span>
                  <div className="font-mono bg-white p-2 rounded border border-blue-100 text-slate-800 text-xs font-bold select-all">
                    {paymentSettings.bankDetails}
                  </div>
                  <span className="text-[10px] text-blue-700 block mt-1">يرجى إرسال وصل التحويل عبر الواتساب لتأكيد شحن طلبيتك فوراً.</span>
                </div>
              )}

              {/* Order Quick Summary Card */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs text-right mb-5 text-xs space-y-1.5">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500">الباقة المطلوبة:</span>
                  <span className="font-bold text-slate-900">{createdOrder.offerTitle}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500">طريقة الأداء:</span>
                  <span className="font-bold text-slate-900">{createdOrder.paymentMethod === 'COD' ? 'الدفع عند الاستلام' : 'تحويل بنكي'}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500">المبلغ الإجمالي المطلوب:</span>
                  <span className="font-black text-emerald-700 text-sm">{createdOrder.totalAmount} {settings.currency}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500">المدينة والعنوان:</span>
                  <span className="font-bold text-slate-900">{createdOrder.city} - {createdOrder.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">رقم الهاتف:</span>
                  <span className="font-mono font-bold text-slate-900" dir="ltr">{createdOrder.phone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <a
                  href={formatWhatsAppUrl(
                    settings.whatsappNumber,
                    `السلام عليكم، قمت بتأكيد الطلب رقم ${createdOrder.orderNumber} بمبلغ ${createdOrder.totalAmount} درهم.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md text-xs cursor-pointer transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تأكيد الطلب عبر الواتساب فوراً</span>
                </a>

                {onOpenTracking && (
                  <button
                    type="button"
                    onClick={() => onOpenTracking(createdOrder.orderNumber)}
                    className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs text-xs cursor-pointer transition-colors"
                  >
                    <Truck className="w-4 h-4" />
                    <span>تتبع مسار طلبيتك ({createdOrder.orderNumber})</span>
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setCreatedOrder(null);
                    setFullName('');
                    setPhone('');
                    setAddress('');
                    setNotes('');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs cursor-pointer transition-colors"
                >
                  تقديم طلب جديد
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              
              {/* Error Alert */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-300 text-red-800 p-2.5 rounded-xl text-xs font-bold text-right flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Step 1: Select Offer Bundles */}
              <div>
                <label className="block text-xs font-black text-slate-900 mb-2 text-right">
                  1. اختر باقة العرض المناسبة لك:
                </label>
                <div className="space-y-2">
                  {offers.map((offer) => {
                    const isSelected = offer.id === selectedOfferId;
                    return (
                      <div
                        key={offer.id}
                        onClick={() => setSelectedOfferId(offer.id)}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-right ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-400/30 border-r-[6px] border-r-amber-700'
                            : 'border-amber-300/80 bg-white hover:border-amber-500 border-r-[5px] border-r-amber-500 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-amber-600 bg-amber-600' : 'border-amber-400 bg-white'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-black text-xs sm:text-sm text-slate-900">{offer.title}</span>
                              {offer.tag && (
                                <span className="text-[9px] bg-amber-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                                  {offer.tag}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 block">{offer.subtitle}</span>
                          </div>
                        </div>

                        <div className="text-left" dir="ltr">
                          <span className="font-black text-sm sm:text-base text-amber-900 block">{offer.price} {settings.currency}</span>
                          <span className="text-[10px] text-slate-400 line-through">{offer.originalPrice} {settings.currency}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Payment Method Selector (if multiple enabled in admin) */}
              {(paymentSettings.enableCod && paymentSettings.enableBankTransfer) && (
                <div className="pt-2 border-t border-slate-200 text-right">
                  <label className="block text-xs font-black text-slate-900 mb-2">
                    2. طريقة الدفع المفضلة:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentSettings.enableCod && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-2.5 rounded-xl border-2 text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'COD' 
                            ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs border-r-[5px] border-r-amber-700' 
                            : 'border-amber-300/80 bg-white text-slate-700 hover:border-amber-400 border-r-4 border-r-amber-500 shadow-xs'
                        }`}
                      >
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span>الدفع عند الاستلام</span>
                      </button>
                    )}

                    {paymentSettings.enableBankTransfer && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('BANK_TRANSFER')}
                        className={`p-2.5 rounded-xl border-2 text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'BANK_TRANSFER' 
                            ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs border-r-[5px] border-r-amber-700' 
                            : 'border-amber-300/80 bg-white text-slate-700 hover:border-amber-400 border-r-4 border-r-amber-500 shadow-xs'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>تحويل بنكي (RIB)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Customer Contact & Delivery Info */}
              <div className="space-y-3 pt-2 border-t border-slate-200 text-right">
                <label className="block text-xs font-black text-slate-900">
                  معلومات التوصيل والتسليم:
                </label>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-700" />
                    <span>الاسم الكامل *</span>
                  </label>
                  <div className="rotating-border-card">
                    <div className="rotating-border-inner">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onFocus={handleInputFocus}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="مثال: عبد الله الفاسي"
                        className="w-full px-4 py-3 rounded-[14px] text-xs sm:text-sm font-semibold text-slate-900 bg-white focus:outline-none border-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-700" />
                    <span>رقم الهاتف (للاتصال والتأكيد) *</span>
                  </label>
                  <div className="rotating-border-card">
                    <div className="rotating-border-inner">
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={phone}
                        onFocus={handleInputFocus}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="06 XX XX XX XX / 07 XX XX XX XX"
                        className="w-full px-4 py-3 rounded-[14px] text-xs sm:text-sm font-semibold text-slate-900 bg-white text-right focus:outline-none border-0"
                      />
                    </div>
                  </div>
                </div>

                {/* City & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>المدينة *</span>
                    </label>
                    <div className="rotating-border-card">
                      <div className="rotating-border-inner">
                        <select
                          value={city}
                          onFocus={handleInputFocus}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-3 rounded-[14px] text-xs sm:text-sm font-semibold text-slate-900 bg-white focus:outline-none border-0 cursor-pointer"
                        >
                          {MOROCCAN_CITIES.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>العنوان أو الحي *</span>
                    </label>
                    <div className="rotating-border-card">
                      <div className="rotating-border-inner">
                        <input
                          type="text"
                          required
                          value={address}
                          onFocus={handleInputFocus}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="مثال: حي السلام زنقة 14"
                          className="w-full px-4 py-3 rounded-[14px] text-xs sm:text-sm font-semibold text-slate-900 bg-white focus:outline-none border-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>ملاحظات إضافية للموزع (اختياري)</span>
                  </label>
                  <div className="rotating-border-card">
                    <div className="rotating-border-inner">
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="مثال: يرجى الاتصال بعد العصر أو ترك الطرد عند الحارس"
                        className="w-full px-3.5 py-2.5 rounded-[14px] text-xs text-slate-800 bg-white focus:outline-none border-0"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Order Summary Box */}
              <div className="bg-amber-50/90 p-4 rounded-2xl border-2 border-amber-300 border-r-[5px] border-r-amber-600 text-right space-y-1.5 text-xs shadow-xs">
                <div className="flex justify-between text-slate-700">
                  <span>سعر الباقة ({currentOffer.title}):</span>
                  <span className="font-bold">{basePrice} {settings.currency}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>مصاريف الشحن:</span>
                  <span className="font-bold text-emerald-700">
                    {shipping === 0 ? 'مجاني (0 درهم)' : `${shipping} ${settings.currency}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-700 font-bold">
                    <span>خصم الكوبون:</span>
                    <span>-{discount} {settings.currency}</span>
                  </div>
                )}
                {currentOffer.freeGift && (
                  <div className="flex justify-between text-emerald-800 font-bold bg-emerald-100/60 p-1.5 rounded-lg text-[11px]">
                    <span>هدية متضمنة:</span>
                    <span>{currentOffer.freeGift}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-1.5 border-t border-amber-200">
                  <span>المبلغ المطلوب:</span>
                  <span className="text-amber-900">{finalPrice} {settings.currency}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting || submitCooldown > 0}
                  className={`w-full text-sm sm:text-base font-black py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isSubmitting || submitCooldown > 0
                      ? 'bg-slate-400 text-slate-100 cursor-not-allowed opacity-90'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 active:scale-98 text-white cursor-pointer'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'جاري التسجيل وحفظ البيانات...'
                      : submitCooldown > 0
                      ? `يرجى الانتظار (${submitCooldown}ث)... 🔒`
                      : paymentSettings.checkoutButtonText}
                  </span>
                </button>

                <p className="text-[10.5px] text-slate-500 text-center flex items-center justify-center gap-1 font-medium pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>حماية متقدمة ضد التكرار والطلبات الوهمية · بياناتك مشفرة ومحفوظة بأمان</span>
                </p>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>الطلب الفوري عبر محادثة الواتساب</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
