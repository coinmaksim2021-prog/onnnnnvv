# Flow Intel — Product Requirements Document

## Vision
**"От данных к решениям"** — crypto analytics platform превращающая on-chain данные в actionable insights.

---

## Core Concept

### Проблема
Существующие инструменты (Arkham, Nansen, DeBank) показывают ЧТО происходит, но не объясняют ЧТО ДЕЛАТЬ.

### Решение
Каждый модуль имеет Decision Layer — конкретный verdict и рекомендации.

### Принцип
```
Data → Intelligence → Verdict → User Action
```

---

## Product Modules

### 1. MARKET (/)
- Общий обзор рынка
- Режимы: Risk-On / Risk-Off
- Аномалии и дислокации

### 2. TOKENS (/tokens)
**Концепция:** Validation Layer — место подтверждения гипотезы, не источник сигналов.

**Блоки:**
- Token Header (price, structure)
- Flow → Price Confirmation
- Holder Composition
- Supply Flow Map
- Market Pressure by Cohort
- Trade Size Breakdown
- Market Alignment
- Suggested Strategies (read-only)

### 3. WALLETS (/wallets)
**Концепция:** Decision Layer — FOLLOW/AVOID verdict.

**Блоки:**
- Wallet Intelligence (verdict, confidence, decision score)
- Wallet State (Accumulating/Distributing/etc.)
- Why Follow/Avoid
- What Happens If You Follow
- Action Buttons (Track, Copy Signals, Alert)
- Core Metrics (PnL, Risk, Holdings)
- Advanced Analysis (Token Alignment, Strategy Suitability)
- Detailed Analytics (Behavior Fingerprint, Risk Deep Dive)

### 4. ENTITIES (/entities, /entity/:id)
**Концепция:** Impact Engine — влияние на рынок + координированное поведение.

**List Page:**
- Entity cards с badges (activity, confidence)
- Filters (type, search)
- Bridge Mode toggle
- Bridge Clusters block
- Pagination (9 per page)

**Detail Page:**
- Entity Intelligence (verdict, score)
- What Should I Do? (Action Panel)
- Cross-Entity Context
- Token Impact Matrix
- Historical Effect
- Core Metrics (Holdings, Net Flow)
- Recent Transactions (with filters)

---

## Key Features

### Bridge Logic
Выявление координированного поведения entities:
- Clusters по токену + направлению + timing
- Visual badges на карточках
- Click-to-filter по кластеру
- Confidence boost calculation

### Decision Scores
Формулы для всех verdicts:

**Entity Score:**
```
30% Net Flow Strength
25% Consistency (7d vs 30d)
20% Token Impact
15% Historical Effect
10% Regime Alignment
```

**Wallet Decision Score:**
```
35% Reliability
25% Low Risk
25% PnL Consistency
15% Market Alignment
```

### Alert System
Категории:
- **Structural** — изменения структуры
- **Impact-based** — превышение порогов
- **Cross-Entity** — координированные сигналы
- **Behavioral** — изменения поведения

---

## UI/UX Requirements

### Design System
- Colors: Monochrome (grays) + purposeful accents
- No emojis — Lucide icons only
- Typography: System/Inter, semibold labels, bold values
- Cards: rounded-xl/2xl, hover states
- Spacing: generous (p-4 to p-6)

### Header
- Centered navigation pills
- Right: Search, Watchlist, Alerts icons
- Connect button: black (bg-gray-900)
- Glass card container with blur

### Information Hierarchy
1. Verdict/Decision — largest
2. Confidence/Score — beside verdict
3. Why — justification below
4. Details — collapsible, open by default

### Tooltips
- Required on all significant elements
- Radix UI implementation
- Dark background, white text

---

## Technical Stack

### Frontend
- React 18
- Tailwind CSS
- Recharts (charts)
- Radix UI (tooltips, modals)
- Lucide React (icons)
- Shadcn/UI (base components)

### Backend (TODO)
- FastAPI (Python)
- MongoDB
- WebSocket (real-time)

---

## File Structure

```
/app/frontend/src/
├── pages/
│   ├── DashboardPage.jsx      # Market
│   ├── TokensPage.jsx         # Tokens
│   ├── WalletsPage.jsx        # Wallets
│   ├── EntitiesPage.jsx       # Entity list + Bridge
│   └── EntityDetail.jsx       # Entity detail
├── components/
│   ├── Header.jsx             # Navigation
│   └── ui/                    # Shadcn
```

---

## Implementation Status

### ✅ Completed
- [x] Tokens page — validation layer
- [x] Wallets page — decision layer
- [x] Entities page — impact engine
- [x] Bridge Logic — coordinated behavior
- [x] Header — compact centered design
- [x] Alert modals — all modules
- [x] Tooltips — comprehensive

### ⚠️ Mocked
- All data hardcoded in components
- No real API calls
- No persistence

### 🔜 TODO (Backend)
- [ ] API endpoints
- [ ] Data models
- [ ] Scoring calculations
- [ ] Real-time updates
- [ ] Alert notifications
- [ ] User authentication

---

## Related Documents
- `/app/memory/ARCHITECTURE.md` — Technical architecture & backend specs
- `/app/memory/CHANGELOG.md` — Version history

---

## Notes
- User language: Russian
- ALL DATA IS MOCKED
- Decision support, not financial advice
