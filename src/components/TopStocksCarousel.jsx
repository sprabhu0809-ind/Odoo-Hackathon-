import React, { useRef } from 'react';
import { useStock } from '../context/StockContext';
import {
  TrendingUp,
  TrendingDown,
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Volume2
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

export const TopStocksCarousel = () => {
  const {
    stocks,
    selectedStockId,
    setSelectedStockId,
    favorites,
    toggleFavorite,
    openBuyModal,
    formatStockPrice,
    mode,
    speakText,
    speakStockAdvice,
    isSpeaking,
    speakingId,
    isLiveTickerActive,
    toggleLiveTicker,
    priceFlashes,
    lastMarketUpdate
  } = useStock();

  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-extrabold font-display text-slate-900 flex items-center space-x-2">
              <span>🔥 Trending Stocks & Live Prices</span>
            </h2>
            {/* Live Ticker Pulse Badge */}
            <button
              onClick={toggleLiveTicker}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide border transition-all ${
                isLiveTickerActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
              title="Click to pause or resume real-time price fluctuations"
            >
              <span className={`w-2 h-2 rounded-full mr-1.5 ${isLiveTickerActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
              <span>{isLiveTickerActive ? 'LIVE • TICKING' : 'PAUSED'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Updated at {lastMarketUpdate} • Prices fluctuate in real-time. Tap any card to inspect live chart.
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-colors touch-target flex items-center justify-center"
            title="Scroll left"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-colors touch-target flex items-center justify-center"
            title="Scroll right"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Deck */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {stocks.map((stock) => {
          const isSelected = stock.id === selectedStockId;
          const isFav = favorites.includes(stock.id);
          const isSpeakingStock = speakingId === `card-${stock.id}` && isSpeaking;

          // Traffic light badge styling
          let trafficBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          if (stock.trafficLight === 'hold') {
            trafficBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
          } else if (stock.trafficLight === 'risk') {
            trafficBadgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
          }

          // Sparkline data
          const sparklineData = stock.sparkline.map((val, idx) => ({ idx, val }));

          return (
            <div
              key={stock.id}
              onClick={() => setSelectedStockId(stock.id)}
              className={`snap-start flex-shrink-0 w-80 sm:w-88 rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-brand-900 shadow-card-hover ring-4 ring-brand-900/10'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-card hover:shadow-card-hover'
              }`}
            >
              {/* Top Row: Logo, Symbol, Favorite Button */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl p-2 bg-slate-50 rounded-2xl border border-slate-100">
                      {stock.emoji}
                    </span>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-base text-slate-900">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                          {stock.exchange}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[140px]">
                        {stock.name}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Favorite & Listen */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakStockAdvice(stock);
                      }}
                      className={`p-2 rounded-xl text-xs transition-colors touch-target flex items-center justify-center ${
                        speakingId === `stock-${stock.id}` && isSpeaking ? 'bg-amber-400 text-brand-navy ring-2 ring-amber-300' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Listen to live price & advice"
                      aria-label={`Listen to live price and advice for ${stock.symbol}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(stock.id);
                      }}
                      className={`p-2 rounded-xl text-xs transition-colors touch-target flex items-center justify-center ${
                        isFav ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
                      }`}
                      title={isFav ? 'Remove favorite' : 'Add favorite'}
                      aria-label={`Favorite ${stock.symbol}`}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Big Prominent Traffic Light Badge (ACCESSIBILITY REQUIREMENT) */}
                <div className="mt-3.5">
                  <div className={`w-full py-2 px-3 rounded-2xl border text-xs sm:text-sm font-extrabold flex items-center justify-between shadow-sm ${trafficBadgeClass}`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{stock.trafficLightIcon}</span>
                      <span>{stock.trafficLightLabel}</span>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider opacity-80">
                      AI Score: {stock.aiScore}%
                    </span>
                  </div>
                </div>

                {/* Price, Arrow & Mini Sparkline with Real-Time Flashing */}
                {(() => {
                  const flash = priceFlashes[stock.id];
                  const flashBadgeClass = flash === 'up'
                    ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400 px-2 py-0.5 rounded-lg'
                    : flash === 'down'
                    ? 'bg-rose-100 text-rose-800 ring-2 ring-rose-400 px-2 py-0.5 rounded-lg'
                    : 'text-slate-900';

                  return (
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-xl font-extrabold transition-all duration-300 ${flashBadgeClass}`}>
                            {formatStockPrice(stock)}
                          </span>
                          {flash && (
                            <span className="text-[10px] font-black animate-bounce text-emerald-600">
                              {flash === 'up' ? '▲' : '▼'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-xs font-bold mt-0.5">
                          {stock.isPositive ? (
                            <span className="text-emerald-600 flex items-center">
                              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                              +{stock.changePercent}%
                            </span>
                          ) : (
                            <span className="text-rose-600 flex items-center">
                              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                              {stock.changePercent}%
                            </span>
                          )}
                          <span className="text-slate-400 font-normal">
                            ({stock.isPositive ? '+' : ''}{stock.change})
                          </span>
                        </div>
                      </div>

                      {/* Sparkline Visual */}
                      <div className="w-24 h-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sparklineData}>
                            <Line
                              type="monotone"
                              dataKey="val"
                              stroke={stock.isPositive ? '#22c55e' : '#ef4444'}
                              strokeWidth={2.5}
                              dot={false}
                              isAnimationActive={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })()}

                {/* Simple Mode plain words summary */}
                <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {mode === 'simple' ? stock.simpleVerdict : stock.proVerdict}
                  </p>
                </div>
              </div>

              {/* Bottom Quick Action: 48px+ Buy Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openBuyModal(stock);
                  }}
                  className="flex-1 touch-target py-2.5 px-4 bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-900/10 flex items-center justify-center space-x-1.5 transition-all"
                  aria-label={`Buy ${stock.symbol}`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy {stock.symbol}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
