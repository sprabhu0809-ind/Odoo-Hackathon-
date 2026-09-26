// Mock Data for StockSense AI Stock Tracker & Advisory
// TODO: Replace mockStocks with Supabase `stocks` table fetch
// TODO: Replace mockUsers with Supabase `users` table fetch
// TODO: Replace mockNews with Supabase `news` table fetch

// Generate chart history points for different timeframes
const generateHistory = (basePrice, trend = 'up', volatility = 0.02) => {
  const timeframes = {
    '1D': 12, // hourly
    '1W': 7,  // daily
    '1M': 30, // daily
    '1Y': 12, // monthly
    'ALL': 24 // bi-monthly
  };

  const labels = {
    '1D': ['9:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '1:30 PM', '2:30 PM', '3:30 PM', '4:00 PM'],
    '1W': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
    '1M': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    '1Y': ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Now'],
    'ALL': ['2020', '2021', '2022', '2023', '2024', '2025', '2026']
  };

  const data = {};

  Object.entries(timeframes).forEach(([tf, points]) => {
    let currentPrice = basePrice * (trend === 'up' ? 0.92 : 1.08);
    const series = [];
    const labelSet = labels[tf];

    for (let i = 0; i < points; i++) {
      const deltaPercent = (Math.random() - (trend === 'up' ? 0.42 : 0.58)) * volatility;
      currentPrice = +(currentPrice * (1 + deltaPercent)).toFixed(2);
      
      const high = +(currentPrice * (1 + Math.random() * 0.015)).toFixed(2);
      const low = +(currentPrice * (1 - Math.random() * 0.015)).toFixed(2);
      const open = +(low + Math.random() * (high - low)).toFixed(2);
      const volume = Math.floor(1000000 + Math.random() * 5000000);
      const sma20 = +(currentPrice * 0.99).toFixed(2);
      const rsi = Math.floor(40 + Math.random() * 35);

      const label = labelSet[i % labelSet.length] + (points > labelSet.length ? ` #${Math.floor(i / labelSet.length) + 1}` : '');

      series.push({
        time: label,
        price: currentPrice,
        open,
        high,
        low,
        close: currentPrice,
        volume,
        sma20,
        rsi
      });
    }

    // Ensure the last point matches the basePrice
    series[series.length - 1].price = basePrice;
    series[series.length - 1].close = basePrice;

    data[tf] = series;
  });

  return data;
};

export const INITIAL_STOCKS = [
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceUSD: 232.80,
    priceINR: 19671.60,
    change: +4.25,
    changePercent: +1.86,
    isPositive: true,
    trafficLight: 'safe', // 'safe' | 'hold' | 'risk'
    trafficLightLabel: 'Good Buy / Safe',
    trafficLightIcon: '🟢',
    simpleVerdict: 'Apple has enormous cash reserves and steady global phone & service sales. Great low-risk choice for beginner investors!',
    proVerdict: 'Bullish continuation pattern. Consolidating above 20-day SMA ($228.40) with RSI at 58.6 indicating steady accumulation without overbought exhaustion.',
    aiScore: 88,
    aiConfidence: 'Very High (94%)',
    isFeaturedAiPick: true,
    peRatio: 33.8,
    marketCap: '$3.52 Trillion',
    high52: 237.23,
    low52: 164.08,
    volume: '52.4M',
    avgVolume: '48.9M',
    rsi: 58.6,
    beta: 1.08,
    dividendYield: '0.43%',
    sector: 'Consumer Technology',
    country: 'USA',
    emoji: '🍎',
    sparkline: [222, 224, 226, 223, 228, 230, 232.8],
    audioSummary: 'Apple Inc. is rated a Good Buy with an 88% AI score. High cash reserves and record services revenue make this a safe, steady pick for long-term growth.',
    history: generateHistory(232.80, 'up', 0.015),
  },
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceUSD: 134.50,
    priceINR: 11365.25,
    change: +5.80,
    changePercent: +4.51,
    isPositive: true,
    trafficLight: 'safe',
    trafficLightLabel: 'Good Buy / Safe',
    trafficLightIcon: '🟢',
    simpleVerdict: 'The world leader in AI chips. Everyone building AI needs their hardware. High growth, highly recommended for growing your wealth.',
    proVerdict: 'Strong momentum breakout with volume expanding 18% above 30-day average. Data center gross margins hold above 75%. Next technical resistance at $142.00.',
    aiScore: 92,
    aiConfidence: 'High (89%)',
    isFeaturedAiPick: false,
    peRatio: 48.2,
    marketCap: '$3.30 Trillion',
    high52: 140.76,
    low52: 45.11,
    volume: '78.1M',
    avgVolume: '62.5M',
    rsi: 66.2,
    beta: 1.68,
    dividendYield: '0.03%',
    sector: 'Semiconductors & AI',
    country: 'USA',
    emoji: '🤖',
    sparkline: [122, 125, 124, 128, 130, 131, 134.5],
    audioSummary: 'NVIDIA is rated a Good Buy with a 92% AI score. Unrivaled demand for Blackwell AI chips continues to fuel revenue expansion across cloud data centers.',
    history: generateHistory(134.50, 'up', 0.025),
  },
  {
    id: 'reliance',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    exchange: 'NSE',
    currency: 'INR',
    priceUSD: 35.20,
    priceINR: 2974.40,
    change: +38.60,
    changePercent: +1.31,
    isPositive: true,
    trafficLight: 'safe',
    trafficLightLabel: 'Good Buy / Safe',
    trafficLightIcon: '🟢',
    simpleVerdict: 'India’s largest conglomerate covering telecom (Jio), retail, and energy. Very safe, foundational blue-chip stock for Indian markets.',
    proVerdict: 'Holding firmly above key support level at ₹2,920. Jio 5G monetisation and retail margin expansion provide strong fundamental earnings tailwinds.',
    aiScore: 85,
    aiConfidence: 'Very High (92%)',
    isFeaturedAiPick: false,
    peRatio: 26.4,
    marketCap: '₹20.1 Lakh Cr ($242B)',
    high52: 3217.90,
    low52: 2220.30,
    volume: '8.4M',
    avgVolume: '6.9M',
    rsi: 54.8,
    beta: 0.85,
    dividendYield: '0.34%',
    sector: 'Conglomerate & Telecom',
    country: 'India',
    emoji: '🏭',
    sparkline: [2890, 2910, 2900, 2935, 2950, 2960, 2974.4],
    audioSummary: 'Reliance Industries is rated a Good Buy with an 85% AI score. Dominant market share in 5G telecommunications and retail delivers dependable portfolio stability.',
    history: generateHistory(2974.40, 'up', 0.012),
  },
  {
    id: 'tatamotors',
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    exchange: 'NSE',
    currency: 'INR',
    priceUSD: 11.60,
    priceINR: 980.20,
    change: -14.30,
    changePercent: -1.44,
    isPositive: false,
    trafficLight: 'hold',
    trafficLightLabel: 'Hold / Wait',
    trafficLightIcon: '🟡',
    simpleVerdict: 'Great company, but car sales slowed slightly this month. Better to hold or wait for the price to stabilize before buying more.',
    proVerdict: 'Consolidation phase between ₹960 and ₹1,020. JLR margins remain robust, but domestic commercial vehicle demand is in a temporary cyclical pause.',
    aiScore: 68,
    aiConfidence: 'Medium (76%)',
    isFeaturedAiPick: false,
    peRatio: 16.2,
    marketCap: '₹3.6 Lakh Cr ($43B)',
    high52: 1179.05,
    low52: 608.50,
    volume: '12.8M',
    avgVolume: '14.2M',
    rsi: 46.1,
    beta: 1.42,
    dividendYield: '0.61%',
    sector: 'Automotive & EVs',
    country: 'India',
    emoji: '🚗',
    sparkline: [1020, 1010, 995, 1005, 990, 985, 980.2],
    audioSummary: 'Tata Motors is currently rated Hold with a 68% AI score. Short-term softness in domestic vehicle volumes suggests waiting for a clearer price floor.',
    history: generateHistory(980.20, 'down', 0.018),
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceUSD: 248.90,
    priceINR: 21032.05,
    change: -8.40,
    changePercent: -3.26,
    isPositive: false,
    trafficLight: 'risk',
    trafficLightLabel: 'Don\'t Buy / High Risk',
    trafficLightIcon: '🔴',
    simpleVerdict: 'High risk right now! Price jumps up and down quickly due to EV competition and regulatory news. Only for advanced risk-takers.',
    proVerdict: 'Elevated implied volatility following earnings miss and aggressive EV price cuts. Price closed below 50-day EMA ($254.10) with negative MACD histogram divergence.',
    aiScore: 44,
    aiConfidence: 'High (86%)',
    isFeaturedAiPick: false,
    peRatio: 72.5,
    marketCap: '$792 Billion',
    high52: 271.00,
    low52: 138.80,
    volume: '68.5M',
    avgVolume: '59.2M',
    rsi: 38.2,
    beta: 2.34,
    dividendYield: '0.00%',
    sector: 'Clean Tech & EVs',
    country: 'USA',
    emoji: '⚡',
    sparkline: [265, 260, 258, 254, 252, 250, 248.9],
    audioSummary: 'Tesla is rated High Risk with a 44% AI score. Heightened EV competition and compressed automotive margins warrant caution for beginner accounts.',
    history: generateHistory(248.90, 'down', 0.028),
  },
  {
    id: 'infy',
    symbol: 'INFY',
    name: 'Infosys Ltd',
    exchange: 'NSE',
    currency: 'INR',
    priceUSD: 22.80,
    priceINR: 1926.60,
    change: +12.40,
    changePercent: +0.65,
    isPositive: true,
    trafficLight: 'safe',
    trafficLightLabel: 'Good Buy / Safe',
    trafficLightIcon: '🟢',
    simpleVerdict: 'IT services giant that pays regular dividends. Quiet, steady growth that lets you sleep peacefully at night.',
    proVerdict: 'Defensive IT play with 2.8% dividend yield. Large deal wins of $3.2B in banking and cloud migration reinforce revenue guidance for FY27.',
    aiScore: 81,
    aiConfidence: 'Very High (91%)',
    isFeaturedAiPick: false,
    peRatio: 28.1,
    marketCap: '₹8.0 Lakh Cr ($96B)',
    high52: 1991.45,
    low52: 1358.35,
    volume: '6.2M',
    avgVolume: '5.8M',
    rsi: 56.3,
    beta: 0.72,
    dividendYield: '2.84%',
    sector: 'IT & Cloud Services',
    country: 'India',
    emoji: '💻',
    sparkline: [1890, 1905, 1912, 1910, 1920, 1922, 1926.6],
    audioSummary: 'Infosys is rated a Good Buy with an 81% AI score. High-margin digital services and healthy dividend yields make it an ideal defensive asset.',
    history: generateHistory(1926.60, 'up', 0.010),
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceUSD: 448.20,
    priceINR: 37872.90,
    change: +6.10,
    changePercent: +1.38,
    isPositive: true,
    trafficLight: 'safe',
    trafficLightLabel: 'Good Buy / Safe',
    trafficLightIcon: '🟢',
    simpleVerdict: 'Powering Windows, Office, and Azure Cloud. Extremely profitable, highly reliable, and leader in enterprise AI.',
    proVerdict: 'Azure AI workloads driving 31% YoY cloud acceleration. Unbroken 200-day trend line support with high institutional ownership (72.4%).',
    aiScore: 90,
    aiConfidence: 'Very High (96%)',
    isFeaturedAiPick: false,
    peRatio: 36.1,
    marketCap: '$3.33 Trillion',
    high52: 468.35,
    low52: 309.45,
    volume: '22.8M',
    avgVolume: '21.4M',
    rsi: 61.4,
    beta: 0.94,
    dividendYield: '0.72%',
    sector: 'Enterprise Software & Cloud',
    country: 'USA',
    emoji: '🪟',
    sparkline: [435, 438, 440, 442, 444, 446, 448.2],
    audioSummary: 'Microsoft Corporation is rated a Good Buy with a 90% AI score. Relentless enterprise demand for Azure AI copilot solutions sustains stellar profit margins.',
    history: generateHistory(448.20, 'up', 0.012),
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    priceUSD: 194.30,
    priceINR: 16418.35,
    change: +2.10,
    changePercent: +1.09,
    isPositive: true,
    trafficLight: 'safe',
    trafficLightLabel: 'Good Buy / Safe',
    trafficLightIcon: '🟢',
    simpleVerdict: 'Dominates online shopping and AWS cloud hosting. Steady customer loyalty and growing advertising revenue.',
    proVerdict: 'AWS operating profit margins reached multi-quarter high of 38%. E-commerce fulfillment regionalization continues to drive cost efficiencies.',
    aiScore: 86,
    aiConfidence: 'High (90%)',
    isFeaturedAiPick: false,
    peRatio: 42.6,
    marketCap: '$2.02 Trillion',
    high52: 201.20,
    low52: 118.35,
    volume: '34.2M',
    avgVolume: '36.8M',
    rsi: 59.2,
    beta: 1.15,
    dividendYield: '0.00%',
    sector: 'E-commerce & Cloud',
    country: 'USA',
    emoji: '📦',
    sparkline: [188, 189, 191, 190, 192, 193, 194.3],
    audioSummary: 'Amazon is rated a Good Buy with an 86% AI score. Robust expansion in AWS cloud margins and digital advertising provide dependable fundamental strength.',
    history: generateHistory(194.30, 'up', 0.014),
  }
];

export const MARKET_HEALTH_DATA = {
  score: 82, // 0 - 100
  status: 'Market is Safe Today',
  state: 'safe', // 'safe' | 'caution' | 'risk'
  icon: '🟢',
  headline: 'Low volatility & solid earnings make today an optimal day for systematic buying',
  audioSummary: 'Good day! The StockSense Market Health Meter registers 82 out of 100. Markets are stable, corporate balance sheets are resilient, and overall risk levels are low. Non-technical investors can safely consider systematic investments into green-rated stocks.',
  indicators: [
    { name: 'Corporate Earnings', value: '88% Beating Forecasts', status: 'Healthy', positive: true },
    { name: 'Market Volatility (VIX)', value: '13.2 (Calm & Stable)', status: 'Low Risk', positive: true },
    { name: 'Central Bank Policy', value: 'Interest Rates Stable', status: 'Favorable', positive: true },
    { name: 'Global Liquidity', value: 'Strong Inflows ($4.2B)', status: 'Bullish', positive: true }
  ]
};

export const MOCK_ADMIN_USERS = [
  { id: 'usr-1', name: 'Aarav Patel', email: 'aarav.p@example.com', role: 'Beginner', status: 'Active', balanceUSD: 10450, trades: 14, lastActive: '2 mins ago', avatar: '👨🏽' },
  { id: 'usr-2', name: 'Sophia Chen', email: 'sophia.c@hedgefund.io', role: 'Pro Trader', status: 'Active', balanceUSD: 142800, trades: 142, lastActive: '12 mins ago', avatar: '👩🏻' },
  { id: 'usr-3', name: 'Rajesh Sharma', email: 'rajesh.sharma@invest.in', role: 'Beginner', status: 'Active', balanceUSD: 5200, trades: 6, lastActive: '1 hour ago', avatar: '👨🏾' },
  { id: 'usr-4', name: 'Elena Rostova', email: 'elena.r@alpha.com', role: 'Admin', status: 'Active', balanceUSD: 310500, trades: 412, lastActive: 'Just now', avatar: '👩🏼' },
  { id: 'usr-5', name: 'Marcus Johnson', email: 'marcus.j@gmail.com', role: 'Pro Trader', status: 'Active', balanceUSD: 48900, trades: 89, lastActive: '3 hours ago', avatar: '👨🏿' },
  { id: 'usr-6', name: 'Pooja Iyer', email: 'pooja.iyer@fintech.in', role: 'Beginner', status: 'Suspended', balanceUSD: 1200, trades: 3, lastActive: '3 days ago', avatar: '👩🏽' },
  { id: 'usr-7', name: 'David Miller', email: 'david.m@outlook.com', role: 'Beginner', status: 'Active', balanceUSD: 15400, trades: 21, lastActive: '5 hours ago', avatar: '👨🏼' },
];

export const MOCK_NEWS = [
  {
    id: 'news-1',
    title: 'Tech Giants Lead Global Rally on Record Cloud & AI Demand',
    source: 'Financial Express',
    time: '25m ago',
    tag: 'Tech',
    sentiment: 'Bullish 🟢',
    readTime: '2 min read',
    summary: 'Cloud infrastructure providers reported surging client adoption of generative AI systems, boosting equity benchmarks.'
  },
  {
    id: 'news-2',
    title: 'Indian Markets Hit Fresh Highs as Domestic Inflows Reach Record ₹30,000 Cr',
    source: 'Economic Times',
    time: '1h ago',
    tag: 'India Market',
    sentiment: 'Strong Buy 🟢',
    readTime: '3 min read',
    summary: 'Systematic Investment Plans (SIPs) hit an all-time monthly high, lending robust support to top blue chips.'
  },
  {
    id: 'news-3',
    title: 'Federal Reserve Notes Inflation Moderation, Holds Guidance Steady',
    source: 'Bloomberg Markets',
    time: '3h ago',
    tag: 'Economy',
    sentiment: 'Neutral 🟡',
    readTime: '4 min read',
    summary: 'Policymakers affirmed patience with rate adjustments as consumer price indexes trend smoothly toward targets.'
  },
  {
    id: 'news-4',
    title: 'Automotive Sector Prepares for Festival Demand Amid Supply Chain Easing',
    source: 'Reuters Auto',
    time: '5h ago',
    tag: 'Auto',
    sentiment: 'Cautious 🟡',
    readTime: '2 min read',
    summary: 'Automakers ramp up domestic inventory ahead of festive quarters with localized EV offerings gaining share.'
  }
];

export const SUGGESTED_CHAT_PROMPTS = [
  "Should I invest ₹1000 today?",
  "Which stock is safest for beginners?",
  "Is Apple (AAPL) a good buy right now?",
  "Explain P/E ratio like I'm 10",
  "What does 🔴 Don't Buy mean?",
  "Is the market safe to invest right now?"
];

export const AI_BOT_KNOWLEDGE_BASE = {
  invest1000: {
    match: ['1000', 'invest', 'start', 'begin', 'today', '500', 'small'],
    reply: "Yes, absolutely! Investing ₹1,000 (or $20) regularly is the best way to start building wealth. Right now, the Market Health is 🟢 Safe (82/100). For your first ₹1,000, consider safe blue-chips like **Infosys (INFY)**, **Reliance**, or **Apple (AAPL)**. You don't need a fortune to start — consistency is what matters! 🌟"
  },
  safest: {
    match: ['safest', 'beginner', 'first stock', 'safe', 'low risk', 'best'],
    reply: "For beginners, the safest stocks right now are:\n1. 🟢 **Apple (AAPL)** — 88% AI Score. Huge cash pile, dependable dividends.\n2. 🟢 **Reliance Industries** — 85% AI Score. India's telecom & retail backbone.\n3. 🟢 **Microsoft (MSFT)** — 90% AI Score. Software that powers the world.\n\nTip: Look for our big 🟢 Good Buy badge to pick stress-free winners!"
  },
  apple: {
    match: ['apple', 'aapl', 'iphone'],
    reply: "🟢 **Apple (AAPL) is rated a Good Buy with an 88% AI Score!** It has steady iPhone upgrades, surging services revenue (iCloud, App Store, Apple Pay), and rock-solid profits. Our AI system rates it as a low-risk, prime core holding."
  },
  pe: {
    match: ['pe', 'p/e', 'ratio', 'explain', '10', 'kid'],
    reply: "Think of P/E like buying a lemonade stand! 🍋\n\nIf the stand makes $10 of profit every year, and the owner asks $100 to sell it to you, the P/E is 10 ($100 ÷ $10).\n\n• A **low P/E (under 20)** usually means the stock is on sale or a bargain.\n• A **high P/E (over 40)** means people expect huge future growth (like Tesla or Nvidia)!\n\nIn Simple Mode, we turn this number into plain words so you never have to do math!"
  },
  traffic: {
    match: ['traffic', 'red', 'yellow', 'green', 'badge', 'dont buy', 'hold'],
    reply: "Our Traffic-Light System is designed for instant clarity:\n\n🟢 **Good Buy / Safe**: High AI score, strong profits, low risk. Great to buy!\n🟡 **Hold / Wait**: Decent company, but price might drop a bit first. Wait or keep what you have.\n🔴 **Don't Buy / High Risk**: High volatility or falling earnings. Avoid if you are a beginner!"
  },
  market: {
    match: ['market', 'health', 'safe right now', 'volatility', 'crash'],
    reply: "The StockSense Market Health Meter is currently **🟢 82/100 (Safe Today)**. Inflation is cooling, corporate earnings are beating forecasts, and volatility is low. It's a favorable climate for buying safe green-badged stocks!"
  }
};
