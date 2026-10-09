import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { Order, OrderStatus } from '../../../types/store';
import { Clock, Check, Truck, CheckCircle2, XCircle } from 'lucide-react';

interface OverviewTabProps {
  onNavigateToOrders: () => void;
}

export const getOrderStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'new':
      return (
        <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
          <Clock className="w-3 h-3" /> جديد
        </span>
      );
    case 'confirmed':
      return (
        <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
          <Check className="w-3 h-3" /> مؤكد
        </span>
      );
    case 'shipping':
      return (
        <span className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
          <Truck className="w-3 h-3" /> قيد الشحن
        </span>
      );
    case 'delivered':
      return (
        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
          <CheckCircle2 className="w-3 h-3" /> تم التوصيل
        </span>
      );
    case 'cancelled':
      return (
        <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
          <XCircle className="w-3 h-3" /> ملغي
        </span>
      );
    default:
      return null;
  }
};

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateToOrders }) => {
  const { settings, orders } = useStore();

  const totalRevenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0);
  const deliveredRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter(o => o.status === 'new').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">إجمالي المبيعات</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {totalRevenue} <span className="text-xs font-bold text-amber-800">{settings.currency}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">✓ {deliveredRevenue} درهم محصلة</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">إجمالي الطلبيات</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {totalOrdersCount} <span className="text-xs font-bold text-slate-400">طلب</span>
          </div>
          <span className="text-[10px] text-amber-700 font-bold block mt-0.5">{newOrdersCount} طلبات جديدة</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">المخزون المتوفر</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {settings.remainingStock} <span className="text-xs font-bold text-slate-400">علبة</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">✓ متوفر للشحن</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">معدل التوصيل</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {totalOrdersCount > 0 ? Math.round((deliveredOrdersCount / totalOrdersCount) * 100) : 100}%
          </div>
          <span className="text-[10px] text-teal-700 font-bold block mt-0.5">✓ أداء عالي</span>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-slate-900">آخر الطلبيات</h3>
          <button
            onClick={onNavigateToOrders}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
          >
            عرض الكل ←
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {orders.slice(0, 5).map(o => (
            <div key={o.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{o.customerName} ({o.city.split(' ')[0]})</span>
                <span className="text-[10px] text-slate-400">{o.orderNumber} · {o.offerTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900">{o.totalAmount} DH</span>
                {getOrderStatusBadge(o.status)}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="py-4 text-center text-slate-400 text-xs font-medium">
              لا توجد طلبيات بعد
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
