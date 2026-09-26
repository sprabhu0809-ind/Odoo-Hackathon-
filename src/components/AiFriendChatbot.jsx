import React, { useState, useRef, useEffect } from 'react';
import { useStock } from '../context/StockContext';
import { SUGGESTED_CHAT_PROMPTS, AI_BOT_KNOWLEDGE_BASE } from '../data/mockData';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Volume2,
  Mic,
  Smile,
  CheckCheck,
  ChevronDown,
  Bot
} from 'lucide-react';

export const AiFriendChatbot = () => {
  const { isChatOpen, setIsChatOpen, speakText, isSpeaking, speakingId } = useStock();

  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'bot',
      text: "Hello! 👋 I'm your **StockSense AI Friend**. I make stock investing super easy to understand, just like chatting with a friend. How can I help you today?",
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Generate bot reply
  const getBotResponse = (userText) => {
    const text = userText.toLowerCase();

    for (const [key, item] of Object.entries(AI_BOT_KNOWLEDGE_BASE)) {
      if (item.match.some(keyword => text.includes(keyword))) {
        return item.reply;
      }
    }

    // Default intelligent fallbacks
    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      return "Hello there! 😊 Ready to build your wealth? Tap any suggested card below or ask me about stocks like Apple, Nvidia, or Reliance!";
    }

    return "That's a great question! In simple terms: our AI analyzes billions of financial signals every morning. If a stock shows a **🟢 Good Buy badge**, it means the company is strong, making healthy profits, and safe for beginners. Always remember to invest only what you don't need immediately!";
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
      const botReplyText = getBotResponse(content);
      const botMsg = {
        id: `m-${Date.now() + 1}`,
        sender: 'bot',
        text: botReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white p-4 rounded-full shadow-2xl flex items-center space-x-2.5 transition-all transform hover:scale-105 ring-4 ring-emerald-500/20 touch-target"
          aria-label="Open StockSense AI Friend Chat"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-emerald-700 animate-pulse"></span>
          </div>
          <span className="font-extrabold text-sm pr-1">Ask AI Friend</span>
        </button>
      )}

      {/* WhatsApp Style Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-full max-w-sm sm:max-w-md h-[580px] bg-slate-100 rounded-3xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-slide-up">
          
          {/* Header (WhatsApp Inspired) */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-extrabold text-base shadow-sm">
                  🤖
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#075E54]"></span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-tight flex items-center">
                  StockSense AI Friend
                  <Sparkles className="w-3.5 h-3.5 ml-1 text-amber-300 fill-amber-300" />
                </h3>
                <span className="text-[11px] text-emerald-200">Online • Always Ready to Help</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed with WhatsApp subtle doodle styling */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#EFEAE2]">
            
            {/* Disclaimer pill */}
            <div className="text-center my-1">
              <span className="bg-amber-100/90 text-amber-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-xs border border-amber-200">
                🔒 Simulated educational advice for smart learning
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
                          onClick={() => speakText(msg.text.replace(/[*_#]/g, ''), `chat-${msg.id}`)}
                          className={`p-1 rounded-md text-[10px] font-bold flex items-center space-x-0.5 ${
                            isSpeakingMsg ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-slate-700'
                          }`}
                          title="Listen to this message"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
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
                  <span className="text-[11px] text-slate-400 font-semibold">StockSense AI is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Question Cards */}
          <div className="bg-white px-3 py-2 border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex space-x-2">
            {SUGGESTED_CHAT_PROMPTS.map((prompt, idx) => (
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
              placeholder="Ask anything (e.g. Should I buy Apple?)..."
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
