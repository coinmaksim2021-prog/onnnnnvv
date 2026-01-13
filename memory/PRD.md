# Flow Intel - Crypto Analytics Dashboard

## Original Problem Statement
Deploy and customize a crypto analytics dashboard from GitHub repository. Focus on frontend UI/UX refinements following a minimalist, Telegram-inspired aesthetic with white background and monochrome design.

## Core Requirements
- Minimalist design: white background, black text, green accents only
- No "rainbow" colors or gradients
- Professional monochrome icons from lucide-react (no emojis)
- Buttons with large corner radius (rounded-2xl)
- Two-column layout (50/50 split)

## What's Been Implemented

### December 2025
- [x] Project cloned from GitHub, environment setup complete
- [x] Main dashboard refactored to two-column layout
- [x] Theme changed to minimalist white/black/gray with green accents
- [x] Smart Money and Top Narratives placed side-by-side
- [x] "View All" buttons fixed at bottom of containers
- [x] Quick Actions simplified to horizontal icon row

### January 2026
- [x] **P1: AlertModal** - Replaced native selects with Radix UI Select components
- [x] **P2: Monochrome design** - Removed colored statuses from modals
- [x] **Tokens Page Redesign** - Complete restructure per product concept:
  - Removed "Top Tokens" hero section
  - Compact token header (ETH | $3,342 | Structure: Accumulation)
  - Two-column layout 60/40 (Supply & Holders | Market Behavior)
  - Removed all signals (bullish/bearish)
  - Collapsible Correlation section
  - Token = Validation layer, not signal layer
- [x] **P2: Monochrome design** - Removed colored statuses from:
  - NarrativesSidebar (gray badges instead of emerald/blue/yellow)
  - NarrativesModal (gray tokens, no gradients)
  - SmartMoneySnapshot (gray indicator dots)
  - SmartMoneyModal (gray status icons, black button)
  - MarketSignalCard (Bell/MapPin icons instead of emojis)
- [x] Fixed crash bug (missing X import in MarketDislocationCard.jsx)

### January 13, 2026 - Tokens Validation Layer Enhancement
- [x] **TOKEN INTELLIGENCE** - Added Market Alignment block
  - Shows connection to Market regime (Risk-On/Risk-Off)
  - Changed button text to "Create Token Alert" for clarity
- [x] **NET FLOW → FLOW→PRICE CONFIRMATION** - Complete redesign
  - Replaced abstract chart with decision-focused panel
  - 3 states: Accumulation Confirmed, Absorption, Distribution Risk
  - Added interpretation line
- [x] **HOLDER COMPOSITION** - Added Structure Insight
  - Added tooltips for clarity
  - Visual highlighting of changes
  - Structure insight interpretation
- [x] **SUPPLY FLOW** - Added Supply Impact
  - Detailed labels under values
  - Supply Impact interpretation
- [x] **BUY/SELL PRESSURE → MARKET PRESSURE BY COHORT** - Redesigned
  - Changed from abstract 50.8% to cohort-based visualization
  - Shows Retail/Pro/Inst/Whale actions separately
  - Added interpretation: "Dominant cohort"
- [x] **TRADE SIZE BREAKDOWN** - Enhanced
  - Added cohort icons
  - Added "Dominant Support" summary block
  - Improved tooltip
- [x] **SUGGESTED STRATEGIES** - Added transparency
  - Added "(Read-only)" marker
  - Status badges (Active/Inactive)
  - Trigger Conditions for each strategy
  - "View strategy logic" link
- [x] **Added tooltips** across all major blocks for user guidance

### January 13, 2026 - Critical UX Fixes (Alerts, Strategy Logic, Tooltips)
- [x] **ALERTS MODAL** - Implemented Token Alert creation
  - 3 fixed alert types: Structure Break, Divergence, Market Misalignment
  - Each alert shows triggers and description
  - UI-level implementation (backend coming soon)
- [x] **STRATEGY LOGIC MODAL** - Added strategy documentation
  - Shows Entry Conditions, Invalidation, Duration
  - Risk Level and Best For scenarios
  - Read-only documentation for transparency
- [x] **RADIX UI TOOLTIPS** - Replaced all title attributes
  - Flow → Price Confirmation tooltip
  - Holder Composition tooltip
  - Supply Flow Map tooltip
  - Market Pressure by Cohort tooltip
  - Trade Size Breakdown tooltip
  - Professional UX with proper Radix UI implementation

### January 13, 2026 - Wallets Page Refactoring (P0 COMPLETE ✅)
- [x] **WALLET INTELLIGENCE** - Top-level decision block
  - VERDICT (FOLLOW/AVOID) with Decision Score (85/100)
  - Decision Score formula tooltip (35% Reliability, 25% Low Risk, 25% PnL, 15% Alignment)
  - High Confidence badge
- [x] **WALLET STATE INDICATOR** - Current state tracking
  - Shows "Accumulation → Stable" state with period (last 14d)
  - Info tooltip explaining calculation basis
- [x] **WHY FOLLOW THIS WALLET** - Clear reasoning
  - Profitable over 6 months (+$549K realized)
  - Low systemic risk (12/100)
  - Aligned with current market regime
  - Warning for high frequency trading
- [x] **WHAT HAPPENS IF YOU FOLLOW** - Impact metrics
  - Avg Drawdown, Entry Delay, Expected Slippage
  - Replicability tooltip showing early vs late entry profit
- [x] **ACTION BUTTONS WITH TOOLTIPS**
  - Track Wallet: "Adds to Watchlist • Enables Alerts • Shows in Market"
  - Copy Signals: "Shows theoretical entry points based on wallet actions"
  - Alert on Changes: "State-based alerts only (not price-based)"
- [x] **ALERT MODAL** - 4 alert types
  - Behavioral Shift
  - Narrative Entry
  - Risk Threshold
  - Exit / Degradation Alert (NEW)
- [x] **EXIT / DEGRADATION ALERT** - Stop following signals
  - Shift from Accumulation → Distribution
  - PnL decay over rolling 14 days
  - Risk score ↑ +20 in 7 days
  - Sell pressure on top holdings
- [x] **TOP WALLETS GRID** - Enhanced display
  - Search by address/label
  - Filter by type (All, Smart Money, Whale, Fund)
  - "Why featured?" explanation for each wallet
- [x] **CORE METRICS** - FACT vs MODEL badges
  - PnL Summary (FACT)
  - Risk Score (FACT)
  - Dominant Strategy (MODEL)
- [x] **ADVANCED ANALYSIS** - Collapsible section
  - Token Alignment with interpretation
  - Strategy Suitability matching
- [x] **DETAILED ANALYTICS** - Collapsible sections
  - Behavior Fingerprint (unified horizontal layout)
  - Risk Deep Dive (Advanced Risk Flags)

## Prioritized Backlog

### P0 - Critical
- None currently

### P1 - High Priority
- **Backend Implementation** - Create backend to replace mocked frontend data:
  - Wallet Snapshot and Wallet State calculation
  - SmartMoneyScore formula
  - Risk scoring and activity classification
- **Track Wallet Functionality** - Connect to real watchlist feature
- Remove emojis from remaining components:
  - DecisionEngine.jsx
  - DecisionEngineCompact.jsx
  - SmartMoneyRadar.jsx
  - Portfolio.jsx
  - TokenDetail.jsx

### P2 - Medium Priority
- **Wallet Comparison Mode** - Side-by-side wallet comparison
- **Confidence Decay** - UI element showing score decay over time
- Structural separation of three product axes:
  1. Flow & Anomalies
  2. Smart Money Graph
  3. Narratives & Rotation

### P3 - Future
- Real data integration (APIs)
- Complete monochrome audit of all pages
- Mobile responsive improvements

## Tech Stack
- Frontend: React, Tailwind CSS, Recharts, Radix UI, Lucide Icons
- Backend: FastAPI, MongoDB (currently unused - all data mocked)
- UI Components: Shadcn/UI

## Key Files
- `/app/frontend/src/pages/WalletsPage.jsx` - Wallets page with decision tools
- `/app/frontend/src/pages/TokensPage.jsx` - Tokens validation layer
- `/app/frontend/src/pages/DashboardPage.jsx` - Main layout
- `/app/frontend/src/components/BehaviorFingerprint.jsx` - Wallet behavior analysis
- `/app/frontend/src/components/AdvancedRiskFlags.jsx` - Risk deep dive
- `/app/frontend/src/components/AlertModal.jsx` - Alert creation modal
- `/app/frontend/src/components/MarketDislocationCard.jsx` - Edge detection card

## Notes
- **ALL DATA IS MOCKED** - Frontend uses hardcoded mock data
- User prefers Russian language for communication
