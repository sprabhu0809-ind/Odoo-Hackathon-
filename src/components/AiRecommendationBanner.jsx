import React from 'react';
import { useStock } from '../context/StockContext';
import { Sparkles, Volume2, ArrowRight, ShieldCheck, Star, ShoppingCart } from 'lucide-react';

export const AiRecommendationBanner = () => {
  const {
    stocks,
    selectedStockId,
    setSelectedStockId,
    openBuyModal,
    favorites,
    toggleFavorite,
    speakText,
    speakStockAdvice,
    isSpeaking,
    speakingId,
    formatStockPrice
  } = useStock();

  // Find featured stock or default to highest score
  const featured = stocks.find(s => s.isFeaturedAiPick) ||
    [...stocks].sort((a, b) => b.aiScore - a.aiScore)[0];

  if (!featured) return null;

  const isCurrentSpeaking = speakingId === `stock-${featured.id}` && isSpeaking;
  const isFav = favorites.includes(featured.id);

  const handleListen = (e) => {
    e.stopPropagation();
    speakStockAdvice(featured);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-blue-900 to-indigo-950 text-white shadow-card p-6 sm:p-7 border border-blue-800">
      
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: AI Highlight Info */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-brand-navy shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1 fill-brand-navy" />
              TOP AI PICK OF THE DAY
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              🟢 {featured.aiScore}% Buy Score
            </span>
            <span className="text-xs text-blue-200 font-medium">
              Confidence: {featured.aiConfidence}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-3xl">{featured.emoji}</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-white">
                {featured.name} ({featured.symbol}) is performing well today!
              </h2>
              <div className="flex items-center space-x-2 text-sm text-blue-100 font-medium mt-0.5">
                <span>Current Price: <strong className="text-white font-bold">{formatStockPrice(featured)}</strong></span>
                <span>•</span>
                <span className={featured.isPositive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {featured.isPositive ? '+' : ''}{featured.changePercent}% today
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
            "{featured.simpleVerdict}"
          </p>
        </div>

        {/* Right: Quick Action Buttons (Listen, Buy, Details) */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Audio Advice Button */}
          <button
            onClick={handleListen}
            className={`touch-target px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
              isCurrentSpeaking
                ? 'bg-amber-400 text-brand-navy ring-4 ring-amber-300/40 shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
            title="Listen to AI audio advice"
            aria-label="Listen to AI advice"
          >
            <Volume2 className={`w-4 h-4 ${isCurrentSpeaking ? 'animate-bounce' : ''}`} />
            <span>{isCurrentSpeaking ? 'Speaking...' : '🔊 Listen to AI Advice'}</span>
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={() => toggleFavorite(featured.id)}
            className={`touch-target p-3 rounded-2xl border transition-all flex items-center justify-center ${
              isFav
                ? 'bg-amber-400 text-brand-navy border-amber-300'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Star className={`w-5 h-5 ${isFav ? 'fill-brand-navy' : ''}`} />
          </button>

          {/* Quick Buy Simulator Button */}
          <button
            onClick={() => openBuyModal(featured)}
            className="touch-target px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-brand-navy shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center space-x-2"
            aria-label={`Buy ${featured.symbol}`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Quick Buy</span>
          </button>

          {/* View Details / Select Stock */}
          <button
            onClick={() => setSelectedStockId(featured.id)}
            className="touch-target px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-white hover:bg-blue-50 text-brand-900 transition-all flex items-center justify-center space-x-1.5"
            aria-label="View stock chart"
          >
            <span>View Chart</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
