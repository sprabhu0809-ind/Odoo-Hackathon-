import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STOCKS, MARKET_HEALTH_DATA, MOCK_ADMIN_USERS, MOCK_NEWS } from '../data/mockData';
import confetti from 'canvas-confetti';

// TODO: Replace with Clerk useUser() hook once auth is connected
// import { useUser } from '@clerk/clerk-react';

const StockContext = createContext(null);

export const StockProvider = ({ children }) => {
  // TODO: Replace mockStocks with Supabase `stocks` table fetch
  // Example: const { data: stocks, error } = await supabase.from('stocks').select('*');
  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem('stocksense_stocks');
    return saved ? JSON.parse(saved) : INITIAL_STOCKS;
  });

  const [selectedStockId, setSelectedStockId] = useState('aapl');
  const [mode, setMode] = useState('simple'); // 'simple' | 'pro'
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'INR'
  const [fontSizeMode, setFontSizeMode] = useState('normal'); // 'normal' | 'large' | 'xl'
  const [currentTab, setCurrentTab] = useState('user'); // 'user' | 'admin'
  const [adminSubTab, setAdminSubTab] = useState('analytics'); // 'analytics' | 'stocks' | 'users' | 'broadcast' | 'integrations'
  
  // Market Health state
  const [marketHealth, setMarketHealth] = useState(MARKET_HEALTH_DATA);

  // Admin users state
  // TODO: Replace mockUsers with Supabase `users` table fetch
  const [adminUsers, setAdminUsers] = useState(MOCK_ADMIN_USERS);

  // System Broadcast State
  // TODO: Replace broadcast with Supabase `broadcasts` realtime subscription
  const [systemBroadcast, setSystemBroadcast] = useState({
    id: 'broadcast-1',
    text: '📢 Notice: Markets are in a high-liquidity consolidation phase. AI Advisory buy ratings remain intact.',
    active: true,
    type: 'info'
  });

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
    return saved ? JSON.parse(saved) : ['aapl', 'nvda', 'reliance'];
  });

  // Audio Speech state
  const [speakingId, setSpeakingId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Buy Modal state
  const [buyModal, setBuyModal] = useState({ isOpen: false, stock: null });

  // Floating Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'AI Buy Signal Triggered', body: 'Apple (AAPL) reached 88% AI Buy Score with strong institutional inflow.', time: '10m ago', unread: true },
    { id: 2, title: 'Earnings Alert', body: 'NVIDIA quarterly cloud revenue projection revised upward +12%.', time: '1h ago', unread: true },
    { id: 3, title: 'Market Sentiment', body: 'StockSense Market Health Meter registers a comfortable 82/100.', time: '3h ago', unread: false }
  ]);

  // Selected stock object
  const selectedStock = stocks.find(s => s.id === selectedStockId) || stocks[0];

  // Real-time market ticker state
  const [isLiveTickerActive, setIsLiveTickerActive] = useState(true);
  const [priceFlashes, setPriceFlashes] = useState({});
  const [lastMarketUpdate, setLastMarketUpdate] = useState(() => new Date().toLocaleTimeString());

  // Real-Time Price Fluctuations Effect (Simulates live market trading activity)
  useEffect(() => {
    if (!isLiveTickerActive) return;

    const interval = setInterval(() => {
      // Pick 1 to 3 random stocks to fluctuate
      const count = Math.floor(Math.random() * 2) + 1;
      const targetIndices = new Set();
      while (targetIndices.size < count) {
        targetIndices.add(Math.floor(Math.random() * stocks.length));
      }

      const flashes = {};
      const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setStocks(prevStocks => {
        return prevStocks.map((stock, idx) => {
          if (!targetIndices.has(idx)) return stock;

          // Fluctuate price slightly (-0.35% to +0.35%)
          const deltaFactor = (Math.random() - 0.48) * 0.007;
          const oldPrice = stock.priceUSD;
          const deltaUSD = +(oldPrice * deltaFactor).toFixed(2);
          const newPriceUSD = Math.max(1, +(oldPrice + deltaUSD).toFixed(2));
          const isUp = newPriceUSD >= oldPrice;

          flashes[stock.id] = isUp ? 'up' : 'down';

          const newPriceINR = +(newPriceUSD * USD_TO_INR).toFixed(2);
          const newChange = +(stock.change + deltaUSD).toFixed(2);
          const newChangePercent = +(stock.changePercent + (deltaFactor * 100)).toFixed(2);

          // Update latest history datapoints in real-time
          const updatedHistory = { ...stock.history };
          if (updatedHistory['1D'] && updatedHistory['1D'].length > 0) {
            const series1D = [...updatedHistory['1D']];
            const lastPoint = { ...series1D[series1D.length - 1] };
            lastPoint.price = newPriceUSD;
            lastPoint.close = newPriceUSD;
            if (newPriceUSD > lastPoint.high) lastPoint.high = newPriceUSD;
            if (newPriceUSD < lastPoint.low) lastPoint.low = newPriceUSD;
            series1D[series1D.length - 1] = lastPoint;
            updatedHistory['1D'] = series1D;
          }

          // Update sparkline latest value
          const updatedSparkline = [...stock.sparkline];
          updatedSparkline[updatedSparkline.length - 1] = newPriceUSD;

          return {
            ...stock,
            priceUSD: newPriceUSD,
            priceINR: newPriceINR,
            change: newChange,
            changePercent: newChangePercent,
            isPositive: newChange >= 0,
            sparkline: updatedSparkline,
            history: updatedHistory,
            lastTickTime: currentTimeStr
          };
        });
      });

      setPriceFlashes(flashes);
      setLastMarketUpdate(currentTimeStr);

      // Clear flashes after 900ms
      const flashTimeout = setTimeout(() => {
        setPriceFlashes({});
      }, 900);

      return () => clearTimeout(flashTimeout);
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveTickerActive, stocks.length]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('stocksense_stocks', JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem('stocksense_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('stocksense_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // USD to INR conversion rate
  const USD_TO_INR = 84.50;

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
    if (currency === 'INR') {
      return '₹' + stock.priceINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return '$' + stock.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Speech synthesis integration for Voice & Audio Mode
  const speakText = (text, id) => {
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

    window.speechSynthesis.cancel(); // Stop any currently playing audio

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Friendly, clear pacing
    utterance.pitch = 1.0;

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

    // Deduct cash
    const updatedCash = +(portfolio.cashUSD - totalCostUSD).toFixed(2);

    // Update holdings
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

    // Record transaction
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

    // Trigger celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Fallback
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

  // ADMIN ACTIONS
  const updateStock = (stockId, fields) => {
    setStocks(prev => prev.map(s => {
      if (s.id === stockId) {
        const updated = { ...s, ...fields };
        // Recalculate INR if priceUSD changed
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
      changePercent: newStock.changePercent || 0,
      change: newStock.change || 0,
      isPositive: (newStock.change || 0) >= 0,
      sparkline: [newStock.priceUSD * 0.95, newStock.priceUSD * 0.97, newStock.priceUSD * 0.98, newStock.priceUSD, newStock.priceUSD],
      history: {
        '1D': [{ time: 'Open', price: newStock.priceUSD * 0.98 }, { time: 'Close', price: newStock.priceUSD }],
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
  };

  const updateUserStatus = (userId, status) => {
    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  // Font size multiplier class helper
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
        updateBroadcast,
        portfolio,
        favorites,
        toggleFavorite,
        speakingId,
        isSpeaking,
        speakText,
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
