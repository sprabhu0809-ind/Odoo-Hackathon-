import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import { Megaphone, X, Volume2, Sparkles, AlertCircle } from 'lucide-react';

export const SystemBroadcastBanner = () => {
  const { systemBroadcast, speakText, isSpeaking, speakingId } = useStock();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!systemBroadcast?.active || isDismissed) {
    return null;
  }

  const isCurrentSpeaking = speakingId === 'broadcast-speech' && isSpeaking;

  return (
    <div className="bg-gradient-to-r from-brand-900 via-blue-900 to-indigo-950 text-white border-b border-blue-800/40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="flex-shrink-0 p-1 bg-amber-400/20 text-amber-300 rounded-lg">
              <Megaphone className="w-4 h-4 animate-bounce" />
            </span>
            <span className="truncate font-semibold tracking-wide">
              {systemBroadcast.text}
            </span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Audio Voice read out */}
            <button
              onClick={() => speakText(systemBroadcast.text, 'broadcast-speech')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                isCurrentSpeaking
                  ? 'bg-amber-400 text-brand-navy shadow-md ring-2 ring-amber-200'
                  : 'bg-white/10 hover:bg-white/20 text-blue-100'
              }`}
              title="Listen to broadcast announcement aloud"
              aria-label="Listen to broadcast"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isCurrentSpeaking ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">{isCurrentSpeaking ? 'Listening...' : 'Listen'}</span>
            </button>

            {/* Dismiss banner */}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Dismiss announcement"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
