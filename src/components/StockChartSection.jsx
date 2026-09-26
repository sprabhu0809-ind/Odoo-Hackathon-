import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import {
  TrendingUp,
  TrendingDown,
  Volume2,
  Star,
  ShoppingCart,
  DollarSign,
  Info,
  Layers,
  BarChart2,
  Activity,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ComposedChart,
  Line
} from 'recharts';

export const StockChartSection = () => {
  const {
    selectedStock,
    mode,
    currency,
    formatMoney,
    formatStockPrice,
    openBuyModal,
    favorites,
    toggleFavorite,
    speakText,
    isSpeaking,
    speakingId
  } = useStock();

  const [timeframe, setTimeframe] = useState('1M');
  const [proChartType, setProChartType] = useState('candles'); // 'candles' | 'line'

  if (!selectedStock) return null;

  const isFav = favorites.includes(selectedStock.id);
  const isSpeakingThis = speakingId === `chart-${selectedStock.id}` && isSpeaking;

  // Chart data for selected timeframe
  const historySeries = selectedStock.history?.[timeframe] || selectedStock.history?.['1M'] || [];

  // Traffic light badge styling
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (selectedStock.trafficLight === 'hold') {
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (selectedStock.trafficLight === 'risk') {
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
  }

  // Handle Voice Audio advice trigger
  const handleListen = () => {
    const textToSpeak = mode === 'simple'
      ? `${selectedStock.name}. Current price is ${formatStockPrice(selectedStock)}. The AI verdict is: ${selectedStock.simpleVerdict}`
      : `${selectedStock.name} ticker ${selectedStock.symbol}. Trading at ${formatStockPrice(selectedStock)}. Pro Analysis: ${selectedStock.proVerdict}`;
    speakText(textToSpeak, `chart-${selectedStock.id}`);
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-navy text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs">
          <div className="font-bold text-slate-300 mb-1">{data.time || label}</div>
          <div className="text-base font-extrabold text-white">
            {currency === 'INR' ? `₹${(data.price * 84.5).toLocaleString('en-IN')}` : `$${data.price?.toFixed(2)}`}
          </div>
          {mode === 'pro' && (
            <div className="mt-2 space-y-1 text-slate-300 border-t border-slate-700 pt-2 text-[11px]">
              <div>Open: ${data.open} | Close: ${data.close}</div>
              <div>High: ${data.high} | Low: ${data.low}</div>
              <div>SMA 20: ${data.sma20}</div>
              <div>Vol: {(data.volume / 1000000).toFixed(2)}M</div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
      
      {/* Stock Overview Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-6 border-b border-slate-100">
        
        {/* Left: Stock Identity & Traffic Light */}
        <div className="flex items-center space-x-4">
          <span className="text-4xl p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            {selectedStock.emoji}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                {selectedStock.name}
              </h1>
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                {selectedStock.symbol} : {selectedStock.exchange}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border shadow-sm ${badgeColor}`}>
                <span className="mr-1">{selectedStock.trafficLightIcon}</span>
                {selectedStock.trafficLightLabel}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium mt-1">
              Sector: {selectedStock.sector} • AI Score: <strong className="text-slate-800">{selectedStock.aiScore}%</strong> ({selectedStock.aiConfidence})
            </p>
          </div>
        </div>

        {/* Right: Big Price & Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          
          {/* Price Box */}
          <div className="text-left lg:text-right">
            <div className="text-3xl font-extrabold font-display text-slate-900">
              {formatStockPrice(selectedStock)}
            </div>
            <div className="flex items-center space-x-1.5 text-sm font-bold mt-0.5">
              <span className={selectedStock.isPositive ? 'text-emerald-600 flex items-center' : 'text-rose-600 flex items-center'}>
                {selectedStock.isPositive ? <TrendingUp className="w-4 h-4 mr-0.5" /> : <TrendingDown className="w-4 h-4 mr-0.5" />}
                {selectedStock.isPositive ? '+' : ''}{selectedStock.changePercent}%
              </span>
              <span className="text-slate-400 font-normal">
                ({selectedStock.isPositive ? '+' : ''}{selectedStock.change})
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            
            {/* Audio Mode button */}
            <button
              onClick={handleListen}
              className={`touch-target px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-all ${
                isSpeakingThis
                  ? 'bg-amber-400 text-brand-navy ring-4 ring-amber-200 shadow-md animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="Listen to AI advice spoken aloud"
              aria-label="Listen to advice"
            >
              <Volume2 className="w-4 h-4 text-brand-900" />
              <span className="hidden sm:inline">{isSpeakingThis ? 'Speaking...' : '🔊 Listen'}</span>
            </button>

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(selectedStock.id)}
              className={`touch-target p-3 rounded-2xl border transition-all flex items-center justify-center ${
                isFav
                  ? 'bg-amber-400 text-brand-navy border-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
            >
              <Star className={`w-5 h-5 ${isFav ? 'fill-brand-navy' : ''}`} />
            </button>

            {/* Large 48px+ Buy Button */}
            <button
              onClick={() => openBuyModal(selectedStock)}
              className="touch-target px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center space-x-2 transition-all"
              aria-label={`Buy ${selectedStock.symbol}`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Simulate Buy</span>
            </button>

          </div>

        </div>

      </div>

      {/* Mode Indicator & Timeframe Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
        
        {/* Mode Status Pill */}
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-extrabold ${
            mode === 'simple'
              ? 'bg-blue-50 text-brand-900 border border-blue-200'
              : 'bg-slate-900 text-white'
          }`}>
            {mode === 'simple' ? '🌱 Simple View: Clean Line & Plain Terms' : '⚡ Pro View: Technical SMA & Order Metrics'}
          </span>

          {mode === 'pro' && (
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setProChartType('candles')}
                className={`px-2.5 py-1 rounded-lg ${proChartType === 'candles' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Candles
              </button>
              <button
                onClick={() => setProChartType('line')}
                className={`px-2.5 py-1 rounded-lg ${proChartType === 'line' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Area
              </button>
            </div>
          )}
        </div>

        {/* Timeframe Buttons (1D, 1W, 1M, 1Y, ALL) */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full sm:w-auto justify-between">
          {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all touch-target ${
                timeframe === tf
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              aria-label={`Timeframe ${tf}`}
            >
              {tf}
            </button>
          ))}
        </div>

      </div>

      {/* Main Chart Canvas */}
      <div className="mt-6 h-80 sm:h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {mode === 'simple' || proChartType === 'line' ? (
            <AreaChart data={historySeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={selectedStock.isPositive ? '#22c55e' : '#ef4444'}
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="95%"
                    stopColor={selectedStock.isPositive ? '#22c55e' : '#ef4444'}
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(v) => (currency === 'INR' ? `₹${Math.round(v * 84.5)}` : `$${v}`)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={selectedStock.isPositive ? '#22c55e' : '#ef4444'}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          ) : (
            // Pro Mode: Composed Candlestick & Technical Indicator Simulation
            <ComposedChart data={historySeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 3', 'dataMax + 3']}
                tickFormatter={(v) => (currency === 'INR' ? `₹${Math.round(v * 84.5)}` : `$${v}`)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="high"
                fill="#cbd5e1"
                barSize={3}
                isAnimationActive={false}
              />
              <Bar
                dataKey="price"
                fill={selectedStock.isPositive ? '#22c55e' : '#ef4444'}
                barSize={10}
                radius={[4, 4, 4, 4]}
              />
              <Line
                type="monotone"
                dataKey="sma20"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="20-day SMA"
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Pro Mode Sub-Chart: Volume bars & RSI indicator */}
      {mode === 'pro' && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>Trading Volume & Momentum</span>
            <span className="text-brand-900 font-extrabold">RSI (14): {selectedStock.rsi} — Neutral/Accumulation</span>
          </div>
          <div className="h-20 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historySeries} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <Bar dataKey="volume" fill="#93c5fd" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Mode-Specific Insights & Metrics */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        {mode === 'simple' ? (
          // Simple Mode: Plain words, conversational guidance
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-sm text-slate-900 flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
                Plain English AI Verdict
              </span>
              <span className="text-xs font-bold text-slate-500">
                Beginner Friendly Guide
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {selectedStock.simpleVerdict}
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Risk Level</div>
                <div className="text-sm font-extrabold text-slate-800 mt-0.5">
                  {selectedStock.trafficLight === 'safe' ? '🟢 Very Low' : selectedStock.trafficLight === 'hold' ? '🟡 Moderate' : '🔴 High'}
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Trend</div>
                <div className="text-sm font-extrabold text-slate-800 mt-0.5">
                  {selectedStock.isPositive ? '📈 Price is Climbing' : '📉 Cooling Down'}
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Action Advice</div>
                <div className="text-sm font-extrabold text-brand-900 mt-0.5">
                  {selectedStock.trafficLight === 'safe' ? 'Good to Buy' : selectedStock.trafficLight === 'hold' ? 'Hold & Observe' : 'Wait for Dip'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Pro Mode: Wall-Street style financial data table
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center">
                <Activity className="w-4 h-4 mr-1.5 text-brand-900" />
                Fundamental & Technical Metrics (Pro Analysis)
              </h3>
              <span className="text-xs text-slate-400">Real-time simulated depth</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">P/E Ratio</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">{selectedStock.peRatio}</div>
                <div className="text-[10px] text-slate-400">Industry avg: 28.4</div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Market Cap</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">{selectedStock.marketCap}</div>
                <div className="text-[10px] text-slate-400">Mega-Cap Asset</div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">52-Week Range</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">${selectedStock.low52} - ${selectedStock.high52}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Near 52W High</div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Beta & Dividend</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">{selectedStock.beta}β • {selectedStock.dividendYield}</div>
                <div className="text-[10px] text-slate-400">Defensive volatility</div>
              </div>
            </div>

            <div className="mt-3 p-4 bg-brand-50/50 rounded-2xl border border-brand-200 text-xs text-brand-900 leading-relaxed">
              <strong className="font-extrabold">Technical Analysis Summary:</strong> {selectedStock.proVerdict}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
