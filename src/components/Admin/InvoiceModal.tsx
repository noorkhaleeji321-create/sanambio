import React, { useRef } from 'react';
import { Order, StoreSettings } from '../../types/store';
import { Printer, X, CheckCircle, MapPin, Phone, User, Package, Calendar } from 'lucide-react';

interface InvoiceModalProps {
  order: Order;
  settings: StoreSettings;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, settings, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative text-right">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm py-2 px-4 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة بون التوصيل (Bon de Livraison)</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="bg-white p-6 border-2 border-slate-800 rounded-2xl">
          
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 mb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
                Sanambio<span className="text-amber-600">®</span> Maroc
              </h2>
              <span className="text-xs text-slate-600 font-bold block">
                مستحضرات التجميل والعناية الطبيعية بالأعشاب الصحراوية
              </span>
              <span className="text-xs text-slate-500 block">
                الهاتف / واتساب: {settings.phone}
              </span>
            </div>

            <div className="text-left" dir="ltr">
              <span className="inline-block bg-slate-900 text-white text-xs font-black px-3 py-1 rounded-md mb-1">
                BON DE LIVRAISON (COD)
              </span>
              <div className="text-xs font-mono font-bold text-slate-800">
                REF: {order.orderNumber}
              </div>
              <div className="text-[10px] text-slate-500">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Barcode & Tracking Simulated */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">كود التتبع / Code de Suivi:</span>
              <span className="text-sm font-mono font-black text-slate-800">{order.trackingCode || `MA-${order.orderNumber}`}</span>
            </div>
            <div className="font-mono text-xl tracking-widest text-slate-800 font-black border px-3 py-1 bg-white">
              ||| | |||| | ||| | |||
            </div>
          </div>

          {/* Customer & Delivery Coordinates */}
          <div className="grid grid-cols-2 gap-4 mb-5 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">معلومات المستلم (Destinataire):</span>
              <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
              <div className="font-mono font-bold text-amber-800 text-sm mt-0.5" dir="ltr">{order.phone}</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">عنوان التسليم (Adresse & Ville):</span>
              <div className="font-bold text-slate-900">{order.city}</div>
              <div className="text-slate-600 mt-0.5 leading-snug">{order.address}</div>
            </div>
          </div>

          {/* Ordered Items Table */}
          <table className="w-full text-xs text-right border-collapse mb-4">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                <th className="p-2.5 font-bold">المنتج / Désignation</th>
                <th className="p-2.5 font-bold text-center">الكمية / Qté</th>
                <th className="p-2.5 font-bold text-left" dir="ltr">السعر الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-2.5">
                  <span className="font-bold text-slate-900 block">دهن سنام الجمل Sanambio® الطبيعي</span>
                  <span className="text-[10px] text-slate-500">{order.offerTitle}</span>
                </td>
                <td className="p-2.5 text-center font-bold">{order.quantity}</td>
                <td className="p-2.5 text-left font-black" dir="ltr">{order.totalAmount} DH</td>
              </tr>
            </tbody>
          </table>

          {/* Order Total Highlight */}
          <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-300 flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-slate-700 block">طريقة الأداء:</span>
              <span className="text-xs font-black text-emerald-800">الدفع نقداً عند الاستلام (COD - Espèces)</span>
            </div>
            <div className="text-left" dir="ltr">
              <span className="text-[11px] text-slate-500 font-bold block">TOTAL À PAYER:</span>
              <span className="text-2xl font-black text-amber-900">{order.totalAmount} DH</span>
            </div>
          </div>

          {/* Instructions for Courier */}
          {order.notes && (
            <div className="bg-slate-100 p-2.5 rounded-lg text-[11px] text-slate-700 mb-4">
              <strong>ملاحظات الموزع:</strong> {order.notes}
            </div>
          )}

          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500">
            <span>توقيع وتأكيد المستلم: ___________________</span>
            <span>طرد قابل للمعاينة قبل الأداء</span>
          </div>

        </div>

      </div>
    </div>
  );
};
