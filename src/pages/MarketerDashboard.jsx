import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStock } from '../context/StockContext';
import { AppIconBadge } from '../components/AppIconBadge';
import {
  TrendingUp,
  Megaphone,
  Users,
  MessageSquare,
  Volume2,
  Star,
  Activity,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Eye,
  Radio,
  Send,
  BarChart3
} from 'lucide-react';

export const MarketerDashboard = () => {
  const navigate = useNavigate();
  const {
    stocks,
    systemBroadcast,
    updateBroadcast,
    formatStockPrice
  } = useStock();

  const [broadcastDraft, setBroadcastDraft] = useState(systemBroadcast.text);
  const [broadcastActive, setBroadcastActive] = useState(systemBroadcast.active);
  const [broadcastType, setBroadcastType] = useState('info');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Marketer engagement metrics (mock)
  const marketerMetrics = [
    { label: 'Daily Active Users (DAU)', value: '14,820', change: '+18.4%', icon: Users, variant: 'brand' },
    { label: 'AI Chat Messages Sent', value: '8,429', change: '+24.1%', icon: MessageSquare, variant: 'whatsapp' },
    { label: 'AI Voice Advice Listens', value: '19,304', change: '+32.8%', icon: Volume2, variant: 'youtube' },
    { label: 'User Retention Rate', value: '89.2%', change: '+3.1%', icon: Star, variant: 'favorite' },
  ];

  // Most trending stocks among users (mock engagement metrics)
  const trendingUserStocks = [
    { symbol: 'NVDA', name: 'NVIDIA Corp', views: '42.8K views', saves: '3,840 saves', aiScore: 92, emoji: '🤖' },
    { symbol: 'AAPL', name: 'Apple Inc.', views: '38.1K views', saves: '4,120 saves', aiScore: 88, emoji: '🍎' },
    { symbol: 'RELIANCE', name: 'Reliance Industries', views: '29.4K views', saves: '2,910 saves', aiScore: 85, emoji: '🏭' },
    { symbol: 'MSFT', name: 'Microsoft Corp', views: '26.8K views', saves: '2,450 saves', aiScore: 90, emoji: '🪟' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', views: '22.3K views', saves: '2,100 saves', aiScore: 86, emoji: '🏦' },
    { symbol: 'TSLA', name: 'Tesla Inc.', views: '21.5K views', saves: '1,890 saves', aiScore: 44, emoji: '⚡' },
  ];

  const handlePublish = (e) => {
    e.preventDefault();
    if (!broadcastDraft.trim()) return;

    updateBroadcast({
      id: `b-${Date.now()}`,
      text: broadcastDraft,
      active: broadcastActive,
      type: broadcastType
    });

    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16 selection:bg-brand-900 selection:text-white">
      
      {/* Top Header */}
      <div className="bg-brand-navy text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3">
              <Link
                to="/app"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors flex items-center space-x-1.5 touch-target"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs font-bold">Go to User App</span>
              </Link>

              <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 font-extrabold text-[10px] uppercase tracking-wider border border-indigo-500/30">
                    Marketer Portal
                  </span>
                  <h1 className="font-extrabold text-lg text-white font-display">
                    StockSense Growth & Campaign Dashboard
                  </h1>
                </div>
                <p className="text-xs text-slate-400">
                  Monitor audience engagement, trending stock traffic, and compose live user broadcast banners
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Switch Role
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        
        {/* Section 1: Engagement Analytics Cards */}
        <div>
          <h2 className="text-base font-extrabold text-slate-900 mb-3 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>Audience Engagement Overview</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketerMetrics.map((m, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {m.label}
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 font-display">
                    {m.value}
                  </div>
                  <span className="text-xs font-bold text-emerald-600 mt-1 inline-block">
                    {m.change} vs last week
                  </span>
                </div>
                <AppIconBadge icon={m.icon} variant={m.variant} size="md" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Trending Stocks Among Users & Broadcast Composer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Trending Stocks Panel (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Trending Stocks Among Users</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Top stocks users are actively searching, viewing, and simulating
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {trendingUserStocks.map((stock, i) => (
                <div key={stock.symbol} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-extrabold text-xs text-slate-400 w-4">#{i + 1}</span>
                    <span className="text-2xl p-1.5 bg-slate-50 rounded-xl">{stock.emoji}</span>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">{stock.symbol}</div>
                      <div className="text-[10px] text-slate-400">{stock.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-800">{stock.views}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{stock.saves}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Broadcast Composer (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-card space-y-5">
            <div>
              <div className="flex items-center space-x-2 text-brand-navy">
                <AppIconBadge icon={Megaphone} variant="brand" size="sm" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Broadcast Campaign Composer
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Compose an announcement banner to broadcast directly across all active user dashboard feeds.
              </p>
            </div>

            <form onSubmit={handlePublish} className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Announcement Text
                </label>
                <textarea
                  rows={3}
                  value={broadcastDraft}
                  onChange={(e) => setBroadcastDraft(e.target.value)}
                  placeholder="e.g. Market Special: Check out top green-rated AI chip stocks today!"
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-medium text-xs focus:border-brand-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alert Category</label>
                  <select
                    value={broadcastType}
                    onChange={(e) => setBroadcastType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="info">📢 Information / Market News</option>
                    <option value="alert">⚡ Urgent / Holiday Notice</option>
                    <option value="success">🌟 New Feature Highlight</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">Status</span>
                    <span className="text-[10px] text-slate-400">Live on feeds</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={broadcastActive}
                    onChange={(e) => setBroadcastActive(e.target.checked)}
                    className="w-5 h-5 accent-brand-900 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 bg-brand-navy text-white rounded-2xl">
                <div className="flex items-center text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                  <Radio className="w-3 h-3 mr-1 animate-pulse" /> Live Banner Preview
                </div>
                <div className="text-xs font-semibold text-blue-100">
                  {broadcastDraft || 'Draft your message above to see preview.'}
                </div>
              </div>

              <button
                type="submit"
                className="w-full touch-target py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Publish Announcement Banner</span>
              </button>

              {publishSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Announcement published! Connected user feeds will see this banner immediately.</span>
                </div>
              )}
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
