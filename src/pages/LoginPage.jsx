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
  CheckCircle2
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setCurrentTab } = useStock();

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-brand-900 selection:text-white">
      
      {/* Top Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 mb-3">
          <AppIconBadge icon={TrendingUp} variant="brand" size="lg" />
          <span className="font-display font-extrabold text-3xl text-brand-navy tracking-tight">
            Stock<span className="text-brand-900">Sense</span>
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Sparkles className="w-3 h-3 mr-0.5 fill-amber-500 text-amber-600" /> AI
          </span>
        </Link>
        <h2 className="text-xl font-extrabold font-display text-slate-900 tracking-tight">
          Sign In & Choose Your Role
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Select an account persona to explore the corresponding dashboard
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
  );
};
