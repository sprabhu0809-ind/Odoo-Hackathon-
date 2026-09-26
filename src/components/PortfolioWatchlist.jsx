import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import { MOCK_NEWS } from '../data/mockData';
import {
  Briefcase,
  Star,
  Newspaper,
  TrendingUp,
  TrendingDown,
  Volume2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export const PortfolioWatchlist = () => {
  const {
    portfolio,
    stocks,
    setSelectedStockId,
    openBuyModal,
    executeSell,
    favorites,
    toggleFavorite,
    formatMoney,
    formatStockPrice,
    speakText,
    isSpeaking,
    speakingId
  } = useStock();

  const [activeTab, setActiveTab] = useState('holdings'); // 'holdings' | 'favorites' | 'news'
  const [sellModalState, setSellModalState] = useState({ isOpen: false, holding: null, sharesToSell: 1 });

  // Calculate total portfolio value
  const totalHoldingsValueUSD = portfolio.holdings.reduce((sum, h) => {
    const stock = stocks.find(s => s.id === h.stockId);
    const currentPrice = stock ? stock.priceUSD : h.avgPriceUSD;
    return sum + (h.shares * currentPrice);
  }, 0);

  const totalPortfolioValueUSD = portfolio.cashUSD + totalHoldingsValueUSD;

  // Starred stocks list
  const favoriteStocks = stocks.filter(s => favorites.includes(s.id));

  // Handle Sell Action
  const handleOpenSellModal = (holding) => {
    setSellModalState({
      isOpen: true,
      holding,
      sharesToSell: holding.shares >= 1 ? 1 : holding.shares
    });
  };

  const handleConfirmSell = () => {
    if (!sellModalState.holding) return;
    executeSell(sellModalState.holding.stockId, Number(sellModalState.sharesToSell));
    setSellModalState({ isOpen: false, holding: null, sharesToSell: 1 });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
      
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`touch-target px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'holdings'
                ? 'bg-white text-brand-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-brand-900" />
            <span>My Holdings ({portfolio.holdings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`touch-target px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'favorites'
                ? 'bg-white text-brand-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Watchlist ({favoriteStocks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`touch-target px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'news'
                ? 'bg-white text-brand-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Newspaper className="w-4 h-4 text-blue-600" />
            <span>AI News & Signals</span>
          </button>
        </div>

        {/* Portfolio Summary Pill */}
        <div className="flex items-center space-x-3 text-xs font-bold bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200/80">
          <div>
            <span className="text-slate-400">Total Net Worth:</span>
            <span className="ml-1.5 text-brand-navy font-extrabold text-sm">{formatMoney(totalPortfolioValueUSD)}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <span className="text-slate-400">Cash:</span>
            <span className="ml-1.5 text-emerald-700 font-extrabold">{formatMoney(portfolio.cashUSD)}</span>
          </div>
        </div>

      </div>

      {/* Tab Content */}
      <div className="mt-6">
        
        {/* HOLDINGS TAB */}
        {activeTab === 'holdings' && (
          <div className="space-y-4">
            {portfolio.holdings.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-slate-700">No active stock holdings yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Pick any stock from above and tap "Simulate Buy" to practice with your $10,000 virtual balance!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {portfolio.holdings.map((h) => {
                  const stock = stocks.find(s => s.id === h.stockId) || { priceUSD: h.avgPriceUSD, emoji: '📈' };
                  const currentValueUSD = +(h.shares * stock.priceUSD).toFixed(2);
                  const pnlUSD = +(currentValueUSD - h.totalCostUSD).toFixed(2);
                  const pnlPercent = +((pnlUSD / h.totalCostUSD) * 100).toFixed(2);
                  const isProfit = pnlUSD >= 0;

                  return (
                    <div key={h.stockId} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center space-x-3.5">
                        <span className="text-3xl p-2 bg-slate-50 rounded-2xl border border-slate-100">
                          {stock.emoji}
                        </span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-base text-slate-900">{h.symbol}</span>
                            <span className="text-xs font-medium text-slate-500">{h.name}</span>
                          </div>
                          <div className="text-xs text-slate-400 font-medium mt-0.5">
                            Owned: <strong className="text-slate-700 font-bold">{h.shares} shares</strong> • Avg: ${h.avgPriceUSD}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                        <div className="text-left sm:text-right">
                          <div className="font-extrabold text-base text-slate-900">
                            {formatMoney(currentValueUSD)}
                          </div>
                          <div className={`text-xs font-bold flex items-center ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isProfit ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                            {isProfit ? '+' : ''}{pnlPercent}% ({formatMoney(pnlUSD)})
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openBuyModal(stock)}
                            className="touch-target px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-brand-900 font-bold text-xs rounded-xl transition-colors"
                            title="Buy more shares"
                          >
                            Buy More
                          </button>
                          <button
                            onClick={() => handleOpenSellModal(h)}
                            className="touch-target px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors"
                            title="Sell shares"
                          >
                            Sell
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* WATCHLIST TAB */}
        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteStocks.length === 0 ? (
              <div className="col-span-full text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Tap the ⭐ icon on any stock card to pin it to your watchlist.</p>
              </div>
            ) : (
              favoriteStocks.map((stock) => (
                <div
                  key={stock.id}
                  onClick={() => setSelectedStockId(stock.id)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-brand-900/40 bg-white hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-2xl">{stock.emoji}</span>
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">{stock.symbol}</div>
                        <div className="text-xs text-slate-400">{stock.name}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(stock.id);
                      }}
                      className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{formatStockPrice(stock)}</div>
                      <div className={`text-xs font-semibold ${stock.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {stock.isPositive ? '+' : ''}{stock.changePercent}%
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openBuyModal(stock);
                      }}
                      className="touch-target px-3.5 py-1.5 bg-brand-900 text-white text-xs font-bold rounded-xl shadow-sm"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_NEWS.map((item) => {
              const isNewsSpeaking = speakingId === `news-${item.id}` && isSpeaking;
              return (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-extrabold text-[10px]">
                        {item.tag}
                      </span>
                      <span className="font-extrabold text-xs">{item.sentiment}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.source} • {item.time}</span>
                    <button
                      onClick={() => speakText(`${item.title}. ${item.summary}`, `news-${item.id}`)}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                        isNewsSpeaking ? 'bg-amber-400 text-brand-navy' : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isNewsSpeaking ? 'Reading...' : '🔊 Read'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Sell Modal Popup */}
      {sellModalState.isOpen && sellModalState.holding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-modal border border-slate-200">
            <h3 className="font-extrabold text-lg text-slate-900">
              Sell {sellModalState.holding.symbol} Shares
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You own {sellModalState.holding.shares} shares. How many would you like to sell?
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Shares to sell:</label>
                <input
                  type="number"
                  min="0.1"
                  max={sellModalState.holding.shares}
                  step="0.1"
                  value={sellModalState.sharesToSell}
                  onChange={(e) => setSellModalState(prev => ({ ...prev, sharesToSell: Math.min(prev.holding.shares, Math.max(0.1, Number(e.target.value))) }))}
                  className="mt-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-base"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSellModalState(prev => ({ ...prev, sharesToSell: +(prev.holding.shares / 2).toFixed(2) }))}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold"
                >
                  Sell 50%
                </button>
                <button
                  onClick={() => setSellModalState(prev => ({ ...prev, sharesToSell: prev.holding.shares }))}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold"
                >
                  Sell 100% (All)
                </button>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-900">
                Proceeds will be credited to your simulated cash wallet instantly.
              </div>
            </div>

            <div className="mt-6 flex items-center space-x-3">
              <button
                onClick={() => setSellModalState({ isOpen: false, holding: null, sharesToSell: 1 })}
                className="flex-1 py-3 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSell}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Confirm Sell
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
