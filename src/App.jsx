import React from 'react';
import { StockProvider, useStock } from './context/StockContext';
import { Navbar } from './components/Navbar';
import { SystemBroadcastBanner } from './components/SystemBroadcastBanner';
import { MarketHealthMeter } from './components/MarketHealthMeter';
import { TopStocksCarousel } from './components/TopStocksCarousel';
import { AiRecommendationBanner } from './components/AiRecommendationBanner';
import { StockChartSection } from './components/StockChartSection';
import { QuickBuySellSimulator } from './components/QuickBuySellSimulator';
import { PortfolioWatchlist } from './components/PortfolioWatchlist';
import { AiFriendChatbot } from './components/AiFriendChatbot';
import { BuyModal } from './components/BuyModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ShieldCheck, Heart, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

const DashboardContent = () => {
  const { currentTab, mode, getFontSizeClass, toggleChatbot } = useStock();

  if (currentTab === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between ${getFontSizeClass()}`}>
      
      {/* Top Navbar */}
      <Navbar />

      {/* Global Alert / System Broadcast Banner */}
      <SystemBroadcastBanner />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 flex-1 w-full">
        
        {/* 1. Market Health Speedometer Gauge */}
        <section aria-label="Market Health Overview">
          <MarketHealthMeter />
        </section>

        {/* 2. Top Stocks Horizontal Scroll Cards */}
        <section aria-label="Trending Stocks Carousel">
          <TopStocksCarousel />
        </section>

        {/* 3. Highlighted AI Recommendation Banner */}
        <section aria-label="Featured AI Stock Recommendation">
          <AiRecommendationBanner />
        </section>

        {/* 4. Main Stock Interactive Chart (Simple Line ⇄ Pro Candlesticks) */}
        <section aria-label="Stock Chart and Technical Details">
          <StockChartSection />
        </section>

        {/* 5. Quick Buy/Sell Simulator with Returns Calculator */}
        <section aria-label="Quick Investment Simulator">
          <QuickBuySellSimulator />
        </section>

        {/* 6. User Portfolio, Watchlist & News Signals */}
        <section aria-label="Holdings and Watchlist">
          <PortfolioWatchlist />
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-brand-900 text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="font-extrabold text-slate-800 text-sm">StockSense AI</span>
            <span>•</span>
            <span>Ultra-Accessible Stock Tracker & Advisory</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
              🟢 WCAG AA Accessible
            </span>
            <button
              onClick={toggleChatbot}
              className="text-brand-900 font-bold hover:underline flex items-center"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1" />
              Need Help? Ask AI Friend
            </button>
          </div>

          <p className="text-center sm:text-right text-[11px] text-slate-400">
            Simulated portfolio environment. Not financial advice.
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp-Style AI Friend Chatbot */}
      <AiFriendChatbot />

      {/* Interactive Quick Buy Modal */}
      <BuyModal />

    </div>
  );
};

export default function App() {
  return (
    <StockProvider>
      <DashboardContent />
    </StockProvider>
  );
}
