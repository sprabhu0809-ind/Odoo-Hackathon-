// TODO: This page currently fakes login with local state + the role selector above.
// Once Clerk is wired in (see setup guide), replace the email/password form with
// Clerk's <SignIn />, and store the chosen role as a Clerk `publicMetadata.role`
// field (or Clerk Organization Roles) so real sessions carry the role forward.

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStock } from '../context/StockContext';
import { AppIconBadge } from '../components/AppIconBadge';
import {
  TrendingUp,
  User,
  Megaphone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
  Activity,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { stocks, formatStockPrice, priceFlashes, setCurrentTab } = useStock();

  const [selectedRole, setSelectedRole] = useState('user'); // 'user' | 'marketer' | 'admin'
  const [email, setEmail] = useState('aarav.patel@stocksense.io');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e) => {
    e.preventDefault();

    if (selectedRole === 'admin') {
      setCurrentTab('admin');
      navigate('/admin');
    } else if (selectedRole === 'marketer') {
      navigate('/marketer');
    } else {
      setCurrentTab('user');
      navigate('/app');
    }
  };

  // Duplicate stock array for infinite seamless looping
  const tickerStocks = [...stocks, ...stocks];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-brand-900 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER NAVIGATION WITH LIVE PULSE */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <AppIconBadge icon={TrendingUp} variant="brand" size="md" />
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold text-2xl text-brand-navy tracking-tight group-hover:text-brand-900 transition-colors">
                Stock<span className="text-brand-900">Sense</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 mr-0.5 fill-amber-500 text-amber-600" /> AI
              </span>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Live Market Engine Active</span>
            </div>

            <Link
              to="/"
              className="touch-target inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-brand-900 px-3 py-2 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <Link
              to="/app"
              className="touch-target px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors hidden sm:flex items-center space-x-1"
            >
              <span>Explore Demo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. ANIMATED HORIZONTAL SCROLL TICKER TAPE (REAL-TIME PRICES) */}
        {/* ========================================================================= */}
        <div className="bg-[#0F172A] text-white py-2 overflow-hidden border-t border-b border-slate-800 relative shadow-inner">
          
          {/* Left badge anchor */}
          <div className="absolute left-0 top-0 bottom-0 z-10 px-3 bg-gradient-to-r from-[#0F172A] via-[#0F172A] to-transparent flex items-center pointer-events-none">
            <span className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-slate-900/90 px-2 py-0.5 rounded border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE</span>
            </span>
          </div>

          {/* Right gradient fade */}
          <div className="absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-[#0F172A] to-transparent pointer-events-none"></div>

          {/* Scrolling ticker track */}
          <div className="flex animate-marquee whitespace-nowrap pl-20">
            {tickerStocks.map((stk, index) => {
              const isFlashing = priceFlashes[stk.id];
              const flashBg = isFlashing === 'up'
                ? 'bg-emerald-500/20 text-emerald-300'
                : isFlashing === 'down'
                ? 'bg-rose-500/20 text-rose-300'
                : '';

              return (
                <div
                  key={`${stk.id}-${index}`}
                  className={`inline-flex items-center space-x-2.5 px-4 py-0.5 rounded-lg transition-colors duration-300 ${flashBg}`}
                >
                  <span className="text-sm">{stk.emoji}</span>
                  <span className="font-extrabold text-xs text-white tracking-wide">
                    {stk.symbol}
                  </span>
                  
                  {/* Real-time price */}
                  <span className="font-bold text-xs text-slate-200 font-mono">
                    {formatStockPrice(stk)}
                  </span>

                  {/* Up / Down change percentage */}
                  <span
                    className={`inline-flex items-center text-[11px] font-black font-mono ${
                      stk.isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {stk.isPositive ? '▲ +' : '▼ '}
                    {Math.abs(stk.changePercent).toFixed(2)}%
                  </span>

                  {/* Traffic Light Mini Badge */}
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                      stk.trafficLight === 'green'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : stk.trafficLight === 'yellow'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {stk.trafficLightLabel}
                  </span>

                  <span className="text-slate-600 ml-1 select-none">•</span>
                </div>
              );
            })}
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN SIGN-IN & ROLE SELECTOR CARD */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col justify-center py-10 sm:py-14 sm:px-6 lg:px-8">
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-900 border border-blue-200 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-brand-900 text-brand-900" />
            <span>Select Role & Sign In</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Welcome to StockSense
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Choose your account persona to enter the tailored portal
          </p>
        </div>

      {/* Main Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-modal">
          
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* 1. REQUIRED ROLE SELECTOR (3 TAPPABLE CARDS) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5">
                Select Your Role <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Role 1: User (Investor) */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('user')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all touch-target flex flex-col justify-between ${
                    selectedRole === 'user'
                      ? 'border-brand-900 bg-blue-50/70 ring-4 ring-brand-900/10 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">👤</span>
                    {selectedRole === 'user' && (
                      <CheckCircle2 className="w-4 h-4 text-brand-900" />
                    )}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                      User (Investor)
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Simple & Pro Modes
                    </div>
                  </div>
                </button>

                {/* Role 2: Marketer */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('marketer')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all touch-target flex flex-col justify-between ${
                    selectedRole === 'marketer'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-4 ring-indigo-600/10 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">📣</span>
                    {selectedRole === 'marketer' && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                      Marketer
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Analytics & Alerts
                    </div>
                  </div>
                </button>

                {/* Role 3: Admin */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all touch-target flex flex-col justify-between ${
                    selectedRole === 'admin'
                      ? 'border-amber-500 bg-amber-50/70 ring-4 ring-amber-500/10 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🛠️</span>
                    {selectedRole === 'admin' && (
                      <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                      Admin
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Full Management
                    </div>
                  </div>
                </button>

              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:border-brand-900 focus:outline-none transition-all touch-target"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:border-brand-900 focus:outline-none transition-all touch-target"
                />
              </div>
            </div>

            {/* Sign In CTA */}
            <button
              type="submit"
              className="w-full touch-target py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-900/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>
                Enter as {selectedRole === 'user' ? 'Investor' : selectedRole === 'marketer' ? 'Marketer' : 'Admin'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mock Google Button */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full touch-target py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google (Simulated)</span>
            </button>

          </form>

          {/* Setup note */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium">
              Ready for Clerk Auth • See Manual Setup Guide to wire live sessions
            </span>
          </div>

        </div>
      </div>
    </div>

    {/* Simple Accessible Footer */}
    <footer className="py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500 font-medium">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-brand-navy">StockSense AI</span>
          <span>•</span>
          <span>Ultra-Accessible Stock Advisory</span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Demo Environment • Real-time simulated price ticks with directional momentum
        </div>
      </div>
    </footer>

  </div>
  );
};
