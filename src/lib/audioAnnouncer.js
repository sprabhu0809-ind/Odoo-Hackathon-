// =========================================================================
// StockSense Multilingual Translation & Train-Station Announcer Engine
// Supports: English (en-IN), Hindi (hi-IN), Tamil (ta-IN)
// =========================================================================

// Play a pleasant train-station / transit PA announcement chime using Web Audio API
export const playTrainStationChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // 3-note melodic train-station chime (C5 -> E5 -> G5)
    playTone(523.25, 0.0, 0.4);
    playTone(659.25, 0.22, 0.4);
    playTone(783.99, 0.44, 0.6);
  } catch (e) {
    console.warn('AudioContext not supported or permitted yet:', e);
  }
};

// Language configurations and voice locators
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', short: '🇬🇧 EN', bcp47: 'en-IN', fallbackBcp47: 'en-US' },
  { code: 'hi', label: 'हिन्दी', short: '🇮🇳 HI', bcp47: 'hi-IN', fallbackBcp47: 'hi' },
  { code: 'ta', label: 'தமிழ்', short: '🇮🇳 TA', bcp47: 'ta-IN', fallbackBcp47: 'ta' }
];

// Generate multilingual stock advice text
export const getStockAdvicePhrase = (stock, lang = 'en', currency = 'USD') => {
  const currWord = currency === 'INR'
    ? (lang === 'hi' ? 'रुपये' : lang === 'ta' ? 'ரூபாய்' : 'rupees')
    : (lang === 'hi' ? 'डॉलर' : lang === 'ta' ? 'டாலர்' : 'dollars');

  const priceVal = currency === 'INR' ? stock.priceINR.toFixed(2) : stock.priceUSD.toFixed(2);
  const changePct = Math.abs(stock.changePercent).toFixed(2);
  const isUp = stock.isPositive;

  if (lang === 'hi') {
    const dir = isUp ? 'ऊपर' : 'नीचे';
    const status = stock.trafficLight === 'green' ? 'अच्छा विकल्प' : stock.trafficLight === 'yellow' ? 'प्रतीक्षा करें' : 'उच्च जोखिम';
    return `${stock.name} वर्तमान में ${priceVal} ${currWord} पर है, आज ${changePct} प्रतिशत ${dir} है। हमारा एआई इसे ${stock.aiScore} प्रतिशत स्कोर और ${status} का दर्जा देता है। ${stock.simpleVerdict}`;
  }

  if (lang === 'ta') {
    const dir = isUp ? 'ஏற்றம்' : 'இறக்கம்';
    const status = stock.trafficLight === 'green' ? 'சிறந்த தேர்வு' : stock.trafficLight === 'yellow' ? 'பொறுத்திருக்கவும்' : 'அதிக ஆபத்து';
    return `${stock.name} தற்போது ${priceVal} ${currWord} விலையில் உள்ளது, இன்று ${changePct} சதவீதம் ${dir} கண்டுள்ளது. எங்கள் ஏஐ இதற்கு ${stock.aiScore} சதவீத மதிப்பீட்டையும் ${status} நிலையையும் வழங்குகிறது. ${stock.simpleVerdict}`;
  }

  // Default English
  const dir = isUp ? 'up' : 'down';
  return `${stock.name} is currently ${priceVal} ${currWord}, ${dir} ${changePct} percent today. Our AI gives it an ${stock.aiScore} percent score with ${stock.trafficLightLabel} status. ${stock.simpleVerdict}`;
};

// Generate train-station PA announcement line
export const getTrainStationAnnouncement = (stock, lang = 'en', currency = 'USD') => {
  const currWord = currency === 'INR'
    ? (lang === 'hi' ? 'रुपये' : lang === 'ta' ? 'ரூபாய்' : 'rupees')
    : (lang === 'hi' ? 'डॉलर' : lang === 'ta' ? 'டாலர்' : 'dollars');

  const priceVal = currency === 'INR' ? stock.priceINR.toFixed(2) : stock.priceUSD.toFixed(2);
  const changePct = Math.abs(stock.changePercent).toFixed(2);
  const isUp = stock.isPositive;

  if (lang === 'hi') {
    const dir = isUp ? 'बढ़त के साथ' : 'गिरावट के साथ';
    return `कृपया ध्यान दें: ${stock.name} अब ${priceVal} ${currWord} पर कारोबार कर रहा है, ${changePct} प्रतिशत ${dir}।`;
  }

  if (lang === 'ta') {
    const dir = isUp ? 'ஏற்றத்துடன்' : 'சரிவுடன்';
    return `அனைவரின் கவனத்திற்கு: ${stock.name} தற்போது ${priceVal} ${currWord} விலையில் வர்த்தகமாகிறது, ${changePct} சதவீதம் ${dir}।`;
  }

  const dir = isUp ? 'up' : 'down';
  return `Attention please: ${stock.name} is now trading at ${priceVal} ${currWord}, ${dir} ${changePct} percent.`;
};

// Chat multilingual responses with live price injection
export const getChatAnswerPhrase = (qa, stock, lang = 'en', currency = 'USD') => {
  if (!stock) return qa.answer;

  const currWord = currency === 'INR'
    ? (lang === 'hi' ? 'रुपये' : lang === 'ta' ? 'ரூபாய்' : 'rupees')
    : (lang === 'hi' ? 'डॉलर' : lang === 'ta' ? 'டாலர்' : 'dollars');

  const priceVal = currency === 'INR' ? stock.priceINR.toFixed(2) : stock.priceUSD.toFixed(2);
  const changePct = Math.abs(stock.changePercent).toFixed(2);
  const isUp = stock.isPositive;

  if (lang === 'hi') {
    const dir = isUp ? 'ऊपर' : 'नीचे';
    return `${stock.name} अभी ${priceVal} ${currWord} पर चल रहा है, पिछले कुछ मिनटों में ${changePct} प्रतिशत ${dir} है। ${qa.answer}`;
  }

  if (lang === 'ta') {
    const dir = isUp ? 'ஏற்றம்' : 'சரிவு';
    return `${stock.name} தற்போது ${priceVal} ${currWord} விலையில் உள்ளது, கடந்த சில நிமிடங்களில் ${changePct} சதவீதம் ${dir} கண்டுள்ளது. ${qa.answer}`;
  }

  const dir = isUp ? 'up' : 'down';
  return `${stock.name} is trading at ${priceVal} ${currWord} right now, ${dir} ${changePct} percent in the last few minutes. ${qa.answer}`;
};
