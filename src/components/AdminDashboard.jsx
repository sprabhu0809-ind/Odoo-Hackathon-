import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import {
  ShieldCheck,
  ArrowLeft,
  Users,
  TrendingUp,
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  Database,
  Key,
  CheckCircle2,
  AlertTriangle,
  Search,
  Activity,
  BarChart3,
  DollarSign,
  Radio,
  Sliders
} from 'lucide-react';

// TODO: Replace with Clerk useUser() hook once auth is connected
// Example: const { user, isSignedIn } = useUser();
// if (!user || user.publicMetadata.role !== 'admin') return <AccessDenied />;

export const AdminDashboard = () => {
  const {
    stocks,
    updateStock,
    addStock,
    deleteStock,
    setFeaturedAiStock,
    adminUsers,
    updateUserStatus,
    systemBroadcast,
    updateBroadcast,
    setCurrentTab,
    adminSubTab,
    setAdminSubTab,
    marketHealth,
    setMarketHealth,
    formatMoney
  } = useStock();

  const [stockSearch, setStockSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Edit stock modal state
  const [editingStock, setEditingStock] = useState(null);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);

  // New stock form state
  const [newStockForm, setNewStockForm] = useState({
    symbol: '',
    name: '',
    exchange: 'NASDAQ',
    priceUSD: 100,
    sector: 'Technology',
    trafficLight: 'safe',
    trafficLightLabel: 'Good Buy / Safe',
    trafficLightIcon: '🟢',
    simpleVerdict: 'Strong balance sheet and good growth outlook.',
    proVerdict: 'Favorable risk-reward ratio above key moving averages.',
    aiScore: 80,
    aiConfidence: 'High (85%)',
    peRatio: 25,
    marketCap: '$500B',
    emoji: '🏢'
  });

  // Broadcast tool state
  const [broadcastDraft, setBroadcastDraft] = useState(systemBroadcast.text);
  const [broadcastActive, setBroadcastActive] = useState(systemBroadcast.active);
  const [broadcastType, setBroadcastType] = useState(systemBroadcast.type || 'info');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Filter stocks
  const filteredStocks = stocks.filter(s =>
    s.symbol.toLowerCase().includes(stockSearch.toLowerCase()) ||
    s.name.toLowerCase().includes(stockSearch.toLowerCase())
  );

  // Filter users
  const filteredUsers = adminUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Handle Save Edited Stock
  const handleSaveStock = (e) => {
    e.preventDefault();
    if (!editingStock) return;
    updateStock(editingStock.id, editingStock);
    setEditingStock(null);
  };

  // Handle Add New Stock
  const handleAddNewStock = (e) => {
    e.preventDefault();
    if (!newStockForm.symbol.trim() || !newStockForm.name.trim()) {
      alert("Please provide symbol and company name.");
      return;
    }
    addStock(newStockForm);
    setIsAddStockOpen(false);
    setNewStockForm({
      symbol: '',
      name: '',
      exchange: 'NASDAQ',
      priceUSD: 100,
      sector: 'Technology',
      trafficLight: 'safe',
      trafficLightLabel: 'Good Buy / Safe',
      trafficLightIcon: '🟢',
      simpleVerdict: 'Solid growth with low debt.',
      proVerdict: 'Bullish consolidation pattern.',
      aiScore: 80,
      aiConfidence: 'High (85%)',
      peRatio: 25,
      marketCap: '$500B',
      emoji: '🏢'
    });
  };

  // Handle Broadcast Update
  const handlePublishBroadcast = () => {
    updateBroadcast({
      id: `b-${Date.now()}`,
      text: broadcastDraft,
      active: broadcastActive,
      type: broadcastType
    });
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      
      {/* Admin Top Header */}
      <div className="bg-brand-navy text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentTab('user')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors flex items-center space-x-1.5 touch-target"
                title="Return to User View"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs font-bold">Back to User App</span>
              </button>
              
              <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-black text-[10px] uppercase tracking-wider border border-amber-500/30">
                    Administrator
                  </span>
                  <h1 className="font-extrabold text-lg text-white font-display">
                    StockSense Admin Console
                  </h1>
                </div>
                <p className="text-xs text-slate-400">
                  Manage live mock stocks, user privileges, system broadcasts, and platform analytics
                </p>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center space-x-1 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'stocks', label: 'Stocks Panel', icon: TrendingUp },
                { id: 'users', label: 'Users Table', icon: Users },
                { id: 'broadcast', label: 'Broadcast Tool', icon: Megaphone },
                { id: 'integrations', label: 'Clerk & DB', icon: Database },
              ].map((sub) => {
                const Icon = sub.icon;
                const isActive = adminSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setAdminSubTab(sub.id)}
                    className={`touch-target px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500 text-brand-navy shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* SUB-TAB 1: ANALYTICS OVERVIEW */}
        {adminSubTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span>Simulated Trading Volume</span>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-display">
                  $2,458,910
                </div>
                <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> +14.2% vs yesterday
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span>Active Platform Users</span>
                  <Users className="w-4 h-4 text-brand-900" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-display">
                  14,820
                </div>
                <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> +820 registered this week
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span>AI Verdict Accuracy</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-display">
                  91.4%
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  Based on 30-day directional targets
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span>Total Simulated Orders</span>
                  <Activity className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-display">
                  42,190
                </div>
                <div className="text-xs text-indigo-600 font-bold mt-1">
                  Average 3.2 trades per user
                </div>
              </div>
            </div>

            {/* Market Health Admin Controller */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Live Market Health Meter State
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adjust the live speedometer gauge value and status displayed on the user dashboard.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setMarketHealth(prev => ({ ...prev, score: 85, status: 'Market is Safe Today', state: 'safe' }))}
                    className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs"
                  >
                    🟢 Set Safe (85)
                  </button>
                  <button
                    onClick={() => setMarketHealth(prev => ({ ...prev, score: 55, status: 'Market is Cautious / Neutral', state: 'caution' }))}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs"
                  >
                    🟡 Set Caution (55)
                  </button>
                  <button
                    onClick={() => setMarketHealth(prev => ({ ...prev, score: 32, status: 'Market is Risky / Volatile', state: 'risk' }))}
                    className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs"
                  >
                    🔴 Set Risk (32)
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-4">
                <span className="text-xs font-bold text-slate-600">Current Score:</span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={marketHealth.score}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const state = val >= 70 ? 'safe' : val >= 45 ? 'caution' : 'risk';
                    const status = state === 'safe' ? 'Market is Safe Today' : state === 'caution' ? 'Market is Cautious / Neutral' : 'Market is Risky / Volatile';
                    setMarketHealth(prev => ({ ...prev, score: val, state, status }));
                  }}
                  className="flex-1 accent-brand-900"
                />
                <span className="font-extrabold text-slate-900 text-lg w-12 text-right">
                  {marketHealth.score}
                </span>
              </div>
            </div>

            {/* Trending Stocks Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
              <h3 className="font-extrabold text-base text-slate-900 mb-4">
                Top Trending Stocks (Live Mock Heatmap)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stocks.slice(0, 4).map((s) => (
                  <div key={s.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{s.emoji}</span>
                      <span className="text-xs font-bold text-slate-500">{s.symbol}</span>
                    </div>
                    <div className="font-extrabold text-slate-900 text-base mt-2">
                      ${s.priceUSD}
                    </div>
                    <div className={`text-xs font-bold ${s.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {s.isPositive ? '+' : ''}{s.changePercent}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SUB-TAB 2: STOCK MANAGEMENT */}
        {adminSubTab === 'stocks' && (
          <div className="space-y-5">
            
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter stocks by symbol or name..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
              </div>

              <button
                onClick={() => setIsAddStockOpen(true)}
                className="w-full sm:w-auto touch-target px-4 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-xs rounded-2xl shadow-sm flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Mock Stock</span>
              </button>
            </div>

            {/* Stocks Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Price (USD)</th>
                      <th className="py-3.5 px-4">Change</th>
                      <th className="py-3.5 px-4">Traffic Light</th>
                      <th className="py-3.5 px-4">AI Score</th>
                      <th className="py-3.5 px-4">AI Banner</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStocks.map((stock) => (
                      <tr key={stock.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2.5">
                            <span className="text-2xl">{stock.emoji}</span>
                            <div>
                              <div className="font-extrabold text-slate-900">{stock.symbol}</div>
                              <div className="text-[11px] text-slate-400">{stock.name}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          ${stock.priceUSD.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`font-bold ${stock.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {stock.isPositive ? '+' : ''}{stock.changePercent}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            stock.trafficLight === 'safe'
                              ? 'bg-emerald-100 text-emerald-800'
                              : stock.trafficLight === 'hold'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {stock.trafficLightIcon} {stock.trafficLightLabel}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-black text-slate-900">
                          {stock.aiScore}%
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => setFeaturedAiStock(stock.id)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                              stock.isFeaturedAiPick
                                ? 'bg-amber-400 text-brand-navy border-amber-400 font-black'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {stock.isFeaturedAiPick ? '⭐ Featured' : 'Set as Pick'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setEditingStock({ ...stock })}
                              className="p-1.5 text-slate-500 hover:text-brand-900 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Stock"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${stock.symbol}?`)) {
                                  deleteStock(stock.id);
                                }
                              }}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Stock"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EDIT STOCK MODAL */}
            {editingStock && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-modal border border-slate-200 max-h-[90vh] overflow-y-auto">
                  <h3 className="font-extrabold text-lg text-slate-900">
                    Edit Stock: {editingStock.symbol} ({editingStock.name})
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Updates will immediately sync across all user views and calculators.
                  </p>

                  <form onSubmit={handleSaveStock} className="mt-4 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Price (USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingStock.priceUSD}
                          onChange={(e) => setEditingStock({ ...editingStock, priceUSD: Number(e.target.value) })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Change (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingStock.changePercent}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setEditingStock({ ...editingStock, changePercent: val, isPositive: val >= 0 });
                          }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Traffic Light Status</label>
                        <select
                          value={editingStock.trafficLight}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingStock({
                              ...editingStock,
                              trafficLight: val,
                              trafficLightLabel: val === 'safe' ? 'Good Buy / Safe' : val === 'hold' ? 'Hold / Wait' : 'Don\'t Buy / High Risk',
                              trafficLightIcon: val === 'safe' ? '🟢' : val === 'hold' ? '🟡' : '🔴'
                            });
                          }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        >
                          <option value="safe">🟢 Safe (Good Buy)</option>
                          <option value="hold">🟡 Hold (Wait)</option>
                          <option value="risk">🔴 Risk (Don't Buy)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">AI Score (0-100)</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={editingStock.aiScore}
                          onChange={(e) => setEditingStock({ ...editingStock, aiScore: Number(e.target.value) })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Simple Verdict (Beginners)</label>
                      <textarea
                        rows={2}
                        value={editingStock.simpleVerdict}
                        onChange={(e) => setEditingStock({ ...editingStock, simpleVerdict: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Pro Verdict (Technical Traders)</label>
                      <textarea
                        rows={2}
                        value={editingStock.proVerdict}
                        onChange={(e) => setEditingStock({ ...editingStock, proVerdict: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                      />
                    </div>

                    <div className="flex items-center space-x-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setEditingStock(null)}
                        className="flex-1 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-brand-900 text-white font-extrabold rounded-xl shadow-md"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ADD STOCK MODAL */}
            {isAddStockOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-modal border border-slate-200 max-h-[90vh] overflow-y-auto">
                  <h3 className="font-extrabold text-lg text-slate-900">
                    Add New Mock Stock
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Create a new stock ticker to simulate trading and advisory signals.
                  </p>

                  <form onSubmit={handleAddNewStock} className="mt-4 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Ticker Symbol</label>
                        <input
                          type="text"
                          placeholder="e.g. GOOGL"
                          value={newStockForm.symbol}
                          onChange={(e) => setNewStockForm({ ...newStockForm, symbol: e.target.value.toUpperCase() })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Alphabet Inc."
                          value={newStockForm.name}
                          onChange={(e) => setNewStockForm({ ...newStockForm, name: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Price (USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newStockForm.priceUSD}
                          onChange={(e) => setNewStockForm({ ...newStockForm, priceUSD: Number(e.target.value) })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Sector</label>
                        <input
                          type="text"
                          value={newStockForm.sector}
                          onChange={(e) => setNewStockForm({ ...newStockForm, sector: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Icon Emoji</label>
                        <input
                          type="text"
                          value={newStockForm.emoji}
                          onChange={(e) => setNewStockForm({ ...newStockForm, emoji: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Traffic Light</label>
                        <select
                          value={newStockForm.trafficLight}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewStockForm({
                              ...newStockForm,
                              trafficLight: val,
                              trafficLightLabel: val === 'safe' ? 'Good Buy / Safe' : val === 'hold' ? 'Hold / Wait' : 'Don\'t Buy / High Risk',
                              trafficLightIcon: val === 'safe' ? '🟢' : val === 'hold' ? '🟡' : '🔴'
                            });
                          }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        >
                          <option value="safe">🟢 Safe (Good Buy)</option>
                          <option value="hold">🟡 Hold (Wait)</option>
                          <option value="risk">🔴 Risk (Don't Buy)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">AI Score (0-100)</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={newStockForm.aiScore}
                          onChange={(e) => setNewStockForm({ ...newStockForm, aiScore: Number(e.target.value) })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Simple Verdict (Beginners)</label>
                      <textarea
                        rows={2}
                        value={newStockForm.simpleVerdict}
                        onChange={(e) => setNewStockForm({ ...newStockForm, simpleVerdict: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                      />
                    </div>

                    <div className="flex items-center space-x-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsAddStockOpen(false)}
                        className="flex-1 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-md"
                      >
                        Add Stock
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* SUB-TAB 3: USER MANAGEMENT */}
        {adminSubTab === 'users' && (
          <div className="space-y-5">
            {/* Search */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
              </div>
              <span className="text-xs font-bold text-slate-500">
                Total Users: {adminUsers.length}
              </span>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">User</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Simulated Balance</th>
                      <th className="py-3.5 px-4">Trades</th>
                      <th className="py-3.5 px-4">Last Active</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2.5">
                            <span className="text-xl p-1.5 bg-slate-100 rounded-full">{u.avatar}</span>
                            <div>
                              <div className="font-extrabold text-slate-900">{u.name}</div>
                              <div className="text-[11px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            u.role === 'Admin'
                              ? 'bg-amber-100 text-amber-900'
                              : u.role === 'Pro Trader'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            u.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            {u.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {formatMoney(u.balanceUSD)}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-600">
                          {u.trades} orders
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 font-medium">
                          {u.lastActive}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => updateUserStatus(u.id, u.status === 'Active' ? 'Suspended' : 'Active')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                              u.status === 'Active'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {u.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* SUB-TAB 4: SYSTEM BROADCAST TOOL */}
        {adminSubTab === 'broadcast' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card max-w-2xl mx-auto space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-brand-900 font-extrabold text-lg">
                <Megaphone className="w-5 h-5" />
                <h2>Live System Broadcast Dispatcher</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Send an immediate real-time announcement banner to all users browsing StockSense.
              </p>
            </div>

            {/* Broadcast Form */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 uppercase tracking-wider block mb-2">
                  Broadcast Message Content
                </label>
                <textarea
                  rows={3}
                  value={broadcastDraft}
                  onChange={(e) => setBroadcastDraft(e.target.value)}
                  placeholder="e.g. Market Holiday Tomorrow: US and Indian Exchanges closed on Monday."
                  className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-medium focus:border-brand-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">Banner Visibility</span>
                  <span className="text-[11px] text-slate-400">Toggle whether users can see this announcement banner</span>
                </div>
                <input
                  type="checkbox"
                  checked={broadcastActive}
                  onChange={(e) => setBroadcastActive(e.target.checked)}
                  className="w-5 h-5 accent-brand-900 rounded cursor-pointer"
                />
              </div>

              {/* Live Preview Card */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center">
                  <Radio className="w-3 h-3 mr-1 animate-pulse" /> Live Banner Preview
                </div>
                <div className="text-xs font-semibold text-blue-100">
                  {broadcastDraft || 'No broadcast text specified.'}
                </div>
              </div>

              <button
                onClick={handlePublishBroadcast}
                className="w-full touch-target py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-900/20 transition-all flex items-center justify-center space-x-2"
              >
                <Megaphone className="w-4 h-4" />
                <span>Publish Announcement Now</span>
              </button>

              {broadcastSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Broadcast updated! Active user screens are now displaying this banner.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUB-TAB 5: CLERK & SUPABASE INTEGRATION GUIDE */}
        {adminSubTab === 'integrations' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card max-w-4xl mx-auto space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-brand-navy font-extrabold text-xl">
                <Database className="w-6 h-6 text-brand-900" />
                <h2>Clerk Authentication & Supabase Database Wiring</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Your frontend is ready with commented TODO hooks. Follow these exact steps to connect your live accounts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Part A: Clerk */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 font-extrabold text-sm text-slate-900">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <span>Part A — Clerk Authentication</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 leading-relaxed font-medium">
                  <li>Go to <strong className="text-slate-800">clerk.com</strong> & create app "StockSense".</li>
                  <li>Copy Publishable Key into your <code className="bg-slate-200 px-1 py-0.5 rounded">.env.local</code>:
                    <div className="mt-1 p-2 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto">
                      VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
                    </div>
                  </li>
                  <li>In <code className="bg-slate-200 px-1 py-0.5 rounded">src/main.jsx</code>, wrap root with <code className="text-brand-900">&lt;ClerkProvider&gt;</code>.</li>
                  <li>Use <code className="text-brand-900">useUser()</code> in Navbar & Admin guard.</li>
                </ol>
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-xl border border-emerald-200 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Placeholder hooks already placed in code!</span>
                </div>
              </div>

              {/* Part B: Supabase */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 font-extrabold text-sm text-slate-900">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Part B — Supabase Database</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 leading-relaxed font-medium">
                  <li>Go to <strong className="text-slate-800">supabase.com</strong> & create "stocksense-db".</li>
                  <li>Add keys to your <code className="bg-slate-200 px-1 py-0.5 rounded">.env.local</code>:
                    <div className="mt-1 p-2 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto">
                      VITE_SUPABASE_URL=https://xyz.supabase.co<br/>
                      VITE_SUPABASE_ANON_KEY=eyJhbGci...
                    </div>
                  </li>
                  <li>Client helper configured at:
                    <code className="block mt-1 bg-white p-1.5 border border-slate-200 rounded font-mono text-[11px]">
                      src/lib/supabaseClient.js
                    </code>
                  </li>
                  <li>Create <code className="text-brand-900 font-bold">stocks</code> table with schema below!</li>
                </ol>
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-xl border border-emerald-200 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Client initialized and ready for keys</span>
                </div>
              </div>

            </div>

            {/* Supabase Starter SQL Schema */}
            <div className="space-y-2">
              <span className="font-extrabold text-xs text-slate-700 uppercase tracking-wider block">
                Starter SQL Script (Paste in Supabase SQL Editor)
              </span>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`-- Create Stocks Table in Supabase
CREATE TABLE IF NOT EXISTS public.stocks (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  exchange TEXT DEFAULT 'NASDAQ',
  price_usd NUMERIC NOT NULL,
  price_inr NUMERIC NOT NULL,
  change NUMERIC DEFAULT 0,
  change_percent NUMERIC DEFAULT 0,
  is_positive BOOLEAN DEFAULT true,
  traffic_light TEXT DEFAULT 'safe',
  traffic_light_label TEXT DEFAULT 'Good Buy / Safe',
  simple_verdict TEXT,
  pro_verdict TEXT,
  ai_score INTEGER DEFAULT 80,
  pe_ratio NUMERIC,
  market_cap TEXT,
  history JSONB
);

-- Insert sample initial rows
INSERT INTO public.stocks (id, symbol, name, price_usd, price_inr, traffic_light, ai_score, simple_verdict)
VALUES 
  ('aapl', 'AAPL', 'Apple Inc.', 232.80, 19671.60, 'safe', 88, 'Steady phone and service sales. Great low risk choice!'),
  ('nvda', 'NVDA', 'NVIDIA Corp', 134.50, 11365.25, 'safe', 92, 'World leader in AI hardware and data centers.');`}
              </pre>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
