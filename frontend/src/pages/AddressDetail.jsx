import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronLeft, Wallet, Shield, CheckCircle, AlertTriangle, Copy, ExternalLink,
  TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight, Clock, Filter
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import Header from '../components/Header';

const GlassCard = ({ children, className = "", hover = false }) => (
  <div className={`glass-card ${hover ? 'glass-card-hover' : ''} ${className}`}>
    {children}
  </div>
);

const AddressHeader = ({ addressData }) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(addressData.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 py-3">
      <GlassCard className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-3xl">
              {addressData.typeIcon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{addressData.label}</h1>
                {addressData.verified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${addressData.typeColor}`}>
                  {addressData.type.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <code className="text-sm text-gray-600 font-mono">{addressData.address}</code>
                <button onClick={copyAddress} className="p-1 hover:bg-gray-100 rounded">
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>
              {addressData.description && (
                <p className="text-sm text-gray-600">{addressData.description}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Balance</div>
              <div className="text-2xl font-bold text-gray-900">{addressData.totalBalance}</div>
              <div className={`text-xs font-semibold ${addressData.balanceChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {addressData.balanceChange >= 0 ? '+' : ''}{addressData.balanceChange}% (24h)
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Transactions</div>
              <div className="text-2xl font-bold text-gray-900">{addressData.txCount}</div>
              <div className="text-xs text-gray-500">First seen: {addressData.firstSeen}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Risk Score</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-gray-900">{addressData.riskScore}/100</div>
                {addressData.redFlags > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold">
                    <AlertTriangle className="w-3 h-3" />
                    {addressData.redFlags}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

const Holdings = ({ holdings }) => {
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
  
  return (
    <GlassCard className="p-4 h-full">
      <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Current Holdings</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={holdings}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {holdings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '11px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2">
          {holdings.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <img src={item.logo} alt={item.symbol} className="w-5 h-5 rounded-full" />
                <span className="font-semibold text-sm text-gray-900">{item.symbol}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">${item.value.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

const ActivityTimeline = ({ activities }) => {
  return (
    <GlassCard className="p-4 h-full">
      <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Recent Activity</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 p-2 hover:bg-gray-50/50 rounded-lg">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              activity.type === 'buy' ? 'bg-emerald-100' :
              activity.type === 'sell' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {activity.type === 'buy' ? <ArrowDownRight className="w-4 h-4 text-emerald-600" /> :
               activity.type === 'sell' ? <ArrowUpRight className="w-4 h-4 text-red-600" /> :
               <Activity className="w-4 h-4 text-blue-600" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900">{activity.action}</span>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
              <div className="text-xs text-gray-600">{activity.details}</div>
              <div className="text-xs font-semibold text-gray-900 mt-1">{activity.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

const TokenAccumulation = ({ tokenData }) => {
  return (
    <GlassCard className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase">Token Accumulation Trend</h3>
        <div className="flex gap-1">
          {['1W', '1M', '3M', 'ALL'].map(p => (
            <button key={p} className="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-600 rounded hover:bg-gray-200">{p}</button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={tokenData}>
            <defs>
              <linearGradient id="colorAccumulation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '10px' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '10px' }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '11px' }} />
            <Area type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorAccumulation)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

const TransactionHistory = ({ transactions }) => {
  const [filterType, setFilterType] = useState('all');
  
  const filteredTx = transactions.filter(tx => 
    filterType === 'all' || tx.type === filterType
  );

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase">Transaction History</h3>
        <div className="flex gap-2">
          {['all', 'buy', 'sell', 'transfer'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs font-medium rounded-lg ${
                filterType === type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase">Token</th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-500 uppercase">Value (USD)</th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase">From/To</th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-500 uppercase">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTx.map((tx, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-2 px-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                    tx.type === 'buy' ? 'bg-emerald-100 text-emerald-700' :
                    tx.type === 'sell' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {tx.type === 'buy' ? <ArrowDownRight className="w-3 h-3" /> :
                     tx.type === 'sell' ? <ArrowUpRight className="w-3 h-3" /> :
                     <Activity className="w-3 h-3" />}
                    {tx.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <img src={tx.tokenLogo} alt={tx.token} className="w-5 h-5 rounded-full" />
                    <span className="font-semibold">{tx.token}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-right font-semibold">{tx.amount}</td>
                <td className="py-2 px-3 text-right font-bold text-gray-900">{tx.valueUsd}</td>
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

export default function AddressDetail() {
  const { address } = useParams();
  const [addressData, setAddressData] = useState(null);

  useEffect(() => {
    // Mock data
    const mockData = {
      address: address || '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      label: 'Vitalik Buterin',
      type: 'influencer',
      typeIcon: '📢',
      typeColor: 'bg-purple-100 text-purple-700',
      verified: true,
      description: 'Co-founder of Ethereum. Active in DeFi and NFT space.',
      totalBalance: '$45.2M',
      balanceChange: 5.4,
      txCount: '1,247',
      firstSeen: 'Jul 2015',
      riskScore: 12,
      redFlags: 0,
    };

    const mockHoldings = [
      { symbol: 'ETH', value: 25000000, percentage: 55.3, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
      { symbol: 'USDC', value: 10000000, percentage: 22.1, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png' },
      { symbol: 'UNI', value: 5000000, percentage: 11.1, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png' },
      { symbol: 'AAVE', value: 3000000, percentage: 6.6, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png' },
      { symbol: 'Other', value: 2200000, percentage: 4.9, logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
    ];

    const mockActivities = [
      { type: 'buy', action: 'Bought UNI', details: 'Uniswap V3', amount: '$125,000', time: '2 hours ago' },
      { type: 'sell', action: 'Sold AAVE', details: 'Aave Protocol', amount: '$87,500', time: '5 hours ago' },
      { type: 'transfer', action: 'Transfer ETH', details: 'To 0x742d...', amount: '$50,000', time: '1 day ago' },
      { type: 'buy', action: 'Bought ETH', details: 'Uniswap V2', amount: '$200,000', time: '2 days ago' },
      { type: 'transfer', action: 'Received USDC', details: 'From Binance', amount: '$100,000', time: '3 days ago' },
    ];

    const mockTokenData = [
      { date: 'Week 1', amount: 1000 },
      { date: 'Week 2', amount: 1200 },
      { date: 'Week 3', amount: 1150 },
      { date: 'Week 4', amount: 1400 },
      { date: 'Week 5', amount: 1600 },
      { date: 'Week 6', amount: 1550 },
      { date: 'Week 7', amount: 1800 },
      { date: 'Week 8', amount: 2000 },
    ];

    const mockTransactions = [
      { type: 'buy', token: 'UNI', tokenLogo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png', amount: '1,250', valueUsd: '$125,000', counterparty: 'Uniswap V3', time: '2 hours ago' },
      { type: 'sell', token: 'AAVE', tokenLogo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png', amount: '450', valueUsd: '$87,500', counterparty: 'Aave Protocol', time: '5 hours ago' },
      { type: 'transfer', token: 'ETH', tokenLogo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', amount: '15', valueUsd: '$50,000', counterparty: '0x742d...f0bEb', time: '1 day ago' },
      { type: 'buy', token: 'ETH', tokenLogo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', amount: '60', valueUsd: '$200,000', counterparty: 'Uniswap V2', time: '2 days ago' },
      { type: 'transfer', token: 'USDC', tokenLogo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png', amount: '100,000', valueUsd: '$100,000', counterparty: 'Binance', time: '3 days ago' },
    ];

    setAddressData({ 
      ...mockData, 
      holdings: mockHoldings, 
      activities: mockActivities,
      tokenData: mockTokenData,
      transactions: mockTransactions
    });
  }, [address]);

  if (!addressData) return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center"><div className="text-xl font-semibold text-gray-600">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Header />
      <AddressHeader addressData={addressData} />
      
      <div className="px-4 pb-4 grid grid-cols-2 gap-4">
        <Holdings holdings={addressData.holdings} />
        <ActivityTimeline activities={addressData.activities} />
      </div>

      <div className="px-4 pb-4">
        <TokenAccumulation tokenData={addressData.tokenData} />
      </div>

      <div className="px-4 pb-4">
        <TransactionHistory transactions={addressData.transactions} />
      </div>
    </div>
  );
}
