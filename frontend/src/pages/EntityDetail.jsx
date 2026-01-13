import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronLeft, Wallet, Building, TrendingUp, TrendingDown, ExternalLink, Activity,
  ArrowUpRight, ArrowDownRight, PieChart, BarChart3, Users, Coins, AlertTriangle
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart as RechartPie, Pie, Cell } from 'recharts';
import Header from '../components/Header';
import { InfoIcon } from '../components/Tooltip';
import { WhyButton } from '../components/Explainability';
import DecisionEngine from '../components/DecisionEngine';

// Chart colors
const chartColors = {
  primary: '#00C9A7',
  primaryLight: '#4ADEC7',
  secondary: '#8B5CF6',
  positive: '#00C9A7',
  negative: '#FF6B8A',
};

const GlassCard = ({ children, className = "", hover = false }) => (
  <div className={`glass-card ${hover ? 'glass-card-hover' : ''} ${className}`}>
    {children}
  </div>
);

const EntityHeader = ({ entity }) => {
  // ENTITY BEHAVIOR STATE LOGIC
  const calculateBehaviorState = () => {
    const netFlow = entity.netFlow24h || 0;
    const holdingsChange = entity.holdingsChange || 0;
    
    let behaviorState = 'neutral';
    let confidence = 50;
    let reasons = [];

    if (netFlow > 10000000 && holdingsChange > 2) {
      behaviorState = 'accumulating';
      confidence = Math.min(95, 70 + Math.floor(holdingsChange * 5));
      reasons = [
        { icon: TrendingUp, text: `Net inflow: +$${(netFlow / 1e6).toFixed(1)}M (24h)`, detail: 'Strong buying activity' },
        { icon: Activity, text: `Holdings increased ${holdingsChange}% (7d)`, detail: 'Continuous accumulation trend' },
        { icon: Coins, text: `Active across ${entity.addressCount} addresses`, detail: 'Coordinated buying pattern' }
      ];
    } else if (netFlow < -10000000 || holdingsChange < -2) {
      behaviorState = 'distributing';
      confidence = Math.min(90, 70 + Math.abs(Math.floor(holdingsChange * 5)));
      reasons = [
        { icon: TrendingDown, text: `Net outflow: $${Math.abs(netFlow / 1e6).toFixed(1)}M (24h)`, detail: 'Taking profits' },
        { icon: AlertTriangle, text: `Holdings decreased ${Math.abs(holdingsChange)}% (7d)`, detail: 'Systematic selling' },
        { icon: Activity, text: 'Distribution across multiple wallets', detail: 'Coordinated exit strategy' }
      ];
    } else if (Math.abs(netFlow) > 5000000 && Math.abs(holdingsChange) < 1) {
      behaviorState = 'rotating';
      confidence = 65 + Math.floor(Math.random() * 15);
      reasons = [
        { icon: Activity, text: 'High transaction volume with stable holdings', detail: 'Portfolio rebalancing' },
        { icon: ArrowUpRight, text: `Net flow: $${(netFlow / 1e6).toFixed(1)}M`, detail: 'Moving between positions' },
        { icon: Coins, text: 'Token rotation pattern detected', detail: 'Sector rotation strategy' }
      ];
    } else {
      behaviorState = 'neutral';
      confidence = 55;
      reasons = [
        { icon: Activity, text: 'Low activity period', detail: 'Waiting for signals' },
        { icon: Wallet, text: `Holdings stable at ${entity.totalHoldings}`, detail: 'No significant changes' },
        { icon: TrendingUp, text: 'Monitor for pattern changes', detail: 'Ready to act on opportunities' }
      ];
    }

    return { behaviorState, confidence, reasons };
  };

  const behavior = calculateBehaviorState();

  // Helper to calculate days ago
  const calculateDaysAgo = (behavior) => {
    const days = Math.floor(Math.random() * 14) + 1;
    return behavior.behaviorState === 'neutral' ? 'monitoring' : `${days}d ago`;
  };

  // Behavior badge styling
  const getBehaviorBadge = () => {
    const badges = {
      accumulating: { label: 'ACCUMULATING', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: '📈' },
      distributing: { label: 'DISTRIBUTING', color: 'bg-red-100 text-red-700 border-red-300', icon: '📉' },
      rotating: { label: 'ROTATING', color: 'bg-orange-100 text-orange-700 border-orange-300', icon: '🔄' },
      neutral: { label: 'NEUTRAL', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: '⏸️' }
    };
    return badges[behavior.behaviorState];
  };

  const badge = getBehaviorBadge();

  return (
    <div className="px-4 py-3">
      <GlassCard className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <img src={entity.logo} alt={entity.name} className="w-16 h-16 rounded-2xl" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{entity.name}</h1>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${entity.typeColor}`}>
                  {entity.type.toUpperCase()}
                </span>
                {/* BEHAVIOR STATE BADGE */}
                <span className={`px-3 py-1 rounded-2xl text-xs font-bold border-2 ${badge.color}`}>
                  {badge.icon} {badge.label}
                </span>
                <span className="text-xs text-gray-500">
                  {behavior.confidence}% confidence
                </span>
                <WhyButton 
                  entityType={entity.type} 
                  entityName={entity.name}
                />
              </div>
              <p className="text-sm text-gray-600 mb-2">{entity.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>First seen: {entity.firstSeen}</span>
                <span>•</span>
                <span>{entity.addressCount} addresses</span>
                <span>•</span>
                <span className="font-semibold">Since {calculateDaysAgo(behavior)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-xs text-gray-500 mb-1">Total Holdings</div>
            <div className="text-2xl font-bold text-gray-900">{entity.totalHoldings}</div>
            <div className={`text-xs font-semibold ${entity.holdingsChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {entity.holdingsChange >= 0 ? '+' : ''}{entity.holdingsChange}% (7d)
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Net Flow (24h)</div>
            <div className={`text-2xl font-bold ${entity.netFlow24h >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {entity.netFlow24h >= 0 ? '+' : ''}{entity.netFlow24hFormatted}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Market Share</div>
            <div className="text-2xl font-bold text-gray-900">{entity.marketShare}%</div>
          </div>
        </div>
      </GlassCard>

      {/* DECISION ENGINE - Entity Behavior */}
      <div className="mt-4">
        <DecisionEngine 
          state={behavior.behaviorState === 'accumulating' ? 'bullish' : behavior.behaviorState === 'distributing' ? 'risky' : 'neutral'}
          confidence={behavior.confidence}
          reasons={behavior.reasons}
          entity={entity.name}
          compact={false}
        />
      </div>
    </div>
);
};

const HoldingsBreakdown = ({ holdings }) => {
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
  
  return (
    <GlassCard className="p-4 h-full">
      <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Holdings Breakdown</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RechartPie>
              <Pie
                data={holdings}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {holdings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${(value / 1e6).toFixed(1)}M`} />
            </RechartPie>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2 overflow-y-auto max-h-48">
          {holdings.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <img src={item.logo} alt={item.symbol} className="w-5 h-5 rounded-full" />
                <span className="font-semibold text-sm text-gray-900">{item.symbol}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">${(item.value / 1e6).toFixed(1)}M</div>
                <div className="text-xs text-gray-500">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

const NetflowChart = ({ netflowData }) => {
  const [period, setPeriod] = useState('7D');
  
  // Custom Tooltip
  const NetflowTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const value = payload[0]?.value || 0;
    const isPositive = value >= 0;
    
    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label">{label}</div>
        <div className="chart-tooltip-separator" />
        <div className="chart-tooltip-item">
          <span className="chart-tooltip-name">Net Flow</span>
          <span className="chart-tooltip-value" style={{ color: isPositive ? chartColors.positive : chartColors.negative }}>
            {isPositive ? '+' : ''}${(Math.abs(value) / 1e6).toFixed(1)}M
          </span>
        </div>
      </div>
    );
  };
  
  return (
    <GlassCard className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Net Flow History</h3>
        <div className="time-selector">
          {['24H', '7D', '30D'].map(p => (
            <button 
              key={p} 
              onClick={() => setPeriod(p)}
              className={`time-selector-btn ${period === p ? 'active' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={netflowData}>
            <defs>
              <linearGradient id="netflowPositiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.positive} stopOpacity={0.4} />
                <stop offset="100%" stopColor={chartColors.positive} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="netflowNegativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.negative} stopOpacity={0.4} />
                <stop offset="100%" stopColor={chartColors.negative} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="rgba(0,0,0,0.03)" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 500 }} 
              stroke="transparent"
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 500 }} 
              stroke="transparent"
              tickLine={false}
              tickFormatter={(v) => `${v > 0 ? '+' : ''}${(v/1e6).toFixed(0)}M`}
              width={55}
            />
            <Tooltip content={<NetflowTooltip />} />
            <Area 
              type="monotone" 
              dataKey="netflow" 
              stroke={chartColors.primary}
              strokeWidth={2.5}
              fill="url(#netflowPositiveGradient)"
              dot={false}
              activeDot={{ r: 5, stroke: chartColors.primary, strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

const TopAccumulated = ({ tokens, type }) => {
  const isAccumulated = type === 'accumulated';
  
  return (
    <GlassCard className="p-4 h-full">
      <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">
        Top {isAccumulated ? 'Accumulated' : 'Distributed'} (7d)
      </h3>
      <div className="space-y-2">
        {tokens.map((token, i) => (
          <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50/50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-400">#{i + 1}</span>
              <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" />
              <div>
                <div className="font-semibold text-gray-900">{token.symbol}</div>
                <div className="text-xs text-gray-500">{token.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold ${isAccumulated ? 'text-emerald-600' : 'text-red-600'}`}>
                {isAccumulated ? '+' : '-'}${(token.amount / 1e6).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500">{token.transactions} txns</div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

const RecentTransactions = ({ transactions }) => {
  return (
    <GlassCard className="p-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Recent Transactions</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase">Token</th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase">Counterparty</th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-500 uppercase">Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-2 px-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                    tx.type === 'inflow' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {tx.type === 'inflow' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                    {tx.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <img src={tx.logo} alt={tx.token} className="w-5 h-5 rounded-full" />
                    <span className="font-semibold">{tx.token}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-right font-bold text-gray-900">{tx.amount}</td>
                <td className="py-2 px-3">
                  <code className="text-xs text-gray-600">{tx.counterparty}</code>
                </td>
                <td className="py-2 px-3 text-right text-xs text-gray-500">{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default function EntityDetail() {
  const { entityId } = useParams();
  const [entity, setEntity] = useState(null);

  useEffect(() => {
    // Mock entity data
    const mockEntity = {
      id: entityId || 'binance',
      name: entityId === 'coinbase' ? 'Coinbase' : 'Binance',
      type: 'Exchange',
      typeColor: 'bg-emerald-100 text-emerald-700',
      logo: entityId === 'coinbase' 
        ? 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/89.png'
        : 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
      description: entityId === 'coinbase' 
        ? 'US-based cryptocurrency exchange, publicly traded (COIN)'
        : 'World\'s largest cryptocurrency exchange by trading volume',
      firstSeen: 'Jul 2017',
      addressCount: 1247,
      totalHoldings: '$28.4B',
      holdingsChange: 2.4,
      netFlow24h: 125000000,
      netFlow24hFormatted: '$125M',
      marketShare: 14.2,
    };

    const mockHoldings = [
      { symbol: 'BTC', name: 'Bitcoin', value: 12500000000, percentage: 44.0, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
      { symbol: 'ETH', name: 'Ethereum', value: 8900000000, percentage: 31.3, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
      { symbol: 'USDT', name: 'Tether', value: 3400000000, percentage: 12.0, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png' },
      { symbol: 'BNB', name: 'BNB', value: 2100000000, percentage: 7.4, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png' },
      { symbol: 'SOL', name: 'Solana', value: 890000000, percentage: 3.1, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
      { symbol: 'Other', name: 'Other', value: 610000000, percentage: 2.2, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
    ];

    const mockNetflow = [
      { date: 'Mon', netflow: 45000000 },
      { date: 'Tue', netflow: -23000000 },
      { date: 'Wed', netflow: 67000000 },
      { date: 'Thu', netflow: 12000000 },
      { date: 'Fri', netflow: -34000000 },
      { date: 'Sat', netflow: 89000000 },
      { date: 'Sun', netflow: 125000000 },
    ];

    const mockAccumulated = [
      { symbol: 'ETH', name: 'Ethereum', amount: 89000000, transactions: 1247, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
      { symbol: 'SOL', name: 'Solana', amount: 45000000, transactions: 892, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
      { symbol: 'ARB', name: 'Arbitrum', amount: 23000000, transactions: 456, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png' },
      { symbol: 'LINK', name: 'Chainlink', amount: 12000000, transactions: 234, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png' },
    ];

    const mockDistributed = [
      { symbol: 'BTC', name: 'Bitcoin', amount: 56000000, transactions: 567, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
      { symbol: 'USDT', name: 'Tether', amount: 34000000, transactions: 1234, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png' },
      { symbol: 'MATIC', name: 'Polygon', amount: 18000000, transactions: 345, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png' },
      { symbol: 'AVAX', name: 'Avalanche', amount: 9000000, transactions: 123, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png' },
    ];

    const mockTransactions = [
      { type: 'inflow', token: 'ETH', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', amount: '$12.5M', counterparty: '0x742d...f0bEb', time: '2m ago' },
      { type: 'outflow', token: 'BTC', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', amount: '$8.9M', counterparty: '0x1bc9...7f8a', time: '15m ago' },
      { type: 'inflow', token: 'SOL', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png', amount: '$4.2M', counterparty: '0xa3f8...e2d4', time: '32m ago' },
      { type: 'outflow', token: 'USDT', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png', amount: '$2.1M', counterparty: '0x5678...abcd', time: '1h ago' },
      { type: 'inflow', token: 'ARB', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png', amount: '$1.8M', counterparty: '0x9abc...ijkl', time: '2h ago' },
    ];

    setEntity({
      ...mockEntity,
      holdings: mockHoldings,
      netflowData: mockNetflow,
      accumulated: mockAccumulated,
      distributed: mockDistributed,
      transactions: mockTransactions,
    });
  }, [entityId]);

  if (!entity) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
      <div className="text-xl font-semibold text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Header />
      <EntityHeader entity={entity} />
      
      <div className="px-4 pb-4 grid grid-cols-2 gap-4">
        <div className="h-[320px]"><HoldingsBreakdown holdings={entity.holdings} /></div>
        <div className="h-[320px]"><NetflowChart netflowData={entity.netflowData} /></div>
      </div>

      <div className="px-4 pb-4 grid grid-cols-2 gap-4">
        <TopAccumulated tokens={entity.accumulated} type="accumulated" />
        <TopAccumulated tokens={entity.distributed} type="distributed" />
      </div>

      <div className="px-4 pb-4">
        <RecentTransactions transactions={entity.transactions} />
      </div>
    </div>
  );
}
