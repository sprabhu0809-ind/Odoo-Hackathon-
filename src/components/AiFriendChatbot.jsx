import React, { useState, useRef, useEffect } from 'react';
import { useStock } from '../context/StockContext';
import { SUGGESTED_CHAT_PROMPTS, AI_BOT_KNOWLEDGE_BASE } from '../data/mockData';
import { AppIconBadge } from './AppIconBadge';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Volume2,
  Mic,
  CheckCheck,
  Bot
} from 'lucide-react';

export const AiFriendChatbot = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    stocks,
    speakText,
    isSpeaking,
    speakingId,
    formatStockPrice,
    currency
  } = useStock();

  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'bot',
      text: "Hello! 👋 I'm your **StockSense AI Friend**. I make stock investing super easy to understand, just like chatting on WhatsApp. Ask me anything or tap a prompt card below!",
      time: 'Just now',
      stockId: null
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Find matching stock from query
  const findMentionedStock = (query) => {
    const q = query.toLowerCase();
    return stocks.find(s =>
      q.includes(s.symbol.toLowerCase()) ||
      q.includes(s.name.toLowerCase()) ||
      (s.id === 'aapl' && q.includes('apple')) ||
      (s.id === 'tsla' && q.includes('tesla')) ||
      (s.id === 'nvda' && (q.includes('nvidia') || q.includes('chips'))) ||
      (s.id === 'reliance' && (q.includes('reliance') || q.includes('jio'))) ||
      (s.id === 'msft' && (q.includes('microsoft') || q.includes('windows'))) ||
      (s.id === 'amzn' && q.includes('amazon')) ||
      (s.id === 'googl' && (q.includes('google') || q.includes('alphabet'))) ||
      (s.id === 'meta' && (q.includes('meta') || q.includes('facebook') || q.includes('instagram'))) ||
      (s.id === 'hdfcbank' && q.includes('hdfc')) ||
      (s.id === 'icicibank' && q.includes('icici')) ||
      (s.id === 'tatamotors' && (q.includes('tata') || q.includes('tatamotors'))) ||
      (s.id === 'infy' && q.includes('infosys')) ||
      (s.id === 'itc' && q.includes('itc')) ||
      (s.id === 'sbin' && (q.includes('sbi') || q.includes('state bank')))
    );
  };

  // Generate bot reply with LIVE price lookup
  const getBotResponse = (userText) => {
    const text = userText.toLowerCase();

    // Check if question asks about a specific stock
    const matchedStock = findMentionedStock(text);

    if (matchedStock) {
      const livePriceFormatted = formatStockPrice(matchedStock);
      const direction = matchedStock.isPositive ? 'up' : 'down';
      const absChange = Math.abs(matchedStock.changePercent);

      const reply = `**${matchedStock.name} (${matchedStock.symbol})** is trading at **${livePriceFormatted}** right now, ${direction} **${absChange}%** today.\n\n• **Status**: ${matchedStock.trafficLightIcon} ${matchedStock.trafficLightLabel} (${matchedStock.aiScore}% AI score)\n• **Verdict**: ${matchedStock.simpleVerdict}`;

      const speechText = `${matchedStock.name} is trading at ${livePriceFormatted} right now, ${direction} ${absChange} percent today. Our AI gives it a ${matchedStock.aiScore} percent score with ${matchedStock.trafficLightLabel} status. ${matchedStock.simpleVerdict}`;

      return {
        reply,
        speechText,
        stockId: matchedStock.id
      };
    }

    // Check knowledge base
    for (const [key, item] of Object.entries(AI_BOT_KNOWLEDGE_BASE)) {
      if (item.match.some(keyword => text.includes(keyword))) {
        return {
          reply: item.reply,
          speechText: item.reply.replace(/[*_#•]/g, ''),
          stockId: null
        };
      }
    }

    // Default friendly AI reply
    const defaultReply = "That's a great question! In simple terms: our AI analyzes billions of financial signals every morning. If a stock shows a **🟢 Good Buy badge**, it means the company is strong, making healthy profits, and safe for beginners. Always remember to invest systematically!";
    return {
      reply: defaultReply,
      speechText: defaultReply.replace(/[*_#•]/g, ''),
      stockId: null
    };
  };

  const handleSendMessage = (textToSend = null) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    const userMsg = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking & typing
    setTimeout(() => {
      const response = getBotResponse(content);
      const msgId = `m-${Date.now() + 1}`;

      const botMsg = {
        id: msgId,
        sender: 'bot',
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stockId: response.stockId
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      // Automatically speak the response aloud using Web Speech API
      speakText(response.speechText, `chat-${msgId}`);
    }, 1100);
  };

  // Replay speech for a message (dynamically re-reads live price if linked to a stock)
  const handleReplaySpeech = (msg) => {
    if (msg.stockId) {
      const currentStock = stocks.find(s => s.id === msg.stockId);
      if (currentStock) {
        const livePriceFormatted = formatStockPrice(currentStock);
        const direction = currentStock.isPositive ? 'up' : 'down';
        const absChange = Math.abs(currentStock.changePercent);
        const liveText = `${currentStock.name} is trading at ${livePriceFormatted} right now, ${direction} ${absChange} percent today. Our AI gives it a ${currentStock.aiScore} percent score with ${currentStock.trafficLightLabel} status. ${currentStock.simpleVerdict}`;
        speakText(liveText, `chat-${msg.id}`);
        return;
      }
    }
    speakText(msg.text.replace(/[*_#•]/g, ''), `chat-${msg.id}`);
  };

  return (
    <>
      {/* Floating Consumer-Style WhatsApp Launcher Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#1ebd5a] text-white p-4 rounded-full shadow-2xl flex items-center space-x-2.5 transition-all transform hover:scale-105 ring-4 ring-[#25D366]/25 touch-target"
          aria-label="Open StockSense AI Friend Chat"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 stroke-[2.4]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-[#25D366] animate-pulse"></span>
          </div>
          <span className="font-extrabold text-sm pr-1">Ask AI Friend</span>
        </button>
      )}

      {/* WhatsApp Style Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-full max-w-sm sm:max-w-md h-[580px] bg-slate-100 rounded-3xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-slide-up">
          
          {/* Header (WhatsApp Consumer Aesthetics) */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-extrabold text-base shadow-sm">
                  🤖
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#075E54] animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-tight flex items-center">
                  StockSense AI Friend
                  <Sparkles className="w-3.5 h-3.5 ml-1 text-amber-300 fill-amber-300" />
                </h3>
                <span className="text-[11px] text-emerald-200">Online • Live Prices & Real Speech</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white touch-target flex items-center justify-center"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed with WhatsApp subtle doodle styling */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#EFEAE2]">
            
            {/* Live indicator badge */}
            <div className="text-center my-1">
              <span className="bg-emerald-100/90 text-emerald-900 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-xs border border-emerald-300">
                🟢 Live prices spoken out loud in plain English
              </span>
            </div>

            {/* Message list */}
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              const isSpeakingMsg = speakingId === `chat-${msg.id}` && isSpeaking;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs relative ${
                      isBot
                        ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                        : 'bg-[#D9FDD3] text-slate-900 rounded-tr-none border border-emerald-200'
                    }`}
                  >
                    {/* Bot sender badge */}
                    {isBot && (
                      <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-100">
                        <span className="font-extrabold text-[11px] text-emerald-800 flex items-center">
                          <Bot className="w-3 h-3 mr-1" /> StockSense AI
                        </span>
                        {/* Audio speech button for response */}
                        <button
                          onClick={() => handleReplaySpeech(msg)}
                          className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors ${
                            isSpeakingMsg
                              ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 animate-pulse'
                              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                          }`}
                          title="Listen to live price & advice"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isSpeakingMsg ? 'Speaking...' : 'Listen'}</span>
                        </button>
                      </div>
                    )}

                    {/* Text formatted */}
                    <div className="leading-relaxed whitespace-pre-line font-medium">
                      {msg.text.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-1' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>

                    {/* Timestamp & checks */}
                    <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-slate-400">
                      <span>{msg.time}</span>
                      {!isBot && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-500 rounded-2xl rounded-tl-none p-3 shadow-sm border border-slate-200 text-xs flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">StockSense AI is checking live price...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Question Cards */}
          <div className="bg-white px-3 py-2 border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex space-x-2">
            {[
              "What's the price of Tesla right now?",
              "What is Apple trading at today?",
              "Should I invest ₹1000 today?",
              "Which stock is safest for beginners?",
              "What's NVIDIA trading at right now?",
              "What is Reliance trading at today?",
              "Explain P/E ratio like I'm 10"
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="inline-block px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold text-[11px] border border-slate-200 transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything (e.g. What's Tesla's price right now?)..."
              className="flex-1 py-2.5 px-4 bg-slate-100 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#075E54] hover:bg-[#128C7E] disabled:opacity-40 text-white rounded-2xl shadow-md transition-all touch-target flex items-center justify-center"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
