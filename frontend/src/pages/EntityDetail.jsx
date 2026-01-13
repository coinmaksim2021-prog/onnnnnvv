import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronLeft, Wallet, Building, TrendingUp, TrendingDown, ExternalLink, Activity,
  ArrowUpRight, ArrowDownRight, PieChart, BarChart3, Users, Coins, AlertTriangle,
  Check, X, Info, ChevronDown, ChevronUp, Bell, Eye, Target, Zap
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart as RechartPie, Pie, Cell } from 'recharts';
import Header from '../components/Header';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

// Chart colors
const chartColors = {
  primary: '#374151',
  primaryLight: '#6B7280',
  secondary: '#9CA3AF',
  positive: '#374151',
  negative: '#9CA3AF',
};

const GlassCard = ({ children, className = "", hover = false }) => (
  <div className={`bg-white border border-gray-200 rounded-xl ${hover ? 'hover:border-gray-900 cursor-pointer' : ''} ${className}`}>
    {children}
  </div>
);

// Entity Intelligence Data (Decision Layer)
const getEntityIntelligence = (entityId) => {
  const data = {
    binance: {
      verdict: 'SUPPORTIVE',
      confidence: 82,
      verdictColor: 'bg-green-500/20 border-green-500/30 text-green-400',
      decisionScore: 78,
      state: 'Accumulating → Stable',
      statePeriod: 'last 7d',
      why: [
        { positive: true, text: 'Sustained net inflows over 7d (+$420M cumulative)' },
        { positive: true, text: 'Increased stablecoin reserves (+12%)' },
        { positive: true, text: 'No abnormal outflow spikes detected' },
        { positive: false, text: 'Minor BTC distribution detected (-$56M)' }
      ],
      marketImpact: {
        accumulatingTokens: ['ETH', 'SOL', 'ARB'],
        netFlowVsMarket: '+42%',
        leadTime: '~1.3 days',
        regimeAlignment: 'Risk-On'
      },
      tokenAlignment: [
        { token: 'ETH', status: 'Aligned', structure: 'Accumulation' },
        { token: 'SOL', status: 'Aligned', structure: 'Bullish' },
        { token: 'ARB', status: 'Aligned', structure: 'Supportive' }
      ]
    },
    coinbase: {
      verdict: 'NEUTRAL',
      confidence: 68,
      verdictColor: 'bg-gray-500/20 border-gray-500/30 text-gray-300',
      decisionScore: 62,
      state: 'Mixed → Rotating',
      statePeriod: 'last 7d',
      why: [
        { positive: true, text: 'Stable overall holdings' },
        { positive: false, text: 'Net outflow detected (-$45M 24h)' },
        { positive: true, text: 'Institutional custody remains strong' },
        { positive: false, text: 'Rotation between BTC and altcoins' }
      ],
      marketImpact: {
        accumulatingTokens: ['USDC', 'LINK'],
        netFlowVsMarket: '-8%',
        leadTime: '~0.5 days',
        regimeAlignment: 'Neutral'
      },
      tokenAlignment: [
        { token: 'ETH', status: 'Partial', structure: 'Mixed signals' },
        { token: 'BTC', status: 'Distributing', structure: 'Outflow' }
      ]
    }
  };
  return data[entityId] || data.binance;
};

// Alert types for Entity
const entityAlertTypes = [
  {
    id: 'net_flow_flip',
    name: 'Net Flow Flip',
    description: 'Alert when net flow direction changes',
    triggers: ['Net flow flips from positive to negative', 'Net flow flips from negative to positive'],
    icon: Activity
  },
  {
    id: 'token_exit',
    name: 'Token Exit',
    description: 'Alert when entity exits a position',
    triggers: ['Entity exits top-3 accumulated token', 'Large distribution detected'],
    icon: TrendingDown
  },
  {
    id: 'accumulation_start',
    name: 'Accumulation Start',
    description: 'Alert on new accumulation patterns',
    triggers: ['Entity starts accumulating token you track', 'New position opened'],
    icon: TrendingUp
  },
  {
    id: 'behavior_shift',
    name: 'Behavior Shift',
    description: 'Alert on entity behavior changes',
    triggers: ['Shift from Accumulating to Distributing', 'Activity pattern change'],
    icon: AlertTriangle
  }
];

// Entity Intelligence Header (Decision Layer)
const EntityIntelligence = ({ entity, intelligence, onTrack, onAlert, isTracked }) => {
  return (
    <div className="bg-gray-900 text-white rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Entity Intelligence</div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-bold">{intelligence.verdict}</span>
            <span className={`px-3 py-1 border rounded-lg text-sm font-semibold ${intelligence.verdictColor}`}>
              {intelligence.confidence >= 75 ? 'High Confidence' : intelligence.confidence >= 50 ? 'Moderate' : 'Low Confidence'}
            </span>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-2 mb-2">
            Decision Score: <span className="font-bold text-white">{intelligence.decisionScore}/100</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-0.5 hover:bg-white/10 rounded">
                  <Info className="w-3 h-3 text-gray-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
                <p className="font-semibold mb-2">Decision Score Formula:</p>
                <ul className="text-xs space-y-1">
                  <li>• 30% Net Flow Consistency</li>
                  <li>• 25% Holdings Stability</li>
                  <li>• 25% Market Alignment</li>
                  <li>• 20% Historical Reliability</li>
                </ul>
              </TooltipContent>
            </Tooltip>
            • {entity.type}
          </div>
          {/* Entity State */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Current State:</span>
            <span className="font-semibold text-white">{intelligence.state}</span>
            <span className="text-gray-500">({intelligence.statePeriod})</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-0.5 hover:bg-white/10 rounded">
                  <Info className="w-3 h-3 text-gray-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
                <p className="text-xs">Based on net flows, holdings changes, and transaction patterns across all entity addresses</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 mb-1">Confidence</div>
          <div className="text-3xl font-bold">{intelligence.confidence}<span className="text-xl text-gray-500">%</span></div>
          <div className="text-xs text-gray-400 mt-1">{entity.addressCount} addresses</div>
        </div>
      </div>

      {/* Why this verdict? */}
      <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Why This Verdict?</div>
        <div className="space-y-2 text-sm">
          {intelligence.why.map((reason, i) => (
            <div key={i} className="flex items-start gap-2">
              {reason.positive ? (
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              )}
              <span className={reason.positive ? 'text-white' : 'text-gray-300'}>{reason.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={onTrack}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isTracked 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isTracked ? <Check className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isTracked ? 'Tracking' : 'Track Entity'}
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
            <p className="text-xs">{isTracked ? 'Click to stop tracking' : 'Add to watchlist • Get alerts • See in Market activity'}</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={onAlert}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
            >
              <Bell className="w-4 h-4" />
              Alert on Changes
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
            <p className="text-xs">Get notified on net flow flips, token exits, and behavior shifts</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

// Entity Impact Engine (связь с Tokens и Market)
const EntityImpactEngine = ({ intelligence }) => {
  const { marketImpact, tokenAlignment } = intelligence;
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-gray-700" />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Entity Impact Engine</h3>
        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">MODEL</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-0.5 hover:bg-gray-100 rounded">
              <Info className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
            <p className="text-xs">Shows how this entity's activity impacts tokens and aligns with market regime</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Market Impact */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Market Impact</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Accumulating</span>
              <div className="flex items-center gap-2">
                {marketImpact.accumulatingTokens.map(token => (
                  <span key={token} className="px-2 py-0.5 bg-gray-900 text-white rounded text-xs font-semibold">{token}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Net Flow vs Market</span>
              <span className={`font-bold ${marketImpact.netFlowVsMarket.startsWith('+') ? 'text-gray-900' : 'text-gray-500'}`}>
                {marketImpact.netFlowVsMarket}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Historically Leads Market</span>
              <span className="font-bold text-gray-900">{marketImpact.leadTime}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Regime Alignment</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                marketImpact.regimeAlignment === 'Risk-On' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {marketImpact.regimeAlignment}
              </span>
            </div>
          </div>
        </div>

        {/* Token Alignment */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Token Alignment</div>
          <div className="space-y-2">
            {tokenAlignment.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{item.token}</span>
                  <span className="text-xs text-gray-500">{item.structure}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  item.status === 'Aligned' ? 'bg-gray-900 text-white' : 
                  item.status === 'Partial' ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 border border-gray-200 rounded-lg">
            <div className="text-xs text-gray-600">
              <span className="font-semibold">Insight:</span> Entity activity aligns with tokens showing confirmed bullish structure from Tokens page
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HoldingsBreakdown = ({ holdings }) => {
  const COLORS = ['#1F2937', '#374151', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB'];
  
  return (
    <GlassCard className="p-4 h-full">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Holdings Breakdown</h3>
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
              <RechartsTooltip formatter={(value) => `$${(value / 1e6).toFixed(1)}M`} />
            </RechartPie>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2 overflow-y-auto max-h-48">
          {holdings.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
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
  
  const NetflowTooltipContent = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const value = payload[0]?.value || 0;
    const isPositive = value >= 0;
    
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-white/10">
        <div className="text-xs text-gray-400 mb-1">{label}</div>
        <div className={`text-sm font-bold ${isPositive ? 'text-white' : 'text-gray-400'}`}>
          {isPositive ? '+' : ''}${(Math.abs(value) / 1e6).toFixed(1)}M
        </div>
      </div>
    );
  };
  
  return (
    <GlassCard className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Net Flow History</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-0.5 hover:bg-gray-100 rounded">
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
              <p className="text-xs">Net flow = Total inflows - Total outflows across all entity addresses</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {['24H', '7D', '30D'].map(p => (
            <button 
              key={p} 
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                period === p ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
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
              <linearGradient id="netflowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#374151" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#374151" stopOpacity={0.02} />
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
            <RechartsTooltip content={<NetflowTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey="netflow" 
              stroke="#374151"
              strokeWidth={2.5}
              fill="url(#netflowGradient)"
              dot={false}
              activeDot={{ r: 5, stroke: '#374151', strokeWidth: 2, fill: '#fff' }}
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
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
        Top {isAccumulated ? 'Accumulated' : 'Distributed'} (7d)
      </h3>
      <div className="space-y-2">
        {tokens.map((token, i) => (
          <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-400">#{i + 1}</span>
              <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" />
              <div>
                <div className="font-semibold text-gray-900">{token.symbol}</div>
                <div className="text-xs text-gray-500">{token.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold ${isAccumulated ? 'text-gray-900' : 'text-gray-500'}`}>
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
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Recent Transactions</h3>
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
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2 px-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                    tx.type === 'inflow' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
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

// Alert Modal
const EntityAlertModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-bold text-gray-900">Create Entity Alert</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Monitor entity behavior changes that impact tokens you track
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {entityAlertTypes.map((alert) => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className="p-4 border border-gray-200 rounded-xl hover:border-gray-900 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-900 transition-colors flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-600 group-hover:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{alert.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                    <ul className="space-y-0.5 text-xs text-gray-500">
                      {alert.triggers.map((trigger, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-gray-400">•</span>
                          <span className="line-clamp-1">{trigger}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
          <span className="font-medium">Note:</span> Entity alerts connect to your token watchlist — get notified when entity activity affects tokens you track.
        </div>
      </div>
    </div>
  );
};

export default function EntityDetail() {
  const { entityId } = useParams();
  const [entity, setEntity] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isTracked, setIsTracked] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);

  useEffect(() => {
    // Mock entity data
    const mockEntity = {
      id: entityId || 'binance',
      name: entityId === 'coinbase' ? 'Coinbase' : 'Binance',
      type: 'Exchange',
      typeColor: 'bg-gray-100 text-gray-700',
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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-xl font-semibold text-gray-600">Loading...</div>
    </div>
  );

  const intelligence = getEntityIntelligence(entityId || 'binance');

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Back navigation */}
        <div className="px-4 py-3">
          <Link to="/entities" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4" />
            Back to Entities
          </Link>
        </div>

        {/* Entity Basic Info */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <img src={entity.logo} alt={entity.name} className="w-16 h-16 rounded-2xl" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{entity.name}</h1>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${entity.typeColor}`}>
                  {entity.type.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600">{entity.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                <span>First seen: {entity.firstSeen}</span>
                <span>•</span>
                <span>{entity.addressCount} addresses</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Holdings</div>
              <div className="text-2xl font-bold text-gray-900">{entity.totalHoldings}</div>
              <div className={`text-xs font-semibold ${entity.holdingsChange >= 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                {entity.holdingsChange >= 0 ? '+' : ''}{entity.holdingsChange}% (7d)
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                Net Flow (24h)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-0.5 hover:bg-gray-200 rounded">
                      <Info className="w-3 h-3 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
                    <p className="text-xs">Net flow = Inflows - Outflows across all {entity.addressCount} entity addresses</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className={`text-2xl font-bold ${entity.netFlow24h >= 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                {entity.netFlow24h >= 0 ? '+' : ''}{entity.netFlow24hFormatted}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Market Share</div>
              <div className="text-2xl font-bold text-gray-900">{entity.marketShare}%</div>
            </div>
          </div>
        </div>

        {/* Entity Intelligence (Decision Layer) */}
        <div className="px-4">
          <EntityIntelligence 
            entity={entity} 
            intelligence={intelligence}
            onTrack={() => setIsTracked(!isTracked)}
            onAlert={() => setShowAlertModal(true)}
            isTracked={isTracked}
          />
        </div>

        {/* Entity Impact Engine */}
        <div className="px-4">
          <EntityImpactEngine intelligence={intelligence} />
        </div>

        {/* Core Metrics (always visible) */}
        <div className="px-4 pb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Core Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-[320px]"><HoldingsBreakdown holdings={entity.holdings} /></div>
            <div className="h-[320px]"><NetflowChart netflowData={entity.netflowData} /></div>
          </div>
        </div>

        {/* Advanced Analytics (collapsed by default) */}
        <div className="px-4 pb-4">
          <button
            onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors mb-4"
          >
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">Advanced Analytics</h2>
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">FACT</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {showAdvancedAnalytics ? 'Hide' : 'Show'}
              {showAdvancedAnalytics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showAdvancedAnalytics && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <TopAccumulated tokens={entity.accumulated} type="accumulated" />
                <TopAccumulated tokens={entity.distributed} type="distributed" />
              </div>

              <RecentTransactions transactions={entity.transactions} />
            </>
          )}
        </div>

        {/* Alert Modal */}
        {showAlertModal && <EntityAlertModal onClose={() => setShowAlertModal(false)} />}
      </div>
    </TooltipProvider>
  );
}
