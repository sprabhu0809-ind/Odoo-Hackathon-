import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import {
  Calculator,
  TrendingUp,
  Sparkles,
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  PiggyBank
} from 'lucide-react';

export const QuickBuySellSimulator = () => {
  const {
    selectedStock,
    currency,
    formatMoney,
    portfolio,
    executeBuy
  } = useStock();

  const isINR = currency === 'INR';
  const defaultAmount = isINR ? 5000 : 100;
  const [investAmount, setInvestAmount] = useState(defaultAmount);
  const [successMessage, setSuccessMessage] = useState('');

  // Quick preset buttons
  const presets = isINR
    ? [1000, 2500, 5000, 10000, 25000]
    : [25, 50, 100, 250, 500];

  // Projected return rate calculation based on AI score
  // E.g. AI score 88 -> ~14.5% annual return, score 44 -> ~4% or volatile
  const estimatedAnnualGrowthPercent = selectedStock
    ? +((selectedStock.aiScore / 100) * 16.5).toFixed(1)
    : 12.0;

  const projected1Yr = Math.round(investAmount * (1 + estimatedAnnualGrowthPercent / 100));
  const projected3Yr = Math.round(investAmount * Math.pow(1 + estimatedAnnualGrowthPercent / 100, 3));
  
  // Traditional bank return (approx 4%)
  const bank1Yr = Math.round(investAmount * 1.04);
  const extraGain = projected1Yr - bank1Yr;

  // Shares calculated
  const stockPriceInCurrentCurrency = isINR
    ? selectedStock.priceINR
    : selectedStock.priceUSD;

  const sharesCount = +(investAmount / stockPriceInCurrentCurrency).toFixed(4);

  const handleSimulateBuy = () => {
    const costInUSD = isINR ? investAmount / 84.5 : investAmount;
    const ok = executeBuy(selectedStock, sharesCount, costInUSD);
    if (ok) {
      setSuccessMessage(`Success! Simulated ${sharesCount} shares of ${selectedStock.symbol} added to your portfolio.`);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold font-display text-slate-900">
              Quick Investment Growth Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            See what happens if you invest in <strong className="text-slate-800">{selectedStock.name} ({selectedStock.symbol})</strong> today!
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">
          <span>Available Cash:</span>
          <span className="text-brand-900 font-extrabold">{formatMoney(portfolio.cashUSD)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left: Input & Preset Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              How much would you like to invest?
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-900 font-black text-xl">
                {isINR ? '₹' : '$'}
              </div>
              <input
                type="number"
                min="1"
                value={investAmount}
                onChange={(e) => setInvestAmount(Math.max(1, Number(e.target.value)))}
                className="w-full pl-10 pr-4 py-3.5 bg-white text-slate-900 text-xl font-extrabold rounded-2xl border-2 border-slate-200 focus:border-brand-900 focus:ring-4 focus:ring-brand-900/10 transition-all touch-target"
                placeholder="100"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Tap a Quick Preset:
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setInvestAmount(amt)}
                  className={`touch-target px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                    investAmount === amt
                      ? 'bg-brand-900 text-white border-brand-900 shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {isINR ? `₹${amt.toLocaleString('en-IN')}` : `$${amt}`}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
              <span>Slider Adjustment</span>
              <span className="text-brand-900">{isINR ? `₹${investAmount.toLocaleString('en-IN')}` : `$${investAmount}`}</span>
            </div>
            <input
              type="range"
              min={isINR ? 500 : 10}
              max={isINR ? 100000 : 2500}
              step={isINR ? 500 : 10}
              value={investAmount}
              onChange={(e) => setInvestAmount(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-900"
            />
          </div>

          {/* Calculation summary */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Shares you receive:</span>
              <strong className="text-slate-900 font-extrabold">{sharesCount} shares</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Current Stock Price:</span>
              <span className="text-slate-900 font-semibold">{isINR ? `₹${selectedStock.priceINR}` : `$${selectedStock.priceUSD}`}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>AI Safety Rating:</span>
              <span className="font-extrabold text-emerald-700">{selectedStock.trafficLightIcon} {selectedStock.trafficLightLabel}</span>
            </div>
          </div>

        </div>

        {/* Right: Projected Growth Cards (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Growth Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1-Year Estimate Card */}
            <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-2">
                <span>In 1 Year (Estimated)</span>
                <span className="bg-emerald-100 px-2 py-0.5 rounded-full">+{estimatedAnnualGrowthPercent}%</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                {isINR ? `₹${projected1Yr.toLocaleString('en-IN')}` : `$${projected1Yr.toLocaleString('en-US')}`}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Estimated profit: <strong className="text-emerald-600">+{isINR ? `₹${(projected1Yr - investAmount).toLocaleString('en-IN')}` : `$${(projected1Yr - investAmount).toLocaleString('en-US')}`}</strong>
              </p>
            </div>

            {/* 3-Year Long Term Card */}
            <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between text-brand-900 text-xs font-extrabold uppercase tracking-wider mb-2">
                <span>In 3 Years (Compound)</span>
                <span className="bg-blue-100 px-2 py-0.5 rounded-full">Long Term</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
                {isINR ? `₹${projected3Yr.toLocaleString('en-IN')}` : `$${projected3Yr.toLocaleString('en-US')}`}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Projected total value with compounding dividends
              </p>
            </div>

          </div>

          {/* Comparison vs Bank Savings */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <PiggyBank className="w-5 h-5" />
              </span>
              <div>
                <span className="font-bold text-slate-800 block">Bank Savings vs StockSense AI</span>
                <span className="text-slate-500">Regular bank (~4%): {isINR ? `₹${bank1Yr.toLocaleString('en-IN')}` : `$${bank1Yr}`}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-emerald-700 font-extrabold block">
                +{isINR ? `₹${extraGain.toLocaleString('en-IN')}` : `$${extraGain}`} extra
              </span>
              <span className="text-[10px] text-slate-400 font-medium">with smart stock pick</span>
            </div>
          </div>

          {/* One-Tap Execute Buy Button */}
          <div>
            <button
              onClick={handleSimulateBuy}
              className="w-full touch-target py-4 px-6 bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-brand-900/20 transition-all flex items-center justify-center space-x-2 group"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Simulate Investment of {isINR ? `₹${investAmount.toLocaleString('en-IN')}` : `$${investAmount}`} in {selectedStock.symbol}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {successMessage && (
              <div className="mt-3 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
