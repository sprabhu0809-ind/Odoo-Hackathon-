import React, { useState, useEffect } from 'react';
import { useStock } from '../context/StockContext';
import { X, ShoppingCart, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const BuyModal = () => {
  const {
    buyModal,
    closeBuyModal,
    currency,
    formatMoney,
    formatStockPrice,
    portfolio,
    executeBuy
  } = useStock();

  const stock = buyModal.stock;
  const isINR = currency === 'INR';

  const [shares, setShares] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (buyModal.isOpen) {
      setShares(1);
      setIsSuccess(false);
    }
  }, [buyModal.isOpen]);

  if (!buyModal.isOpen || !stock) return null;

  const currentPriceUSD = stock.priceUSD;
  const currentPriceINR = stock.priceINR;
  const priceToUse = isINR ? currentPriceINR : currentPriceUSD;

  const totalCost = +(shares * priceToUse).toFixed(2);
  const totalCostUSD = isINR ? +(totalCost / 84.5).toFixed(2) : totalCost;

  const hasEnoughBalance = portfolio.cashUSD >= totalCostUSD;

  const handleConfirm = () => {
    if (!hasEnoughBalance) return;
    const ok = executeBuy(stock, Number(shares), totalCostUSD);
    if (ok) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        closeBuyModal();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-modal border border-slate-200 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={closeBuyModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target flex items-center justify-center"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 font-display">
              Order Executed!
            </h3>
            <p className="text-sm text-slate-600 max-w-xs mx-auto">
              You bought <strong>{shares} shares</strong> of {stock.symbol} ({formatMoney(totalCostUSD)}).
              Added to your simulated portfolio!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header: Stock info & badge */}
            <div className="flex items-center space-x-3.5 pr-8">
              <span className="text-3xl p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                {stock.emoji}
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-extrabold text-slate-900 font-display">
                    Simulate Buy {stock.symbol}
                  </h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold ${
                    stock.trafficLight === 'safe'
                      ? 'bg-emerald-100 text-emerald-800'
                      : stock.trafficLight === 'hold'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {stock.trafficLightIcon} {stock.trafficLightLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{stock.name}</p>
              </div>
            </div>

            {/* Price & Wallet Balance Bar */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Share Price:</span>
                <span className="font-extrabold text-base text-slate-900">{formatStockPrice(stock)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-semibold">Simulated Cash Available:</span>
                <span className="font-extrabold text-base text-emerald-700">{formatMoney(portfolio.cashUSD)}</span>
              </div>
            </div>

            {/* Shares Input & Quick Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Number of Shares:
                </label>
                <span className="text-xs text-slate-400 font-bold">
                  Total: {isINR ? `₹${totalCost.toLocaleString('en-IN')}` : `$${totalCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShares(s => Math.max(1, s - 1))}
                  className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg flex items-center justify-center touch-target"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={shares}
                  onChange={(e) => setShares(Math.max(1, Number(e.target.value)))}
                  className="flex-1 py-3 px-4 text-center font-extrabold text-xl bg-white border-2 border-slate-200 rounded-xl focus:border-brand-900 focus:outline-none touch-target"
                />
                <button
                  type="button"
                  onClick={() => setShares(s => s + 1)}
                  className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg flex items-center justify-center touch-target"
                >
                  +
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[11px] font-bold text-slate-400">Presets:</span>
                {[1, 5, 10, 25, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setShares(num)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      shares === num ? 'bg-brand-900 text-white border-brand-900' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Insufficient balance warning */}
            {!hasEnoughBalance && (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>Insufficient simulated balance! You need {formatMoney(totalCostUSD)} but have {formatMoney(portfolio.cashUSD)}.</span>
              </div>
            )}

            {/* AI Safety Advice Pill */}
            <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-xs text-blue-900 leading-relaxed">
              <strong className="font-extrabold flex items-center mb-0.5">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500 fill-amber-500" />
                AI Guidance:
              </strong>
              {stock.simpleVerdict}
            </div>

            {/* Confirm / Cancel Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={closeBuyModal}
                className="flex-1 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors touch-target"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!hasEnoughBalance}
                className="flex-2 w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 touch-target"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Confirm Simulated Buy ({isINR ? `₹${totalCost.toLocaleString('en-IN')}` : `$${totalCost.toFixed(2)}`})</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
