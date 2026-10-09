import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Order, OrderStatus } from '../../../types/store';
import { getOrderStatusBadge } from './OverviewTab';
import { formatWhatsAppUrl } from '../../../lib/contactUtils';
import { DeleteConfirmState } from '../modals/DeleteConfirmModal';
import { Search, Download, MessageCircle, Printer, Trash2 } from 'lucide-react';

interface OrdersTabProps {
  onSelectInvoice: (order: Order) => void;
  onRequestDelete: (deleteState: DeleteConfirmState) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ onSelectInvoice, onRequestDelete }) => {
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const newOrdersCount = orders.filter(o => o.status === 'new').length;

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch) ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.city.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportOrdersCSV = () => {
    const headers = ['رقم الطلب', 'الاسم الكامل', 'رقم الهاتف', 'المدينة', 'العنوان', 'الباقة', 'المبلغ (درهم)', 'طريقة الدفع', 'الحالة', 'تاريخ الطلب'];
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.city}"`,
      `"${o.address}"`,
      `"${o.offerTitle}"`,
      o.totalAmount,
      o.paymentMethod === 'COD' ? 'الدفع عند الاستلام' : 'تحويل بنكي',
      o.status,
      new Date(o.createdAt).toLocaleDateString('fr-FR')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sanambio_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="بحث باسم الزبون، الهاتف، المدينة..."
            className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute top-2.5 right-2.5" />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer ${statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            الكل ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('new')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer ${statusFilter === 'new' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            جديد ({newOrdersCount})
          </button>
          <button
            onClick={() => setStatusFilter('shipping')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer ${statusFilter === 'shipping' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            قيد الشحن
          </button>
          <button
            onClick={() => setStatusFilter('delivered')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer ${statusFilter === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            تم التوصيل
          </button>
        </div>

        <button
          onClick={exportOrdersCSV}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>تصدير Excel</span>
        </button>
      </div>

      {/* Orders Cards for Mobile & Table for Desktop */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-8 text-center text-slate-500 font-bold rounded-2xl border border-slate-200 space-y-1">
            <p className="text-sm font-black text-slate-800">لا توجد أي طلبيات مسجلة حالياً في قاعدة بيانات Supabase</p>
            <p className="text-xs text-slate-400">أي طلب جديد يقوم به الزبون من صفحة الهبوط سيصلك ويسجل هنا مباشرة وفي الوقت الفعلي ⚡</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-2.5">
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-amber-900 text-sm">{order.orderNumber}</span>
                  {getOrderStatusBadge(order.status)}
                </div>
                <span className="font-black text-sm text-slate-900">{order.totalAmount} DH</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">الزبون:</span>
                  <span className="font-bold text-slate-900 text-xs">{order.customerName}</span>
                  <a href={`tel:${order.phone}`} className="text-amber-700 font-mono font-bold block" dir="ltr">{order.phone}</a>
                </div>
                <div>
                  <span className="text-slate-400 block">المدينة والعنوان:</span>
                  <span className="font-bold text-slate-800 block">{order.city}</span>
                  <span className="text-slate-500 line-clamp-1">{order.address}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2 rounded-xl flex items-center justify-between text-[11px]">
                <div>
                  <span className="font-bold text-slate-800">{order.offerTitle}</span>
                  {order.notes && <span className="text-amber-800 block">📝 {order.notes}</span>}
                </div>
                <span className="font-bold text-slate-500">{order.paymentMethod === 'COD' ? 'دفع عند الاستلام' : 'تحويل بنكي'}</span>
              </div>

              {/* Actions & Status Dropdown */}
              <div className="flex items-center justify-between pt-1 gap-2">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                  className="text-xs font-bold py-1.5 px-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="new">جديد (في الانتظار)</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="shipping">قيد الشحن</option>
                  <option value="delivered">تم التوصيل</option>
                  <option value="cancelled">ملغي</option>
                </select>

                <div className="flex items-center gap-1.5">
                  <a
                    href={formatWhatsAppUrl(
                      order.phone,
                      `السلام عليكم يا ${order.customerName}، معكم متجر Sanambio بخصوص طلبيتك رقم ${order.orderNumber} لدهن سنام الجمل. نود تأكيد موعد التوصيل لعنوانكم في ${order.city}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                    title="مراسلة الزبون عبر الواتساب"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => onSelectInvoice(order)}
                    className="p-2 rounded-xl bg-amber-100 text-amber-800 cursor-pointer hover:bg-amber-200"
                    title="طباعة بون التوصيل"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onRequestDelete({
                        isOpen: true,
                        title: 'تأكيد حذف الطلبية من Supabase',
                        description: 'هل أنت متأكد فعلاً من رغبتك في مسح هذا الطلب نهائياً من قاعدة بيانات Supabase؟',
                        itemLabel: `الطلب رقم ${order.orderNumber} - ${order.customerName}`,
                        onConfirm: async () => {
                          await deleteOrder(order.id);
                        }
                      });
                    }}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                    title="حذف الطلب نهائياً من Supabase"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
