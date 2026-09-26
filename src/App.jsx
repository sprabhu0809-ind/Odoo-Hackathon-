import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StockProvider } from './context/StockContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { UserDashboard } from './pages/UserDashboard';
import { MarketerDashboard } from './pages/MarketerDashboard';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  return (
    <StockProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Login / Role Selection Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* User Investor Dashboard (Simple / Pro Mode) */}
          <Route path="/app" element={<UserDashboard />} />

          {/* Marketer Dashboard */}
          <Route path="/marketer" element={<MarketerDashboard />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Fallback to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StockProvider>
  );
}
