import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStock } from '../context/StockContext';
import { AppIconBadge } from './AppIconBadge';
import {
  TrendingUp,
  Search,
  Mic,
  MicOff,
  Bell,
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  ChevronDown,
  Layers,
  CheckCircle2,
  DollarSign,
  Type,
  X,
  Radio,
  Volume2,
  Megaphone,
  User
} from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const {
    stocks,
    selectedStockId,
    setSelectedStockId,
    mode,
    toggleMode,
    currency,
    toggleCurrency,
    fontSizeMode,
    setFontSizeMode,
    currentTab,
    setCurrentTab,
    portfolio,
    formatMoney,
    notifications,
    speakText,
    isSpeaking,
    isLiveTickerActive,
    toggleLiveTicker,
    language,
    setLanguage,
    isLiveAnnouncerActive,
    toggleLiveAnnouncer,
    SUPPORTED_LANGUAGES,
    lastMarketUpdate
  } = useStock();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const searchRef = useRef(null);

  // Filter stocks for search
  const filteredStocks = searchQuery.trim() === ''
    ? []
    : stocks.filter(s =>
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sector.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Voice Search Handler (uses SpeechRecognition if available, or voice audio feedback)
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-IN';
      recognition.start();
      setIsVoiceListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsSearchOpen(true);
        setIsVoiceListening(false);
        // Find matching stock
        const match = stocks.find(s =>
          s.symbol.toLowerCase() === transcript.toLowerCase() ||
          s.name.toLowerCase().includes(transcript.toLowerCase())
        );
        if (match) {
          setSelectedStockId(match.id);
        }
      };

      recognition.onerror = () => {
        setIsVoiceListening(false);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };
    } else {
      // Mock Voice Search prompt
      setIsVoiceListening(true);
      const promptText = language === 'hi'
        ? "वॉयस सर्च तैयार है। किसी शेयर का नाम बोलें।"
        : language === 'ta'
        ? "குரல் தேடல் தயார். ஒரு பங்கின் பெயரை சொல்லுங்கள்."
        : "Voice search ready. Say a stock name like Apple, Tesla, or Reliance.";
      speakText(promptText, "voice-search-prompt", language);
      setTimeout(() => {
        setIsVoiceListening(false);
        setSearchQuery('AAPL');
        setIsSearchOpen(true);
      }, 2500);
    }
  };

  const handleSelectStock = (id) => {
    setSelectedStockId(id);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // Font size toggle cycle: normal -> large -> xl -> normal
  const cycleFontSize = () => {
    if (fontSizeMode === 'normal') setFontSizeMode('large');
    else if (fontSizeMode === 'large') setFontSizeMode('xl');
    else setFontSizeMode('normal');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-900 rounded-xl p-1"
              aria-label="StockSense Home"
            >
              <AppIconBadge icon={TrendingUp} variant="brand" size="md" />
              <div className="text-left">
                <div className="flex items-center space-x-1.5">
                  <span className="font-display font-extrabold text-2xl tracking-tight text-brand-navy">
                    Stock<span className="text-brand-900">Sense</span>
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Sparkles className="w-3 h-3 mr-0.5 text-amber-600 fill-amber-500" />
                    AI
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${isLiveTickerActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
                  <span className="text-[10px] font-extrabold tracking-wide text-emerald-700 uppercase">
                    {isLiveTickerActive ? 'Live Market' : 'Paused'}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">• {lastMarketUpdate}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar with Voice Search */}
          <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search stocks (e.g. Apple, TSLA, Reliance)..."
                className="w-full pl-10 pr-12 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 text-sm font-medium rounded-2xl border border-slate-200 focus:border-brand-900 focus:ring-4 focus:ring-brand-900/10 transition-all touch-target"
                aria-label="Search stocks"
              />
              <button
                onClick={handleVoiceSearch}
                title="Voice Search (Speak stock name)"
                className={`absolute inset-y-1.5 right-1.5 px-3 rounded-xl flex items-center justify-center transition-all ${
                  isVoiceListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-200/70 hover:bg-slate-300/80 text-slate-700'
                }`}
                aria-label="Voice search"
              >
                {isVoiceListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-brand-900" />}
              </button>

              {/* Autocomplete Dropdown */}
              {isSearchOpen && filteredStocks.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
                    Matching Stocks ({filteredStocks.length})
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {filteredStocks.map((stk) => (
                      <button
                        key={stk.id}
                        onClick={() => handleSelectStock(stk.id)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between transition-colors touch-target"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{stk.emoji}</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900">{stk.symbol}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                stk.trafficLight === 'safe'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : stk.trafficLight === 'hold'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {stk.trafficLightIcon} {stk.trafficLightLabel}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">{stk.name}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">
                            {currency === 'INR' ? `₹${stk.priceINR.toLocaleString('en-IN')}` : `$${stk.priceUSD.toFixed(2)}`}
                          </div>
                          <span className={`text-xs font-semibold ${stk.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {stk.isPositive ? '+' : ''}{stk.changePercent}%
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Mode Toggle, Currency, Font Scale, Notifications & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Simple / Pro Mode Toggle Button */}
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center shadow-inner">
              <button
                onClick={() => toggleMode()}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all touch-target ${
                  mode === 'simple'
                    ? 'bg-white text-brand-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Simple Mode: Plain English, easy terms, traffic lights"
              >
                <span>🌱</span>
                <span>Simple</span>
              </button>
              <button
                onClick={() => toggleMode()}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all touch-target ${
                  mode === 'pro'
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Pro Mode: Candlesticks, P/E ratio, RSI, order metrics"
              >
                <span>⚡</span>
                <span>Pro</span>
              </button>
            </div>

            {/* LIVE MARKET ANNOUNCER (TRAIN-STATION PA CHIME + PERIODIC VOICE) */}
            <button
              onClick={toggleLiveAnnouncer}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all touch-target ${
                isLiveAnnouncerActive
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Station PA Announcer: plays chime and speaks live price updates every 25s"
            >
              <Radio className={`w-3.5 h-3.5 ${isLiveAnnouncerActive ? 'text-amber-600 animate-pulse' : 'text-slate-500'}`} />
              <span className="hidden xl:inline">{isLiveAnnouncerActive ? 'PA Active' : 'Live PA'}</span>
            </button>

            {/* Currency Toggle ($ / ₹) */}
            <button
              onClick={toggleCurrency}
              className="flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm border border-slate-200 transition-colors touch-target"
              title={`Switch currency between USD and INR (Current: ${currency})`}
              aria-label="Toggle currency"
            >
              <span className="font-extrabold">{currency === 'USD' ? '$' : '₹'}</span>
              <span className="hidden sm:inline">{currency}</span>
            </button>

            {/* Accessibility Font Size Scaler */}
            <button
              onClick={cycleFontSize}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors touch-target flex items-center justify-center"
              title={`Accessibility Font Size: ${fontSizeMode.toUpperCase()} (Click to cycle)`}
              aria-label="Adjust font size"
            >
              <Type className="w-4 h-4" />
              <span className="text-[10px] font-black ml-0.5">
                {fontSizeMode === 'normal' ? 'A' : fontSizeMode === 'large' ? 'A+' : 'A++'}
              </span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(prev => !prev)}
                className="relative p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors touch-target flex items-center justify-center"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white ring-1 ring-rose-300"></span>
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center">
                      <Bell className="w-4 h-4 mr-1.5 text-brand-900" /> Notifications & Alerts
                    </h3>
                    <button
                      onClick={() => setIsNotifOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border transition-all ${
                          n.unread ? 'bg-blue-50/60 border-blue-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Marketer & Admin Navigation */}
            <Link
              to="/marketer"
              className="flex items-center space-x-1 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Marketer Dashboard"
            >
              <Megaphone className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden xl:inline">Marketer</span>
            </Link>

            <Link
              to="/admin"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-300 transition-all touch-target"
              title="Admin Command Center"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            <Link
              to="/login"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Switch Role / Logout"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* User Avatar & Simulated Wallet */}
            <div className="hidden lg:flex items-center space-x-2.5 pl-2 border-l border-slate-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-900 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-blue-100">
                AP
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-500">Simulated Cash</div>
                <div className="text-sm font-extrabold text-brand-900">
                  {formatMoney(portfolio.cashUSD)}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
