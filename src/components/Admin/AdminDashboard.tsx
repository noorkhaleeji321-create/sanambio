import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types/store';
import { InvoiceModal } from './InvoiceModal';
import { DeleteConfirmModal, DeleteConfirmState } from './modals/DeleteConfirmModal';
import { AddReviewModal } from './modals/AddReviewModal';
import { OverviewTab } from './tabs/OverviewTab';
import { OrdersTab } from './tabs/OrdersTab';
import { ProductsTab } from './tabs/ProductsTab';
import { MediaTab } from './tabs/MediaTab';
import { PaymentTab } from './tabs/PaymentTab';
import { ReviewsTab } from './tabs/ReviewsTab';
import { CouponsTab } from './tabs/CouponsTab';
import { AiDoctorTab } from './tabs/AiDoctorTab';
import { SettingsTab } from './tabs/SettingsTab';
import { PixelSettingsTab } from './tabs/PixelSettingsTab';
import { SeoTab } from './tabs/SeoTab';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Star,
  Tag,
  Settings,
  Image as ImageIcon,
  CreditCard,
  RefreshCw,
  Eye,
  Bot,
  Target,
  Search
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    settings,
    orders,
    addReview,
    setViewMode,
    isSupabaseConnected,
    isLoadingFromSupabase,
    syncWithSupabase
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'media' | 'payment' | 'pixel' | 'seo' | 'reviews' | 'coupons' | 'ai' | 'settings'>('overview');
  
  // Modals state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState | null>(null);

  const newOrdersCount = orders.filter(o => o.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 text-right font-cairo" dir="rtl">
      
      {/* Top Admin Navigation */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-amber-400/40 shadow-xs bg-amber-50 shrink-0">
              <img
                src={settings.media?.logoUrl || settings.logoUrl || settings.media?.heroProductImage || "https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/camel_joint_cream_jar.jpg"}
                alt="Sanambio"
                className="w-full h-full object-cover"
              />
              {(settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl) ? (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full overflow-hidden border border-slate-900 bg-white">
                  <img
                    src={settings.media?.networkStatusIconUrl || settings.networkStatusIconUrl}
                    alt="Network Icon"
                    className="w-full h-full object-cover"
                  />
                </span>
              ) : (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" title="متصل بالشبكة"></span>
              )}
            </div>
            <div>
              <span className="font-black text-sm sm:text-base block leading-tight">لوحة تحكم Sanambio®</span>
              <span className="text-[10px] text-amber-400 font-bold">إدارة المتجر، الميديا، الدفع والطلبات</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => syncWithSupabase()}
              className="flex items-center gap-1.5 bg-emerald-700/80 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-xs transition-all cursor-pointer border border-emerald-500/40"
              title="مزامنة البيانات مع Supabase مباشرة"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFromSupabase ? 'animate-spin text-emerald-300' : ''}`} />
              <span className="hidden sm:inline">مزامنة Supabase</span>
              <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            </button>

            <button
              onClick={() => setViewMode('landing')}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold py-2 px-3 sm:px-4 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة صفحة المتجر</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto text-xs font-bold border-t border-slate-800 py-1.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>المؤشرات</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'orders' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>الطلبيات ({orders.length})</span>
            {newOrdersCount > 0 && (
              <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                {newOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'media' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>الصور والفيديوهات 📸</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'payment' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>خانة الدفع والشحن 💳</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'products' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>الأسعار والباقات</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'reviews' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>التقييمات</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'coupons' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>الكوبونات</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'ai' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md' 
                : 'text-emerald-400 hover:bg-slate-800 font-bold'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>روبوت الذكاء الاصطناعي 🤖</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('pixel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pixel' 
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black shadow-md' 
                : 'text-indigo-300 hover:bg-slate-800 font-bold'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>إعلانات وبكسل 🎯</span>
            {(settings.pixel?.facebookPixelId || settings.pixel?.tiktokPixelId) && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'seo' 
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white font-black shadow-md' 
                : 'text-sky-300 hover:bg-slate-800 font-bold'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>سيو وجوجل 🔍</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'settings' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>إعدادات المتجر</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Supabase Realtime Database Status Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-emerald-100 p-3 sm:p-3.5 rounded-2xl mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border border-emerald-800/40 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs text-white">قاعدة بيانات Supabase مفعلة ومتصلة في الوقت الفعلي</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-400/30">
                  Live Sync ⚡
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                https://ecowrkizfpmcpsyzvvze.supabase.co · جدول الطلبات والإعدادات
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-[11px] text-slate-300 font-semibold">
              إجمالي الطلبيات المسجلة: <strong className="text-emerald-400">{orders.length}</strong>
            </span>
            <button
              onClick={() => syncWithSupabase()}
              disabled={isLoadingFromSupabase}
              className="text-xs bg-emerald-800/80 hover:bg-emerald-700 active:scale-95 text-white font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-emerald-600/30"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingFromSupabase ? 'animate-spin' : ''}`} />
              <span>{isLoadingFromSupabase ? 'جارٍ التحديث...' : 'تحديث'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tab Rendering */}
        {activeTab === 'overview' && (
          <OverviewTab onNavigateToOrders={() => setActiveTab('orders')} />
        )}

        {activeTab === 'orders' && (
          <OrdersTab
            onSelectInvoice={(order) => setSelectedInvoiceOrder(order)}
            onRequestDelete={(state) => setDeleteConfirm(state)}
          />
        )}

        {activeTab === 'media' && (
          <MediaTab onRequestDelete={(state) => setDeleteConfirm(state)} />
        )}

        {activeTab === 'payment' && (
          <PaymentTab />
        )}

        {activeTab === 'products' && (
          <ProductsTab />
        )}

        {activeTab === 'reviews' && (
          <ReviewsTab
            onOpenAddReview={() => setShowAddReviewModal(true)}
            onRequestDelete={(state) => setDeleteConfirm(state)}
          />
        )}

        {activeTab === 'coupons' && (
          <CouponsTab onRequestDelete={(state) => setDeleteConfirm(state)} />
        )}

        {activeTab === 'ai' && (
          <AiDoctorTab />
        )}

        {activeTab === 'pixel' && (
          <PixelSettingsTab />
        )}

        {activeTab === 'seo' && (
          <SeoTab />
        )}

        {activeTab === 'settings' && (
          <SettingsTab />
        )}

      </main>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          settings={settings}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={showAddReviewModal}
        onClose={() => setShowAddReviewModal(false)}
        onAddReview={(newRev) => addReview(newRev)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        confirmState={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
      />

    </div>
  );
};
