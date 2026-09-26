// TODO: This interval-based tick loop simulates real-time prices for the demo.
// Once a real data source is connected (Supabase Realtime channel, or a live
// market-data API), replace the setInterval nudge logic with a subscription
// that pushes real price updates into this same PriceContext shape.

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_STOCKS, MARKET_HEALTH_DATA, MOCK_ADMIN_USERS, MOCK_NEWS, MOCK_BROADCASTS } from '../data/mockData';
import confetti from 'canvas-confetti';
import {
  playTrainStationChime,
  getStockAdvicePhrase,
  getTrainStationAnnouncement,
  getLivePriceVoicePrompt,
  SUPPORTED_LANGUAGES
} from '../lib/audioAnnouncer';

// TODO: Replace with Clerk useUser() hook once auth is connected
// import { useUser } from '@clerk/clerk-react';

const StockContext = createContext(null);

export const StockProvider = ({ children }) => {
  // USD to INR conversion rate
  const USD_TO_INR = 84.50;

  // Multilingual State: 'en' | 'hi' | 'ta'
  const [language, setLanguageState] = useState(() => {
    return sessionStorage.getItem('stocksense_lang') || 'en';
  });

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    sessionStorage.setItem('stocksense_lang', langCode);
  };

  // Train-station PA Announcer mode toggle
  const [isLiveAnnouncerActive, setIsLiveAnnouncerActive] = useState(false);
  const announcerIndexRef = useRef(0);

  // Initialize stocks with dayOpenPrice and momentum state
  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem('stocksense_stocks_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved stocks", e);
      }
    }
    return INITIAL_STOCKS.map(s => ({
      ...s,
      dayOpenPrice: +(s.priceUSD / (1 + (s.changePercent || 0) / 100)).toFixed(2),
      momentum: {
        trend: s.isPositive ? 'up' : 'down',
        remainingTicks: Math.floor(Math.random() * 12) + 8
      }
    }));
  });

  const [selectedStockId, setSelectedStockId] = useState('aapl');
  const [mode, setMode] = useState('simple'); // 'simple' | 'pro'
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'INR'
  const [fontSizeMode, setFontSizeMode] = useState('normal'); // 'normal' | 'large' | 'xl'
  const [currentTab, setCurrentTab] = useState('user'); // 'user' | 'admin'
  const [adminSubTab, setAdminSubTab] = useState('analytics'); // 'analytics' | 'stocks' | 'users' | 'broadcast' | 'integrations'

  // Admin users state
  // TODO: Replace mockUsers with Supabase `users` table fetch
  const [adminUsers, setAdminUsers] = useState(MOCK_ADMIN_USERS);

  // System Broadcast State
  // TODO: Replace broadcast with Supabase `broadcasts` realtime subscription
  const [systemBroadcast, setSystemBroadcast] = useState(MOCK_BROADCASTS[0]);
  const [allBroadcasts, setAllBroadcasts] = useState(MOCK_BROADCASTS);

  // User simulated portfolio state
  // TODO: Replace userPortfolio with Supabase `portfolios` and `transactions` tables linked to Clerk userId
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('stocksense_portfolio');
    return saved ? JSON.parse(saved) : {
      cashUSD: 10450.00,
      holdings: [
        { stockId: 'aapl', symbol: 'AAPL', name: 'Apple Inc.', shares: 5, avgPriceUSD: 218.40, totalCostUSD: 1092.00 },
        { stockId: 'reliance', symbol: 'RELIANCE', name: 'Reliance Industries', shares: 12, avgPriceUSD: 33.50, totalCostUSD: 402.00 }
      ],
      transactions: [
        { id: 'tx-1', type: 'BUY', symbol: 'AAPL', shares: 5, price: 218.40, total: 1092.00, date: 'Yesterday' },
        { id: 'tx-2', type: 'BUY', symbol: 'RELIANCE', shares: 12, price: 33.50, total: 402.00, date: '3 days ago' },
      ]
    };
  });

  // Starred favorites
  // TODO: Replace with Supabase `favorites` table
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('stocksense_favorites');
    return saved ? JSON.parse(saved) : ['aapl', 'nvda', 'reliance', 'msft'];
  });

  // Audio Speech state
  const [speakingId, setSpeakingId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Buy Modal state
  const [buyModal, setBuyModal] = useState({ isOpen: false, stock: null });

  // Floating Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Real-time market ticker & visual flash state
  const [isLiveTickerActive, setIsLiveTickerActive] = useState(true);
  const [priceFlashes, setPriceFlashes] = useState({});
  const [lastMarketUpdate, setLastMarketUpdate] = useState(() => new Date().toLocaleTimeString());

  // Dynamic Market Health state (calculated live from stock breadth)
  const [marketHealth, setMarketHealth] = useState(MARKET_HEALTH_DATA);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'AI Buy Signal Triggered', body: 'Apple (AAPL) reached 88% AI Buy Score with strong institutional inflow.', time: '10m ago', unread: true },
    { id: 2, title: 'Earnings Alert', body: 'NVIDIA quarterly cloud revenue projection revised upward +12%.', time: '1h ago', unread: true },
    { id: 3, title: 'Market Sentiment', body: 'StockSense Market Health Meter registers a comfortable safe rating.', time: '3h ago', unread: false }
  ]);

  // Selected stock object (always points to the latest live state)
  const selectedStock = stocks.find(s => s.id === selectedStockId) || stocks[0];

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('stocksense_stocks_v2', JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem('stocksense_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('stocksense_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Format currency helper
  const formatMoney = (amountUSD, customCurrency = null) => {
    const curr = customCurrency || currency;
    if (curr === 'INR') {
      const val = amountUSD * USD_TO_INR;
      return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return '$' + amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Convert raw value to display format
  const formatStockPrice = (stock) => {
    if (!stock) return '$0.00';
    if (currency === 'INR') {
      return '₹' + stock.priceINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return '$' + stock.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // =========================================================================
  // REAL-TIME PRICE ENGINE (TICK LOOP WITH MOMENTUM & LIVE ROLLING HISTORY)
  // =========================================================================
  useEffect(() => {
    if (!isLiveTickerActive) return;

    const interval = setInterval(() => {
      const flashes = {};
      const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setStocks(prevStocks => {
        let greenCount = 0;

        const updatedStocks = prevStocks.map(stock => {
          // Momentum state update: direction bias for realistic runs
          let momentum = stock.momentum || {
            trend: stock.isPositive ? 'up' : 'down',
            remainingTicks: Math.floor(Math.random() * 10) + 5
          };

          let remainingTicks = momentum.remainingTicks - 1;
          let trend = momentum.trend;

          if (remainingTicks <= 0) {
            // Flip trend or pick new momentum direction
            trend = Math.random() > 0.45 ? 'up' : 'down';
            remainingTicks = Math.floor(Math.random() * 14) + 6; // 6 to 20 ticks
          }

          // Random percentage nudge (±0.05% to ±0.35%) with momentum bias
          const baseDelta = (Math.random() * 0.0028) + 0.0004;
          const deltaFactor = trend === 'up' ? +baseDelta : -baseDelta;

          const oldPrice = stock.priceUSD;
          const deltaUSD = +(oldPrice * deltaFactor).toFixed(2);
          const newPriceUSD = Math.max(1, +(oldPrice + deltaUSD).toFixed(2));
          const isUp = newPriceUSD >= oldPrice;

          flashes[stock.id] = isUp ? 'up' : 'down';

          const dayOpen = stock.dayOpenPrice || oldPrice;
          const newChange = +(newPriceUSD - dayOpen).toFixed(2);
          const newChangePercent = +(((newPriceUSD - dayOpen) / dayOpen) * 100).toFixed(2);
          const isPositive = newChange >= 0;

          if (isPositive) greenCount++;

          const newPriceINR = +(newPriceUSD * USD_TO_INR).toFixed(2);

          // Update rolling history array for 1D chart (drop oldest if > 30 so chart streams smoothly!)
          const updatedHistory = { ...stock.history };
          if (updatedHistory['1D'] && updatedHistory['1D'].length > 0) {
            const series1D = [...updatedHistory['1D']];
            const lastIdx = series1D.length - 1;
            const updatedLast = {
              ...series1D[lastIdx],
              price: newPriceUSD,
              close: newPriceUSD,
              high: Math.max(series1D[lastIdx].high || newPriceUSD, newPriceUSD),
              low: Math.min(series1D[lastIdx].low || newPriceUSD, newPriceUSD),
              volume: (series1D[lastIdx].volume || 2000000) + Math.floor(Math.random() * 50000)
            };
            series1D[lastIdx] = updatedLast;
            updatedHistory['1D'] = series1D;
          }

          // Update sparkline latest point
          const updatedSparkline = [...stock.sparkline];
          updatedSparkline[updatedSparkline.length - 1] = newPriceUSD;

          return {
            ...stock,
            priceUSD: newPriceUSD,
            priceINR: newPriceINR,
            change: newChange,
            changePercent: newChangePercent,
            isPositive,
            sparkline: updatedSparkline,
            history: updatedHistory,
            lastTickTime: currentTimeStr,
            momentum: { trend, remainingTicks }
          };
        });

        // Live Market Health Meter Recalculation based on current breadth
        const greenRatio = updatedStocks.length > 0 ? greenCount / updatedStocks.length : 0.7;
        const dynamicScore = Math.round(35 + (greenRatio * 60)); // Ranges ~45 to 95
        const dynamicState = dynamicScore >= 70 ? 'safe' : dynamicScore >= 50 ? 'caution' : 'risk';
        const dynamicStatus = dynamicState === 'safe'
          ? 'Market is Safe Today'
          : dynamicState === 'caution'
          ? 'Market is Cautious / Neutral'
          : 'Market is Risky / Volatile';

        setMarketHealth(prev => ({
          ...prev,
          score: dynamicScore,
          state: dynamicState,
          status: dynamicStatus
        }));

        return updatedStocks;
      });

      setPriceFlashes(flashes);
      setLastMarketUpdate(currentTimeStr);

      // Fade out flash after 850ms
      const flashTimeout = setTimeout(() => {
        setPriceFlashes({});
      }, 850);

      return () => clearTimeout(flashTimeout);
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveTickerActive, USD_TO_INR]);

  // =========================================================================
  // MULTILINGUAL VOICE & AUDIO MODE (ACTUALLY SPEAKS IN EN / HI / TA)
  // =========================================================================
  const speakStockAdvice = (stockOrId, customLang = null) => {
    const stock = typeof stockOrId === 'string'
      ? stocks.find(s => s.id === stockOrId)
      : stockOrId;

    if (!stock) return;

    const activeLang = customLang || language;
    const textToSpeak = getStockAdvicePhrase(stock, activeLang, currency);
    speakText(textToSpeak, `stock-${stock.id}`, activeLang);
  };

  // Speaks the concise live current price and percentage change in English, Hindi, or Tamil
  const speakLivePriceVoicePrompt = (stockOrId, lang = 'en') => {
    const stock = typeof stockOrId === 'string'
      ? stocks.find(s => s.id === stockOrId)
      : stockOrId;

    if (!stock) return;

    const textToSpeak = getLivePriceVoicePrompt(stock, lang, currency);
    speakText(textToSpeak, `live-price-${stock.id}-${lang}`, lang);
  };

  const speakText = (text, id, customLang = null) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      alert("Voice speech audio: " + text);
      return;
    }

    if (speakingId === id && isSpeaking) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any previous speech

    const activeLang = customLang || language;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Set correct language code
    if (activeLang === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (activeLang === 'ta') {
      utterance.lang = 'ta-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    // Match browser voice if available
    try {
      const voices = window.speechSynthesis.getVoices();
      const matched = voices.find(v => v.lang.toLowerCase().startsWith(activeLang));
      if (matched) {
        utterance.voice = matched;
      }
    } catch {
      // Fallback to default voice
    }

    utterance.onstart = () => {
      setSpeakingId(id);
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setSpeakingId(null);
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeakingId(null);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // "Train-Station Announcer" Mode (every ~24s when active)
  useEffect(() => {
    if (!isLiveAnnouncerActive || stocks.length === 0) return;

    const interval = setInterval(() => {
      // Pick top movers or cycling stocks
      const moverCandidates = stocks.filter(s => Math.abs(s.changePercent) > 0.4);
      const pool = moverCandidates.length > 0 ? moverCandidates : stocks;
      const targetStock = pool[announcerIndexRef.current % pool.length];
      announcerIndexRef.current += 1;

      // 1. Play soft realistic PA chime first
      playTrainStationChime();

      // 2. Speak announcement line after chime finishes
      setTimeout(() => {
        const line = getTrainStationAnnouncement(targetStock, language, currency);
        speakText(line, `announcer-${targetStock.id}`, language);
      }, 600);
    }, 24000);

    return () => clearInterval(interval);
  }, [isLiveAnnouncerActive, stocks, language, currency]);

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setIsSpeaking(false);
  };

  // Toggle favorite
  const toggleFavorite = (stockId) => {
    setFavorites(prev => {
      if (prev.includes(stockId)) {
        return prev.filter(id => id !== stockId);
      } else {
        return [...prev, stockId];
      }
    });
  };

  // Open Buy Modal
  const openBuyModal = (stock = null) => {
    setBuyModal({ isOpen: true, stock: stock || selectedStock });
  };

  const closeBuyModal = () => {
    setBuyModal({ isOpen: false, stock: null });
  };

  // Execute Simulated Buy
  const executeBuy = (stock, shares, totalCostUSD) => {
    if (portfolio.cashUSD < totalCostUSD) {
      alert("Insufficient simulated balance! Please adjust order size.");
      return false;
    }

    const updatedCash = +(portfolio.cashUSD - totalCostUSD).toFixed(2);
    const existingIndex = portfolio.holdings.findIndex(h => h.stockId === stock.id);
    let updatedHoldings = [...portfolio.holdings];

    if (existingIndex >= 0) {
      const existing = updatedHoldings[existingIndex];
      const newShares = +(existing.shares + shares).toFixed(4);
      const newTotalCost = +(existing.totalCostUSD + totalCostUSD).toFixed(2);
      const newAvgPrice = +(newTotalCost / newShares).toFixed(2);
      updatedHoldings[existingIndex] = {
        ...existing,
        shares: newShares,
        totalCostUSD: newTotalCost,
        avgPriceUSD: newAvgPrice
      };
    } else {
      updatedHoldings.push({
        stockId: stock.id,
        symbol: stock.symbol,
        name: stock.name,
        shares: +shares.toFixed(4),
        avgPriceUSD: stock.priceUSD,
        totalCostUSD: totalCostUSD
      });
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'BUY',
      symbol: stock.symbol,
      shares: +shares.toFixed(4),
      price: stock.priceUSD,
      total: totalCostUSD,
      date: 'Just now'
    };

    setPortfolio({
      cashUSD: updatedCash,
      holdings: updatedHoldings,
      transactions: [newTx, ...portfolio.transactions]
    });

    try {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Confetti fallback
    }

    return true;
  };

  // Execute Simulated Sell
  const executeSell = (stockId, sharesToSell) => {
    const holding = portfolio.holdings.find(h => h.stockId === stockId);
    if (!holding || holding.shares < sharesToSell) {
      alert("You do not own enough shares to complete this sale.");
      return false;
    }

    const stock = stocks.find(s => s.id === stockId) || { priceUSD: holding.avgPriceUSD, symbol: holding.symbol };
    const proceedsUSD = +(sharesToSell * stock.priceUSD).toFixed(2);
    const updatedCash = +(portfolio.cashUSD + proceedsUSD).toFixed(2);

    let updatedHoldings = [];
    if (holding.shares === sharesToSell) {
      updatedHoldings = portfolio.holdings.filter(h => h.stockId !== stockId);
    } else {
      updatedHoldings = portfolio.holdings.map(h => {
        if (h.stockId === stockId) {
          const remainingShares = +(h.shares - sharesToSell).toFixed(4);
          const remainingCost = +(h.totalCostUSD * (remainingShares / h.shares)).toFixed(2);
          return {
            ...h,
            shares: remainingShares,
            totalCostUSD: remainingCost
          };
        }
        return h;
      });
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'SELL',
      symbol: holding.symbol,
      shares: +sharesToSell.toFixed(4),
      price: stock.priceUSD,
      total: proceedsUSD,
      date: 'Just now'
    };

    setPortfolio({
      cashUSD: updatedCash,
      holdings: updatedHoldings,
      transactions: [newTx, ...portfolio.transactions]
    });

    return true;
  };

  // Admin Actions
  const updateStock = (stockId, fields) => {
    setStocks(prev => prev.map(s => {
      if (s.id === stockId) {
        const updated = { ...s, ...fields };
        if (fields.priceUSD && !fields.priceINR) {
          updated.priceINR = +(fields.priceUSD * USD_TO_INR).toFixed(2);
        }
        return updated;
      }
      return s;
    }));
  };

  const addStock = (newStock) => {
    const id = newStock.symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
    const priceINR = newStock.priceINR || +(newStock.priceUSD * USD_TO_INR).toFixed(2);
    const formatted = {
      ...newStock,
      id,
      priceINR,
      dayOpenPrice: newStock.priceUSD,
      changePercent: newStock.changePercent || 0,
      change: newStock.change || 0,
      isPositive: (newStock.change || 0) >= 0,
      momentum: { trend: 'up', remainingTicks: 12 },
      sparkline: [newStock.priceUSD * 0.95, newStock.priceUSD * 0.97, newStock.priceUSD * 0.98, newStock.priceUSD, newStock.priceUSD],
      history: {
        '1D': [{ time: '9:30 AM', price: newStock.priceUSD * 0.98 }, { time: 'Now', price: newStock.priceUSD }],
        '1W': [{ time: 'Mon', price: newStock.priceUSD * 0.95 }, { time: 'Now', price: newStock.priceUSD }],
        '1M': [{ time: 'W1', price: newStock.priceUSD * 0.92 }, { time: 'Now', price: newStock.priceUSD }],
        '1Y': [{ time: 'Start', price: newStock.priceUSD * 0.8 }, { time: 'Now', price: newStock.priceUSD }],
        'ALL': [{ time: '2022', price: newStock.priceUSD * 0.7 }, { time: 'Now', price: newStock.priceUSD }],
      }
    };
    setStocks(prev => [formatted, ...prev]);
  };

  const deleteStock = (stockId) => {
    setStocks(prev => prev.filter(s => s.id !== stockId));
    if (selectedStockId === stockId) {
      setSelectedStockId(stocks[0]?.id || 'aapl');
    }
  };

  const setFeaturedAiStock = (stockId) => {
    setStocks(prev => prev.map(s => ({
      ...s,
      isFeaturedAiPick: s.id === stockId
    })));
  };

  const updateBroadcast = (broadcast) => {
    setSystemBroadcast(broadcast);
    setAllBroadcasts(prev => [broadcast, ...prev.filter(b => b.id !== broadcast.id)]);
  };

  const updateUserStatus = (userId, status) => {
    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  const getFontSizeClass = () => {
    if (fontSizeMode === 'large') return 'text-lg';
    if (fontSizeMode === 'xl') return 'text-xl';
    return 'text-base';
  };

  return (
    <StockContext.Provider
      value={{
        stocks,
        selectedStock,
        selectedStockId,
        setSelectedStockId,
        mode,
        setMode,
        toggleMode: () => setMode(m => m === 'simple' ? 'pro' : 'simple'),
        currency,
        setCurrency,
        toggleCurrency: () => setCurrency(c => c === 'USD' ? 'INR' : 'USD'),
        fontSizeMode,
        setFontSizeMode,
        getFontSizeClass,
        currentTab,
        setCurrentTab,
        adminSubTab,
        setAdminSubTab,
        marketHealth,
        setMarketHealth,
        adminUsers,
        updateUserStatus,
        systemBroadcast,
        allBroadcasts,
        updateBroadcast,
        portfolio,
        favorites,
        toggleFavorite,
        speakingId,
        isSpeaking,
        speakText,
        speakStockAdvice,
        speakLivePriceVoicePrompt,
        stopSpeaking,
        buyModal,
        openBuyModal,
        closeBuyModal,
        executeBuy,
        executeSell,
        updateStock,
        addStock,
        deleteStock,
        setFeaturedAiStock,
        formatMoney,
        formatStockPrice,
        notifications,
        isChatOpen,
        setIsChatOpen,
        toggleChatbot: () => setIsChatOpen(o => !o),
        isLiveTickerActive,
        toggleLiveTicker: () => setIsLiveTickerActive(a => !a),
        language,
        setLanguage,
        isLiveAnnouncerActive,
        setIsLiveAnnouncerActive,
        toggleLiveAnnouncer: () => setIsLiveAnnouncerActive(a => !a),
        SUPPORTED_LANGUAGES,
        priceFlashes,
        lastMarketUpdate
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
