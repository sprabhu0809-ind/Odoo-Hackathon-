# StockSense 📈 — AI Stock Tracker & Advisory Web App (Odoo Hackathon)

> **World-Class, Ultra-Accessible, Highly Intuitive Stock Tracker & AI Advisory**
> Simple enough for non-technical, first-time, or non-English-fluent users — as easy as WhatsApp or YouTube, yet powered with advanced analytics via **Pro Mode**.

---

## 🌟 Key Features

### 1. ♿ Ultra-Accessible Beginner Mode
- **Traffic-Light System**:
  - 🟢 **Good Buy / Safe**: High AI score, strong fundamentals, low volatility.
  - 🟡 **Hold / Wait**: Neutral conditions, wait for price stabilization.
  - 🔴 **Don't Buy / High Risk**: Elevated volatility, high debt, or negative momentum.
- **🔊 Voice & Audio Advisory**: Real speech synthesis (`window.speechSynthesis`) integration to listen to AI verdicts and market summaries aloud in 3 languages (English, Hindi, Tamil) with one tap.
- **🎙️ Voice Search**: Speak stock names (Apple, Nvidia, Reliance, etc.) with instant recognition.
- **High Contrast & Scalable Typography**: 48px+ touch targets, icon-first rounded UI, and font size scalers (A / A+ / A++).
- **Simple ⇄ Pro Toggle**:
  - **Simple Mode**: Plain English summaries ("Good Choice", "Risky", "Price going up"), clean area charts.
  - **Pro Mode**: Technical candlesticks, SMA 20/50 overlays, RSI indicators, P/E ratios, beta, and volume bars.

### 2. 🤖 WhatsApp-Style "StockSense AI Friend" Chatbot
- Floating interactive chat assistant mimicking WhatsApp aesthetics (green status bar, chat bubbles, timestamps, typing indicators).
- One-tap suggested question chips:
  - *"Should I invest ₹1000 today?"*
  - *"Which stock is safest for beginners?"*
  - *"Is Apple (AAPL) a good buy right now?"*
  - *"Explain P/E ratio like I'm 10"*
  - *"What does 🔴 Don't Buy mean?"*
- Speech audio trigger on every bot response.

### 3. 🎯 User Dashboard
- **Market Health Meter**: Dynamic radial speedometer gauge (0–100) displaying overall market risk and macroeconomic indicators.
- **Top Stocks Carousel**: Horizontal scrolling cards with sparklines, traffic lights, and 1-tap buy actions.
- **AI Recommendation Banner**: Daily highlighted AI pick with plain-language rationale.
- **Interactive Chart Section**: Switch between 1D, 1W, 1M, 1Y, and ALL timeframes with Simple and Pro chart options.
- **Quick Investment Growth Simulator**: Interactive amount slider ($ / ₹) showing projected 1-year and 3-year compounding growth vs traditional bank savings.
- **Simulated Portfolio & Watchlist**: Manage active virtual holdings, track real-time P&L, execute sales, and bookmark starred favorites.

### 4. 🛡️ Admin Command Center
- **Analytics Overview**: Platform simulated volume, active users, AI hit rate, and order counts.
- **Stock Management CRUD**: Add new mock stocks, edit prices, set AI scores, and toggle the featured AI pick.
- **User Management Table**: Monitor accounts, view simulated balances, and suspend or activate users.
- **Live System Broadcast Tool**: Dispatch real-time alert banners to all user feeds.
- **Integration Guide**: Interactive checklist and starter SQL script for Clerk and Supabase wiring.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts & Gauges**: Recharts
- **Simulations & Effects**: Canvas Confetti
- **Voice / Speech**: Web Speech API (`SpeechSynthesis` & `SpeechRecognition`)
- **Backend / Auth Ready**: Clerk & Supabase starter client configured

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/sprabhu0809-ind/Odoo-Hackathon-.git
cd Odoo-Hackathon-

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8000` in your browser.

---

## 🔌 Connecting Clerk Auth & Supabase DB

The codebase is structured with clear placeholder hooks:

### Step 1: Clerk Authentication
1. Go to [clerk.com](https://clerk.com/) and create an application named **StockSense**.
2. Add your key to `.env.local`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```
3. In `src/main.jsx`, wrap `<App />` with `<ClerkProvider publishableKey={...}>`.

### Step 2: Supabase Database
1. Go to [supabase.com](https://supabase.com/) and create a project named **stocksense-db**.
2. Add credentials to `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Open `src/lib/supabaseClient.js` to see the pre-configured client.
4. Execute the starter SQL schema provided in the Admin Dashboard under **"Clerk & DB"** tab.

---

## 📄 License
This project is licensed under the MIT License.
