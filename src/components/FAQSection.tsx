import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, ShieldCheck } from 'lucide-react';
import { FAQS } from '../data/initialData';
import { useStore } from '../context/StoreContext';
import { formatWhatsAppUrl } from '../lib/contactUtils';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { settings } = useStore();

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="-mt-[56px] py-16 bg-[#FBF9F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            الأسئلة الأكثر شيوعاً
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-3">
            كل ما تود معرفته قبل تأكيد طلبك
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            إجابات واضحة ومباشرة عن أهم تساؤلات زبنائنا حول دهن سنام الجمل وطريقة الشحن والضمان
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 mb-10">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-amber-300/85 border-r-4 border-r-amber-500 shadow-xs overflow-hidden transition-all text-right hover:border-amber-400"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-amber-800 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-amber-600' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 whitespace-pre-line font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reassurance contact card */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right shadow-xl">
          <div>
            <h3 className="text-lg sm:text-xl font-black mb-1">
              هل لديك سؤال آخر أو تحتاج لمساعدة في الطلب؟
            </h3>
            <p className="text-xs sm:text-sm text-amber-100">
              فريق خدمة العملاء لدينا رهن إشارتكم على مدار الساعة للإجابة عن كل استفساراتكم.
            </p>
          </div>

          <a
            href={formatWhatsAppUrl(settings.whatsappNumber, 'السلام عليكم، لدي استفسار بخصوص مرهم سنام بيو')}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-amber-50 text-slate-900 font-extrabold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>تواصل معنا عبر واتساب</span>
          </a>
        </div>

      </div>
    </section>
  );
};
