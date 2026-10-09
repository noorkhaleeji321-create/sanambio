import React, { useState } from 'react';
import { Award, ShieldCheck, Truck, Phone, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AdminLoginModal } from './Admin/AdminLoginModal';
import { formatWhatsAppUrl, formatPhoneCallUrl } from '../lib/contactUtils';

interface FooterProps {
  onOpenTracking?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTracking }) => {
  const { settings } = useStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800 pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-right">
          
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-amber-400/40 shadow-xs bg-amber-50 shrink-0">
                <img
                  src={settings.media?.logoUrl || settings.logoUrl || "https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/branding/1791456167148_653709227_122105396001285073_676431221204038800_n.jpg"}
                  alt="Sanambio"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="text-lg font-black text-white">Sanambio<span className="text-amber-500">®</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              المنتج المغربي الطبيعي الأصلي المستخلص من سنام الجمل لراحة تدوم وحرية في الحركة.
            </p>
          </div>


          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#benefits" className="hover:text-amber-400 transition-colors">مكونات المنتج وفوائده</a></li>
              <li><a href="#pain-points" className="hover:text-amber-400 transition-colors">علاج آلام المفاصل والظهر</a></li>
              <li><a href="#how-to-use" className="hover:text-amber-400 transition-colors">طريقة الاستعمال</a></li>
              <li><a href="#offers" className="hover:text-amber-400 transition-colors">باقات العروض والأسعار</a></li>
              {onOpenTracking && (
                <li>
                  <button 
                    onClick={onOpenTracking}
                    className="hover:text-amber-400 text-amber-300 font-bold transition-colors cursor-pointer text-right flex items-center gap-1"
                  >
                    <span>🚚 تتبع حالة طلبيتك</span>
                  </button>
                </li>
              )}
              <li><a href="#faq" className="hover:text-amber-400 transition-colors">الأسئلة الشائعة</a></li>
            </ul>
          </div>

          {/* Guarantee & Shipping */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">ضمان وجودة</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>طبيعي 100% بدون إضافات كيماوية</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>توصيل مجاني 24-48 ساعة بالمغرب</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>ضمان المعاينة قبل الدفع</span>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">خدمة الزبناء والتواصل</h4>
            <p className="text-xs text-slate-400 mb-3">
              فريقنا جاهز لمساعدتك واستقبال طلبياتك طيلة أيام الأسبوع
            </p>
            <div className="space-y-2">
              <a
                href={formatWhatsAppUrl(settings.whatsappNumber, 'السلام عليكم، بغيت نستفسر على مرهم سنام الجمل SanamBio')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>خدمة الواتساب المباشرة: {settings.whatsappNumber}</span>
              </a>

              {settings.phone && (
                <a
                  href={formatPhoneCallUrl(settings.phone)}
                  className="block text-slate-400 hover:text-amber-400 text-xs font-mono transition-colors"
                >
                  📞 هاتف الطلب: {settings.phone}
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            جميع الحقوق محفوظة{' '}
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-block px-1 text-slate-400 hover:text-amber-400 cursor-pointer font-bold transition-colors select-none"
              title="لوحة الإدارة"
            >
              ©
            </button>{' '}
            {new Date().getFullYear()} Sanambio® Maroc.
          </span>
          <span>صُنِعَ بعناية لخدمة صحة وراحة الأسرة المغربية.</span>
        </div>

      </div>

      {/* Admin PIN Login Security Modal */}
      {showLoginModal && (
        <AdminLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </footer>
  );
};
