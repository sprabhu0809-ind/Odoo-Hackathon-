import React from 'react';
import { useStock } from '../context/StockContext';
import { ShieldCheck, Volume2, AlertTriangle, TrendingUp, CheckCircle2, Info } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

export const MarketHealthMeter = () => {
  const { marketHealth, speakText, isSpeaking, speakingId, mode } = useStock();

  const isCurrentSpeaking = speakingId === 'market-health-speech' && isSpeaking;

  const score = marketHealth.score || 82;
  const isSafe = score >= 70;
  const isCaution = score >= 45 && score < 70;
  const isRisk = score < 45;

  const statusLabel = isSafe
    ? 'Market is Safe Today'
    : isCaution
    ? 'Market is Cautious / Neutral'
    : 'Market is Risky / Volatile';

  const statusColorClass = isSafe
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
    : isCaution
    ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-rose-700 bg-rose-50 border-rose-200';

  const gaugeColor = isSafe ? '#22c55e' : isCaution ? '#f59e0b' : '#ef4444';

  const chartData = [
    {
      name: 'Market Health',
      value: score,
      fill: gaugeColor,
    },
  ];

  const handleListen = () => {
    speakText(marketHealth.audioSummary, 'market-health-speech');
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left: Speedometer / Radial Gauge Visual */}
        <div className="flex items-center space-x-6 w-full lg:w-auto justify-center lg:justify-start">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="75%"
                outerRadius="100%"
                barSize={12}
                data={chartData}
                startAngle={210}
                endAngle={-30}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: '#f1f5f9' }}
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            
            {/* Center Gauge Value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                {score}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Out of 100
              </span>
            </div>
          </div>

          {/* Status Badge & Headline */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-extrabold border shadow-sm ${statusColorClass}`}>
                <span className="text-base mr-1.5">
                  {isSafe ? '🟢' : isCaution ? '🟡' : '🔴'}
                </span>
                {statusLabel}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {marketHealth.headline}
            </h2>
            <p className="text-xs text-slate-500 font-medium max-w-md">
              {mode === 'simple'
                ? "Our AI analyzes inflation, company profits, and risk scores every morning so you know when it's safe to invest."
                : "Aggregated algorithmic sentiment analyzing S&P/NIFTY earnings dispersion, VIX volatility delta, and macroeconomic liquidity."}
            </p>
          </div>
        </div>

        {/* Right: Key Factors & Audio Trigger */}
        <div className="flex flex-col sm:flex-row items-center lg:items-end justify-between lg:justify-end gap-4 w-full lg:w-auto">
          
          {/* Key health indicator pills */}
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            {marketHealth.indicators.map((ind, idx) => (
              <div
                key={idx}
                className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80 flex items-center space-x-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <div className="text-left">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {ind.name}
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {ind.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Listen to Market Audio Button */}
          <button
            onClick={handleListen}
            className={`w-full sm:w-auto touch-target px-5 py-3 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-sm ${
              isCurrentSpeaking
                ? 'bg-amber-500 text-white ring-4 ring-amber-200 animate-pulse'
                : 'bg-brand-50 hover:bg-brand-100/80 text-brand-900 border border-brand-200 hover:border-brand-300'
            }`}
            title="Listen to AI audio advice for today's market"
            aria-label="Listen to market advice"
          >
            <Volume2 className={`w-5 h-5 text-brand-900 ${isCurrentSpeaking ? 'text-white' : ''}`} />
            <span>{isCurrentSpeaking ? 'Speaking Market Advice...' : '🔊 Listen to Market Advice'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
