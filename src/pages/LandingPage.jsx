import React from 'react';
import { Link } from 'react-router-dom';
import { useStock } from '../context/StockContext';
import { AppIconBadge } from '../components/AppIconBadge';
import {
  TrendingUp,
  MessageSquare,
  Volume2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  Star,
  Activity,
  BarChart2,
  DollarSign
} from 'lucide-react';

export const LandingPage = () => {
  const { stocks, formatStockPrice, isLiveTickerActive } = useStock();

  const previewStocks = stocks.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between selection:bg-brand-900 selection:text-white">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <AppIconBadge icon={TrendingUp} variant="brand" size="md" />
            <div>
              <span className="font-display font-extrabold text-2xl text-brand-navy tracking-tight">
                Stock<span className="text-brand-900">Sense</span>
              </span>
              <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 mr-0.5 fill-amber-500 text-amber-600" /> AI
              </span>
            </div>
          </Link>

          {/* Nav Links & Login Button */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              to="/app"
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-brand-900 px-3 py-2 rounded-xl transition-colors hidden sm:inline"
            >
              Explore Demo App
            </Link>

            <Link
              to="/login"
              className="touch-target px-5 py-2.5 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-brand-900/20 transition-all flex items-center space-x-1.5"
            >
              <span>Login / Choose Role</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </header>

      {/* Live Market Ticker Tape */}
      <div className="bg-brand-navy text-white py-2.5 overflow-hidden border-b border-slate-800">
        <div className="flex space-x-8 animate-marquee whitespace-nowrap text-xs font-bold">
          {previewStocks.map((stk) => (
            <div key={stk.id} className="inline-flex items-center space-x-2">
              <span className="text-sm">{stk.emoji}</span>
              <span className="text-white font-extrabold">{stk.symbol}</span>
              <span className="text-slate-300">{formatStockPrice(stk)}</span>
              <span className={`text-[11px] font-black ${stk.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stk.isPositive ? '+' : ''}{stk.changePercent}%
              </span>
              <span className="text-slate-600">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        
        {/* Background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-300/30 to-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>🟢 TRAFFIC-LIGHT ACCESSIBILITY • REAL VOICE ADVISORY • PRO MODE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.1]">
            Stock Trading Made as Simple as <span className="text-emerald-600">WhatsApp</span>, Powered by <span className="text-brand-900">World-Class AI</span>.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 font-medium leading-relaxed">
            Never guess the stock market again. StockSense translates complex financial charts into plain English and simple traffic-light signals — with real voice playback!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="w-full sm:w-auto touch-target px-8 py-4 bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-brand-900/25 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Get Started Now (Select Role)</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/app"
              className="w-full sm:w-auto touch-target px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-base rounded-2xl border-2 border-slate-200 shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>Live Investor Demo</span>
              <Activity className="w-5 h-5 text-emerald-600" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-500">
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" /> No financial background required
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" /> 18+ US & Indian stocks live
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" /> $10,000 virtual balance included
            </span>
          </div>

        </div>
      </section>

      {/* Feature Highlights with Consumer App Icon Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold font-display text-slate-900">
            Built Like Your Favorite Consumer Apps
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-2">
            No confusing jargon. Familiar icons, instant voice advice, and one-tap controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: WhatsApp Style AI Friend */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all">
            <div className="mb-5">
              <AppIconBadge icon={MessageSquare} variant="whatsapp" size="lg" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              StockSense AI Friend
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              WhatsApp-style chat UI with timestamps, typing bubbles, and suggested question cards like <em>"Should I invest ₹1000 today?"</em>.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#25D366]">
              <span>Simulated WhatsApp Experience</span>
            </div>
          </div>

          {/* Card 2: Real Audible Voice Advice */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all">
            <div className="mb-5">
              <AppIconBadge icon={Volume2} variant="youtube" size="lg" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Audible Voice Advice & Voice Search
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Uses the native browser Web Speech API (`speechSynthesis`) to speak out stock advice and market summaries in plain language.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#FF0000]">
              <span>Real Speech Synthesis (Audio Output)</span>
            </div>
          </div>

          {/* Card 3: Instagram Style AI Recommendations */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all">
            <div className="mb-5">
              <AppIconBadge icon={Sparkles} variant="instagram" size="lg" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Traffic-Light Scoring & Daily Picks
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              🟢 Good Buy, 🟡 Hold, 🔴 Don't Buy badges paired with high-contrast scores so you instantly understand risk without doing math.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-pink-600">
              <span>Simple Mode ⇄ Pro Mode Toggle</span>
            </div>
          </div>

        </div>

      </section>

      {/* Role Selection Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-gradient-to-r from-brand-navy via-blue-950 to-brand-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-left">
            <span className="text-xs font-extrabold px-3 py-1 bg-amber-400 text-brand-navy rounded-full uppercase tracking-wider">
              Multi-Role Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight">
              One Platform. Three Tailored Experiences.
            </h2>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Test as an <strong>Investor</strong> (Simple or Pro view), a <strong>Marketer</strong> (Engagement analytics & broadcast composer), or an <strong>Admin</strong> (User management & stock CRUD).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Link
              to="/login"
              className="touch-target px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-brand-navy font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/30 transition-all text-center"
            >
              Choose Role & Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <AppIconBadge icon={TrendingUp} variant="brand" size="sm" />
            <span className="font-extrabold text-slate-900 text-sm">StockSense</span>
            <span>•</span>
            <span>Ultra-Accessible Stock Tracker & AI Advisory</span>
          </div>

          <p className="text-slate-400 text-[11px] text-center sm:text-right">
            Simulated educational environment. Prepared for Odoo Hackathon.
          </p>
        </div>
      </footer>

    </div>
  );
};
