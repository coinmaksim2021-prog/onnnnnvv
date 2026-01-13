# Changelog

All notable changes to Flow Intel project.

---

## [Session 2026-01-13] — Major Feature Release

### Entities Module — Complete Overhaul

#### Entity Intelligence (Decision Layer)
- Added SUPPORTIVE/NEUTRAL/CONCERNING verdict system
- Decision Score with formula tooltip (30% Net Flow + 25% Consistency + 20% Impact + 15% Historical + 10% Alignment)
- Current State indicator (Accumulating → Stable)
- "Why This Verdict?" block with positive/negative reasons

#### Action Panel — "What Should I Do?"
- ACTION BIAS primary recommendation
- Specific action items with icons (TrendingUp/TrendingDown/Clock)
- Optimal timing guidance
- Risk-adjusted disclaimer

#### Cross-Entity Context
- Shows aligned entities with similar behavior
- Confidence boost calculation (+12%, etc.)
- "X entities aligned → Signal strength increased" message

#### Token Impact Matrix
- Table: Token | Direction | Strength | Confidence | Impact Score
- Tooltips on all column headers
- Actionable Insight at bottom
- Impact Score formula explained

#### Historical Effect
- Condition-based statistics (e.g., "Net inflow > $100M in 24h")
- Metrics: % Market up, Avg lag, Median move
- Best Response recommendation
- Statistics badge (not prediction)

#### Bridge Logic
- View mode toggle: Default | Bridge
- Bridge Clusters block with clickable clusters
- Entity cards with cluster badges (A, B, C)
- Cluster filtering with description
- Coordinated behavior detection

#### Alert System (Categorized)
- Structural alerts: Structural Shift, Behavior Shift
- Impact-based alerts: Impact Threshold (with threshold config)
- Cross-Entity alerts: Cross-Entity Signal (NEW)

#### Pagination
- 9 items per page (3x3 grid)
- Teal-colored pagination controls
- "Showing X - Y out of Z" counter

### Wallets Module — Enhancements

#### Functional Modals
- Track Wallet: Toggle state with "Tracking" feedback
- Copy Signals: Modal with historical entry points (ARB, OP, PEPE examples)
- Alert Modal: 2x2 grid layout (compact)

#### Default Open Sections
- Advanced Analysis: open by default
- Detailed Analytics: open by default

### Header — Redesign

#### Layout
- Centered navigation (Market | Tokens | Wallets | Entities)
- Icons moved to right: Search, Watchlist (Eye), Alerts (Bell)
- Connect button: black (bg-gray-900), not gradient

#### Size
- Increased height with proper padding
- Glass card container with backdrop-blur
- Logo size: h-10

#### Features
- Search: expandable on click
- Alerts: red notification dot
- Tooltips on all icons

### Global Changes

#### Tooltips
- Added functional tooltips to all Entities blocks
- Token Impact Matrix column headers
- Historical Effect statistics
- Recent Transactions filters

#### UI Consistency
- All "collapse by default" sections now open by default
- Black/gray monochrome maintained
- Teal accent for pagination only

---

## [Previous Sessions] — Foundation

### Wallets Page (P0)
- Wallet Intelligence with FOLLOW/AVOID verdict
- Wallet State indicator
- Copy Signals modal
- Exit/Degradation alerts
- Behavior Fingerprint component

### Tokens Page
- Validation layer concept
- Flow → Price Confirmation
- Holder Composition
- Market Pressure by Cohort
- Suggested Strategies (read-only)

### Infrastructure
- React + Tailwind + Recharts
- Radix UI tooltips
- Shadcn/UI components
- FastAPI backend (unused, all mocked)
