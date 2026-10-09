import React, { useEffect, useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PainPointsInteractive } from './components/PainPointsInteractive';
import { DrYounesAdviceSection } from './components/DrYounesAdviceSection';
import { ProductBenefitsAndIngredients } from './components/ProductBenefitsAndIngredients';
import { HowToUseSection } from './components/HowToUseSection';
import { OffersSection } from './components/OffersSection';
import { CheckoutForm } from './components/CheckoutForm';
import { CustomerReviews } from './components/CustomerReviews';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { LiveSalesNotifier } from './components/LiveSalesNotifier';
import { StickyMobileBar } from './components/StickyMobileBar';
import { FloatingEmojisBackground } from './components/FloatingEmojisBackground';
import { AiDoctorChatBot } from './components/AiDoctorChatBot';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { SEOHead } from './components/SEOHead';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { syncPixelScripts, trackPageViewEvent, trackViewContentEvent } from './lib/pixelEvents';

const MainAppContent: React.FC = () => {
  const { viewMode, settings, offers } = useStore();
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingInitialQuery, setTrackingInitialQuery] = useState('');

  const handleOpenTracking = (orderQuery?: string) => {
    setTrackingInitialQuery(orderQuery || '');
    setIsTrackingModalOpen(true);
  };

  // Initialize and sync Meta & TikTok Pixels on mount and when settings change
  useEffect(() => {
    syncPixelScripts(settings.pixel);
    trackPageViewEvent(settings.pixel);
    
    // Dispatch ViewContent for default active offer
    const firstOffer = offers[0];
    if (firstOffer) {
      trackViewContentEvent({
        name: firstOffer.title || 'دهن سنام الجمل SanamBio',
        price: firstOffer.price || 299,
        id: firstOffer.id
      }, settings.pixel);
    }
  }, [settings.pixel]);

  if (viewMode === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] text-slate-800 selection:bg-amber-400 selection:text-amber-950 font-cairo antialiased flex flex-col relative" dir="rtl">
      {/* SEO & Meta Tags Manager */}
      <SEOHead />

      {/* Animated Floating Emojis, Hearts & Stars Background */}
      <FloatingEmojisBackground />

      {/* Responsive full-width natural container */}
      <div className="w-full mx-auto bg-[#FAF9F5] flex-1 flex flex-col shadow-xs pb-20 relative z-10">
        <Header onOpenTracking={() => handleOpenTracking()} />
        
        <main className="flex-1">
          <HeroSection />
          <PainPointsInteractive />
          <DrYounesAdviceSection />
          <ProductBenefitsAndIngredients />
          <HowToUseSection />
          <OffersSection />
          <CheckoutForm 
            onOpenTracking={(orderNum) => handleOpenTracking(orderNum)}
          />
          <CustomerReviews />
          <FAQSection />
        </main>

        <Footer onOpenTracking={() => handleOpenTracking()} />
      </div>

      {/* Viewport-fixed Live Sales Notifier (visible across all scroll positions) */}
      <LiveSalesNotifier />

      {/* AI Doctor & Persuasive Sales Assistant Chatbot */}
      <AiDoctorChatBot />

      {/* Clean single-row sticky buy bar */}
      <StickyMobileBar />

      {/* Order Tracking Modal (تتبع الطلبية المباشر) */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        initialQuery={trackingInitialQuery}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
