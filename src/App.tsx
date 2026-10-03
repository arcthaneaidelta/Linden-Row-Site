import React, { useState, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './app/routes';
import { Navbar } from './components/layout/Navbar';
import { CartDrawer } from './components/commerce/CartDrawer';
import { HoodDrawer } from './components/hood/HoodDrawer';
import { StockResolutionModal } from './components/commerce/StockResolutionModal';
import { ThreeDSChallengeModal } from './components/commerce/ThreeDSChallengeModal';
import { WalletSheet } from './components/commerce/WalletSheet';
import { OrderRecordModal } from './components/commerce/OrderRecordModal';
import { LoadingSequence } from './components/marketing/LoadingSequence';
import { ToastProvider } from './components/ui/Toast';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <LoadingSequence onComplete={() => setLoadingComplete(true)} />

        <div className="flex flex-col min-h-screen bg-bg text-ink font-sans">
          {/* Top Navbar */}
          <Navbar />

          {/* Main Routing View */}
          <div className="flex-1">
            <AppRoutes />
          </div>

          {/* Persistent Overlays */}
          <CartDrawer />
          <HoodDrawer />

          {/* Modal Layers */}
          <StockResolutionModal />
          <ThreeDSChallengeModal />
          <WalletSheet />
          <OrderRecordModal />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
