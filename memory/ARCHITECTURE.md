# Flow Intel - Crypto Analytics Platform

## Project Vision
**"От данных к решениям"** — превратить сырую on-chain аналитику в actionable insights для трейдеров.

### Ключевая идея
Не показывать "что происходит", а объяснять "что это значит для ТЕБЯ и что делать".

---

## Product Architecture

### 4 Основных модуля

```
┌─────────────────────────────────────────────────────────────┐
│                         MARKET                               │
│  Общий обзор рынка, режимы (Risk-On/Risk-Off), аномалии     │
└─────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│     TOKENS      │  │    WALLETS      │  │    ENTITIES     │
│ Validation Layer│  │  Decision Layer │  │  Impact Engine  │
│                 │  │                 │  │                 │
│ • Structure     │  │ • FOLLOW/AVOID  │  │ • Coordinated   │
│ • Confirmation  │  │ • Confidence    │  │   behavior      │
│ • Alignment     │  │ • Copy Signals  │  │ • Bridge Clusters│
└─────────────────┘  └─────────────────┘  └─────────────────┘
           │                    │                    │
           └────────────────────┴────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │     ALERTS      │
                    │ Unified System  │
                    └─────────────────┘
```

---

## Module Details

### 1. TOKENS — Validation Layer (не Signal Layer!)

**Концепция:** Token = место для ПОДТВЕРЖДЕНИЯ гипотезы, а не источник сигналов.

**Ключевые блоки:**
| Блок | Назначение | Данные |
|------|------------|--------|
| Token Header | Быстрый статус | Price, Structure (Accumulation/Distribution) |
| Flow → Price Confirmation | Подтверждение структуры | Accumulation Confirmed / Absorption / Distribution Risk |
| Holder Composition | Кто держит | Retail %, Pro %, Inst %, Whale % + изменения |
| Supply Flow Map | Куда идёт supply | CEX In/Out, DEX, Bridges |
| Market Pressure by Cohort | Кто давит | Buy/Sell pressure по когортам |
| Trade Size Breakdown | Объёмы по размерам | Small/Medium/Large + Dominant Support |
| Market Alignment | Связь с режимом рынка | Risk-On/Risk-Off alignment |
| Suggested Strategies | Read-only стратегии | Trigger Conditions, Risk Level |

**Alerts (Token):**
- Structure Break — смена структуры
- Divergence — flow/price расхождение
- Market Misalignment — рассинхрон с рынком

---

### 2. WALLETS — Decision Layer

**Концепция:** Wallet = инструмент принятия решений FOLLOW/AVOID.

**Decision Flow:**
```
Wallet Data → Intelligence → Verdict → Action
                  │
                  ├── FOLLOW (зелёный)
                  ├── NEUTRAL (серый)
                  └── AVOID (красный)
```

**Ключевые блоки:**
| Блок | Назначение | Формула/Данные |
|------|------------|----------------|
| Wallet Intelligence | Verdict + Confidence | Decision Score = 35% Reliability + 25% Low Risk + 25% PnL + 15% Alignment |
| Wallet State | Текущее состояние | Accumulating / Distributing / Rotating / Dormant |
| Why Follow/Avoid | Обоснование | Факты + предупреждения |
| What Happens If You Follow | Последствия | Avg Drawdown, Entry Delay, Slippage, Replicability |
| Copy Signals | Read-only entry points | Исторические сделки кошелька |
| Core Metrics | FACT данные | PnL, Risk Score, Holdings |
| Behavior Fingerprint | Профиль активности | Radar chart поведения |

**Alerts (Wallet):**
- Behavioral Shift — смена поведения
- Narrative Entry — вход в нарратив
- Risk Threshold — превышение риска
- Exit / Degradation — сигнал на выход

---

### 3. ENTITIES — Impact Engine

**Концепция:** Entity = группа адресов (биржа, фонд, маркетмейкер). Показываем ВЛИЯНИЕ на рынок.

**Ключевое отличие от конкурентов (Arkham, Nansen):**
- Не просто "что у них есть", а "что это значит для рынка"
- Агрегация влияния нескольких entities (Bridge Logic)

**Ключевые блоки:**
| Блок | Назначение | Формула/Данные |
|------|------------|----------------|
| Entity Intelligence | Verdict + Confidence | SUPPORTIVE / NEUTRAL / CONCERNING |
| What Should I Do? | Action Panel | Конкретные действия: Accumulate ETH, Reduce BTC, Wait |
| Cross-Entity Context | Aligned entities | Кто ведёт себя похоже + Confidence boost |
| Token Impact Matrix | Влияние на токены | Token, Direction, Strength, Confidence, Impact Score |
| Historical Effect | Статистика паттернов | % market up, Avg lag, Median move, Best Response |
| Recent Transactions | Фильтруемые TX | Market-Moving, First Entry, Cross-Entity flags |

**Bridge Logic (критически важно!):**
```
Bridge Cluster = группа entities с:
  • Одинаковым токеном
  • Одинаковым направлением (accumulating/distributing)
  • Похожим timing
  • Aligned flow patterns

Формула включения в кластер:
bridge_score = 
  token_score * 0.4 +
  direction_score * 0.4 +
  timing_score * 0.2

Если bridge_score > 0.7 → entity в кластере
```

**Alerts (Entity):**
- Structural — Accumulation→Distribution shift
- Impact-based — Net flow > threshold
- Cross-Entity — 2+ entities aligned

---

### 4. ALERTS — Unified System

**Типы алертов по модулям:**

| Модуль | Alert Types |
|--------|-------------|
| Token | Structure Break, Divergence, Market Misalignment |
| Wallet | Behavioral Shift, Narrative Entry, Risk Threshold, Exit/Degradation |
| Entity | Structural Shift, Impact Threshold, Cross-Entity Signal, Behavior Shift |

**Принцип:** Alerts = автоматический мониторинг, не требующий ручного трекинга.

---

## Backend Requirements

### Data Models

#### Entity
```python
class Entity:
    entity_id: str
    name: str
    type: Literal["Exchange", "Smart Money", "Fund", "Market Maker"]
    addresses: List[str]
    
    # Calculated
    total_holdings_usd: float
    net_flow_24h: float
    net_flow_7d: float
    market_share: float
    
    # State
    activity: Literal["accumulating", "distributing", "rotating", "holding"]
    confidence: int  # 0-100
    
    # Bridge
    cluster_id: Optional[str]
```

#### BridgeCluster
```python
class BridgeCluster:
    cluster_id: str
    timeframe: Literal["24h", "7d"]
    token: str
    direction: Literal["accumulating", "distributing", "rotating"]
    entities: List[str]
    strength: int  # 0-100
    confidence_boost: int
    reasons: List[str]
```

#### Wallet
```python
class Wallet:
    address: str
    label: Optional[str]
    type: Literal["Smart Money", "Whale", "Fund", "Retail"]
    
    # Intelligence
    verdict: Literal["FOLLOW", "NEUTRAL", "AVOID"]
    confidence: int
    decision_score: int
    
    # State
    state: str  # "Accumulating → Stable"
    state_period: str  # "last 14d"
    
    # Metrics
    pnl_realized: float
    pnl_unrealized: float
    risk_score: int
    
    # Behavior
    dominant_strategy: str
    avg_hold_time: str
    trade_frequency: str
```

#### TokenAnalytics
```python
class TokenAnalytics:
    token: str
    price: float
    
    # Structure
    structure: Literal["Accumulation", "Distribution", "Absorption"]
    structure_confidence: int
    
    # Holder Composition
    retail_pct: float
    pro_pct: float
    inst_pct: float
    whale_pct: float
    
    # Flow
    cex_inflow: float
    cex_outflow: float
    dex_volume: float
    
    # Market Alignment
    regime_alignment: Literal["Risk-On", "Risk-Off", "Neutral"]
```

### Scoring Formulas

#### Entity Score
```python
def calculate_entity_score(entity):
    return (
        0.30 * net_flow_strength(entity) +
        0.25 * consistency_score(entity) +  # 7d vs 30d
        0.20 * token_impact_score(entity) +
        0.15 * historical_effect_score(entity) +
        0.10 * regime_alignment_score(entity)
    )
```

#### Wallet Decision Score
```python
def calculate_decision_score(wallet):
    return (
        0.35 * reliability_score(wallet) +
        0.25 * risk_score_inverted(wallet) +
        0.25 * pnl_consistency(wallet) +
        0.15 * market_alignment(wallet)
    )
```

#### Bridge Score
```python
def calculate_bridge_score(entity, cluster):
    token_match = 1 if entity.token == cluster.token else 0
    direction_match = 1 if sign(entity.net_flow) == sign(cluster.direction) else 0
    timing_match = 1 if abs(entity.peak_time - cluster.peak_time) < threshold else 0
    
    return (
        token_match * 0.4 +
        direction_match * 0.4 +
        timing_match * 0.2
    )
```

#### Token Impact Score
```python
def calculate_token_impact(entity, token):
    return (
        (entity.flow_in_token / token.market_cap) +
        (entity.tx_frequency_trend) +
        (historical_correlation(entity, token))
    )
```

### API Endpoints (Required)

```
# Entities
GET  /api/entities                    # List with pagination
GET  /api/entities/{id}               # Detail with intelligence
GET  /api/entities/bridge-clusters    # Bridge clusters

# Wallets
GET  /api/wallets                     # List with filters
GET  /api/wallets/{address}           # Detail with intelligence
GET  /api/wallets/{address}/signals   # Copy signals history

# Tokens
GET  /api/tokens/{symbol}/analytics   # Full analytics
GET  /api/tokens/{symbol}/flow        # Flow confirmation

# Alerts
POST /api/alerts                      # Create alert
GET  /api/alerts                      # List user alerts
DELETE /api/alerts/{id}               # Delete alert
```

---

## File Structure

```
/app/frontend/src/
├── components/
│   ├── Header.jsx                    # Main navigation
│   ├── BehaviorFingerprint.jsx       # Wallet behavior radar
│   ├── AdvancedRiskFlags.jsx         # Risk deep dive
│   ├── AlertModal.jsx                # Alert creation
│   └── ui/                           # Shadcn components
│
├── pages/
│   ├── DashboardPage.jsx             # Market overview
│   ├── TokensPage.jsx                # Token validation layer
│   ├── WalletsPage.jsx               # Wallet decision layer
│   ├── EntitiesPage.jsx              # Entity list + Bridge
│   ├── EntityDetail.jsx              # Entity impact engine
│   ├── Watchlist.jsx                 # User watchlist
│   └── AlertsPage.jsx                # User alerts
│
/app/backend/
├── server.py                         # FastAPI main
├── models/                           # Pydantic models (TODO)
├── routes/                           # API routes (TODO)
└── services/                         # Business logic (TODO)

/app/memory/
├── PRD.md                            # Product requirements
├── ARCHITECTURE.md                   # This file
└── CHANGELOG.md                      # Version history
```

---

## UI/UX Principles

### Design System
- **Colors:** Monochrome (gray-900, gray-700, gray-500, gray-100) + purposeful accents
- **Typography:** Inter/System, semibold for labels, bold for values
- **Spacing:** Generous padding (p-4, p-5, p-6)
- **Cards:** rounded-xl/2xl, subtle borders, hover states
- **Icons:** Lucide React only, no emojis

### Information Hierarchy
1. **Verdict/Decision** — самое крупное, сразу видно
2. **Confidence/Score** — рядом с verdict
3. **Why** — обоснование под verdict
4. **Details** — collapsible по умолчанию ОТКРЫТО

### Interaction Patterns
- **Tooltips** — на каждом значимом элементе (Radix UI)
- **Modals** — для создания alerts, просмотра деталей
- **Filters** — pill-style buttons, active = black
- **Pagination** — teal accent, "Showing X-Y out of Z"

---

## Current State

### ✅ Implemented (Frontend)
- [x] Tokens page — validation layer
- [x] Wallets page — decision layer с FOLLOW/AVOID
- [x] Entities page — impact engine + Bridge Logic
- [x] Header — compact, centered nav, icons right
- [x] Alert modals — all modules
- [x] Tooltips — comprehensive coverage

### ⚠️ Mocked (Need Backend)
- [ ] All data is hardcoded in React components
- [ ] No real API calls
- [ ] No persistence (alerts, watchlist)
- [ ] No real-time updates

### 🔜 Next Steps
1. Backend API implementation
2. Real data integration
3. WebSocket for real-time updates
4. User authentication
5. Alert notification system

---

## Notes
- User language: Russian
- All data currently MOCKED
- Focus on decision support, not predictions
- "Not financial advice" disclaimers required
