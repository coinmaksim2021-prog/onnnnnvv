# Backend Implementation Guide

## Overview
Этот документ описывает требования к backend для Flow Intel platform.

---

## Data Sources (рекомендуемые)

### On-Chain Data
- **Etherscan API** — транзакции, балансы
- **Dune Analytics** — агрегированные запросы
- **The Graph** — indexed blockchain data
- **Alchemy/Infura** — RPC endpoints

### Market Data
- **CoinGecko/CoinMarketCap** — цены, market cap
- **DEX APIs** — Uniswap, 1inch

### Entity Labels
- **Arkham** — labeled addresses
- **Nansen** — entity tags
- **Custom labeling** — manual + heuristics

---

## Database Schema (MongoDB)

### entities
```javascript
{
  _id: ObjectId,
  entity_id: "binance",
  name: "Binance",
  type: "Exchange", // Exchange, Smart Money, Fund, Market Maker
  addresses: ["0x...", "0x..."],
  
  // Aggregated metrics (calculated)
  total_holdings_usd: 28400000000,
  net_flow_24h: 125000000,
  net_flow_7d: 420000000,
  market_share: 14.2,
  
  // State (calculated from flows)
  activity: "accumulating", // accumulating, distributing, rotating, holding
  confidence: 82,
  
  // Intelligence (model output)
  verdict: "SUPPORTIVE",
  decision_score: 78,
  state: "Accumulating → Stable",
  state_period: "7d",
  
  // Timestamps
  first_seen: ISODate,
  updated_at: ISODate
}
```

### bridge_clusters
```javascript
{
  _id: ObjectId,
  cluster_id: "A",
  timeframe: "24h", // 24h, 7d
  token: "ETH",
  direction: "accumulating",
  entities: ["binance", "kraken", "a16z"],
  strength: 85,
  confidence_boost: 12,
  reasons: ["Net flow alignment", "Similar timing"],
  created_at: ISODate,
  expires_at: ISODate
}
```

### wallets
```javascript
{
  _id: ObjectId,
  address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  label: "vitalik.eth",
  type: "Smart Money",
  
  // Intelligence
  verdict: "FOLLOW",
  confidence: 85,
  decision_score: 82,
  state: "Accumulation → Stable",
  state_period: "14d",
  
  // Metrics
  pnl_realized: 549000,
  pnl_unrealized: 123000,
  risk_score: 12,
  
  // Behavior
  dominant_strategy: "Early Narrative",
  avg_hold_time: "45 days",
  trade_frequency: "12 per month",
  
  // Holdings snapshot
  holdings: [
    { token: "ETH", amount: 15000, value_usd: 50000000 },
    { token: "ARB", amount: 500000, value_usd: 750000 }
  ],
  
  updated_at: ISODate
}
```

### tokens
```javascript
{
  _id: ObjectId,
  symbol: "ETH",
  name: "Ethereum",
  
  // Price
  price_usd: 3342,
  market_cap: 400000000000,
  
  // Structure
  structure: "Accumulation", // Accumulation, Distribution, Absorption
  structure_confidence: 78,
  
  // Holder composition (%)
  holder_composition: {
    retail: 32,
    pro: 28,
    institutional: 25,
    whale: 15
  },
  
  // Flow metrics
  flow: {
    cex_inflow_24h: -45000000,
    cex_outflow_24h: 67000000,
    dex_volume_24h: 890000000
  },
  
  // Alignment
  regime_alignment: "Risk-On",
  
  updated_at: ISODate
}
```

### alerts
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  
  // Target
  module: "entity", // entity, wallet, token
  target_id: "binance",
  
  // Alert type
  category: "impact", // structural, impact, cross_entity, behavioral
  type: "impact_threshold",
  
  // Configuration
  config: {
    threshold: 0.15,
    unit: "% of daily volume"
  },
  
  // Status
  active: true,
  triggered_count: 0,
  last_triggered: null,
  
  created_at: ISODate
}
```

### transactions
```javascript
{
  _id: ObjectId,
  tx_hash: "0x...",
  entity_id: "binance",
  
  type: "inflow", // inflow, outflow
  token: "ETH",
  amount_usd: 12500000,
  counterparty: "0x742d...",
  
  // Flags
  is_market_moving: true,
  is_first_entry: false,
  is_cross_entity: false,
  
  timestamp: ISODate
}
```

---

## Calculation Logic

### Entity Activity Classification
```python
def classify_entity_activity(entity, period="7d"):
    net_flow = entity.net_flow_7d
    holdings_change = entity.holdings_change_7d
    composition_change = entity.composition_change_7d
    
    if net_flow > 0 and holdings_change > 0:
        return "accumulating"
    elif net_flow < 0 and holdings_change < 0:
        return "distributing"
    elif abs(composition_change) > THRESHOLD:
        return "rotating"
    else:
        return "holding"
```

### Entity Confidence Score
```python
def calculate_entity_confidence(entity):
    # Consistency: % days with same direction
    consistency = count_consistent_days(entity, 7) / 7
    
    # Size: normalized flow size
    size = min(abs(entity.net_flow_7d) / MEDIAN_FLOW, 1.0)
    
    # Duration: consecutive days in same state
    duration = min(entity.consecutive_days / 14, 1.0)
    
    return int(
        consistency * 40 +
        size * 35 +
        duration * 25
    )
```

### Bridge Cluster Detection
```python
def detect_bridge_clusters(entities, timeframe="24h"):
    clusters = []
    
    # Group by token + direction
    groups = group_by_token_direction(entities)
    
    for (token, direction), group in groups.items():
        if len(group) < 2:
            continue
            
        # Check timing alignment
        aligned = [e for e in group if timing_aligned(e, timeframe)]
        
        if len(aligned) >= 2:
            strength = calculate_cluster_strength(aligned)
            if strength >= 40:
                clusters.append(BridgeCluster(
                    token=token,
                    direction=direction,
                    entities=[e.id for e in aligned],
                    strength=strength,
                    confidence_boost=len(aligned) * 3
                ))
    
    return clusters
```

### Token Impact Score
```python
def calculate_token_impact(entity, token):
    # Flow as % of market cap
    flow_pct = abs(entity.token_flow[token]) / token.market_cap * 100
    
    # Transaction frequency trend
    tx_trend = entity.tx_count_7d / entity.tx_count_30d
    
    # Historical correlation
    correlation = historical_price_correlation(entity, token)
    
    return normalize(
        flow_pct * 0.4 +
        tx_trend * 0.3 +
        correlation * 0.3
    )
```

### Wallet Decision Score
```python
def calculate_wallet_decision_score(wallet):
    # Reliability: win rate
    reliability = wallet.profitable_trades / wallet.total_trades
    
    # Risk: inverted risk score
    risk_factor = 1 - (wallet.risk_score / 100)
    
    # PnL consistency: Sharpe-like
    pnl_consistency = wallet.avg_monthly_pnl / wallet.pnl_stddev
    
    # Market alignment
    alignment = calculate_market_alignment(wallet)
    
    return int(
        reliability * 35 +
        risk_factor * 25 +
        pnl_consistency * 25 +
        alignment * 15
    )
```

---

## API Endpoints

### Entities
```
GET /api/entities
  Query: page, limit, type, search
  Response: { entities: [...], total, page }

GET /api/entities/{entity_id}
  Response: { entity, intelligence, token_impact, historical_effect }

GET /api/entities/bridge-clusters
  Query: timeframe (24h, 7d)
  Response: { clusters: [...] }
```

### Wallets
```
GET /api/wallets
  Query: page, limit, type, search
  Response: { wallets: [...], total }

GET /api/wallets/{address}
  Response: { wallet, intelligence, metrics, behavior }

GET /api/wallets/{address}/signals
  Query: limit
  Response: { signals: [...] }
```

### Tokens
```
GET /api/tokens/{symbol}
  Response: { token, structure, holders, flow, alignment }

GET /api/tokens/{symbol}/analytics
  Response: { detailed analytics }
```

### Alerts
```
POST /api/alerts
  Body: { module, target_id, category, type, config }
  Response: { alert }

GET /api/alerts
  Query: user_id
  Response: { alerts: [...] }

DELETE /api/alerts/{alert_id}
  Response: { success }
```

---

## Cron Jobs

### Every 5 minutes
- Update entity net flows
- Recalculate entity activity states
- Check alert triggers

### Every hour
- Recalculate confidence scores
- Detect bridge clusters
- Update wallet metrics

### Daily
- Calculate historical effects
- Update token structures
- Cleanup expired clusters

---

## Environment Variables

```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=flow_intel

# APIs
ETHERSCAN_API_KEY=xxx
COINGECKO_API_KEY=xxx
ALCHEMY_API_KEY=xxx

# Config
BRIDGE_CLUSTER_THRESHOLD=0.7
MARKET_MOVING_THRESHOLD=0.01
```

---

## Implementation Priority

### Phase 1 — Core Data
1. Entity CRUD + net flow calculation
2. Wallet CRUD + basic metrics
3. Token data from CoinGecko

### Phase 2 — Intelligence
1. Entity activity classification
2. Confidence scoring
3. Decision scores

### Phase 3 — Advanced
1. Bridge cluster detection
2. Historical effect statistics
3. Alert system

### Phase 4 — Real-time
1. WebSocket connections
2. Live updates
3. Alert notifications
