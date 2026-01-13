import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Wallet, TrendingUp, TrendingDown, Shield, AlertTriangle, ArrowUpRight } from 'lucide-react';
import Header from '../components/Header';
import { PageHeader, SectionHeader } from '../components/PageHeader';
import { InfoIcon } from '../components/Tooltip';
import PnLEngine from '../components/PnLEngine'; // UNIFIED: replaces CostBasisPnL + SwapsPnL
import BehaviorFingerprint from '../components/BehaviorFingerprint';
import AdvancedRiskFlags from '../components/AdvancedRiskFlags';

const GlassCard = ({ children, className = "", hover = false }) => (
  <div className={`glass-card ${hover ? 'glass-card-hover cursor-pointer' : ''} ${className}`}>
    {children}
  </div>
);

// Mock wallets data
const topWallets = [
  { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', label: 'Vitalik Buterin', type: 'Smart Money', balance: '$45.2M', pnl: '+27.4%', riskScore: 12 },
  { address: '0x28C6c06298d514Db089934071355E5743bf21d60', label: 'Binance Hot Wallet', type: 'Exchange', balance: '$2.8B', pnl: '+31.8%', riskScore: 5 },
  { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', label: 'Unknown Whale', type: 'Whale', balance: '$127.5M', pnl: '-6.4%', riskScore: 45 },
  { address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', label: 'a16z Crypto', type: 'Fund', balance: '$890.2M', pnl: '+26.3%', riskScore: 8 },
  { address: '0x1234567890abcdef1234567890abcdef12345678', label: 'DeFi Farmer', type: 'Smart Money', balance: '$8.9M', pnl: '+23.6%', riskScore: 22 },
  { address: '0xabcdef1234567890abcdef1234567890abcdef12', label: 'NFT Trader', type: 'Trader', balance: '$1.2M', pnl: '-15.0%', riskScore: 67 },
];

const typeBadgeColors = {
  'Smart Money': 'badge-purple',
  'Exchange': 'badge-blue',
  'Whale': 'badge-orange',
  'Fund': 'badge-green',
  'Trader': 'badge-gray',
};

export default function WalletsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedWallet, setSelectedWallet] = useState('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');

  const filteredWallets = topWallets.filter(wallet => {
    const matchesSearch = wallet.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wallet.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || wallet.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Header />
      
      <PageHeader 
        title="Wallet Intelligence"
        description="Analyze wallet behavior, PnL performance, risk scores, and trading patterns"
      />

      {/* Top Wallets Quick View */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader 
            title="Top Wallets" 
            description="Click to analyze"
          />
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by address or label..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="wallets-search-input"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-50/80 rounded-full p-1.5">
              {['all', 'Smart Money', 'Whale', 'Fund'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filterType === type ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 hover:bg-white/80'}`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredWallets.map((wallet) => (
            <Link
              key={wallet.address}
              to={`/portfolio/${wallet.address}`}
              className={`glass-card p-5 text-left transition-all hover-lift ${
                selectedWallet === wallet.address 
                  ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50/80 to-purple-50/40' 
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                      <Wallet className="w-6 h-6 text-white drop-shadow-sm" />
                    </div>
                    {selectedWallet === wallet.address && (
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{wallet.label}</div>
                    <code className="text-xs text-gray-500 font-mono">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</code>
                  </div>
                </div>
                <span className={`badge ${typeBadgeColors[wallet.type]}`}>{wallet.type}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Balance</div>
                  <div className="text-sm font-bold">{wallet.balance}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">PnL</div>
                  <div className={`text-sm font-bold ${wallet.pnl.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                    {wallet.pnl}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Risk</div>
                  <div className={`text-sm font-bold ${wallet.riskScore < 25 ? 'text-emerald-600' : wallet.riskScore < 50 ? 'text-orange-600' : 'text-red-600'}`}>
                    {wallet.riskScore}/100
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Wallet Analytics Components */}
      <div className="px-4 pb-8">
        {/* Row 1: Cost Basis PnL + Swaps PnL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-section-title">
                PnL Engine (All Sources)
              </h3>
              <InfoIcon 
                title="Unified PnL Engine"
                description="Combined FIFO cost-basis analysis across CEX deposits/withdrawals and DEX swaps. Tracks overall trading performance, positions, and profitability."
                data={[
                  { label: 'Total Trades', value: '468', color: 'white' },
                  { label: 'Win Rate', value: '66.8%', color: 'emerald' },
                  { label: 'Total PnL', value: '+$549K', color: 'emerald' },
                  { label: 'Profit Factor', value: '3.34x', color: 'orange' }
                ]}
                position="bottom"
              />
            </div>
            <PnLEngine address={selectedWallet} />
          </div>
        </div>

        {/* Row 2: Behavior Fingerprint + Advanced Risk Flags */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-section-title">
                Behavior Fingerprint
              </h3>
              <InfoIcon 
                title="Behavior Fingerprint"
                description="Machine learning-based wallet classification: analyzes trading patterns, DEX activity, DeFi farming, NFT trading, and holding behavior to identify wallet type and strategy."
                data={[
                  { label: 'Wallet Type', value: 'Smart Money Trader', color: 'purple' },
                  { label: 'Confidence', value: '87%', color: 'emerald' },
                  { label: 'Primary Activity', value: 'DEX Trading', color: 'blue' },
                  { label: 'Similar Wallets', value: '234 found', color: 'white' }
                ]}
                signal={{ 
                  type: 'strong', 
                  text: 'High confidence classification - consistent patterns detected',
                  emoji: '🎯'
                }}
                position="bottom"
              />
            </div>
            <BehaviorFingerprint address={selectedWallet} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-section-title">
                Advanced Risk Flags
              </h3>
              <InfoIcon 
                title="Advanced Risk Flags"
                description="Comprehensive risk assessment: sanctions exposure, mixer interactions, contract vulnerabilities, rug pull history, and dangerous token approvals. Score ranges 0-100 (higher = riskier)."
                data={[
                  { label: 'Risk Score', value: '23/100', color: 'emerald' },
                  { label: 'Sanctions', value: 'None', color: 'emerald' },
                  { label: 'Mixer Usage', value: 'No', color: 'emerald' },
                  { label: 'Risky Approvals', value: '2 found', color: 'orange' }
                ]}
                signal={{ 
                  type: 'weak', 
                  text: 'Low risk profile - minor approvals to review',
                  emoji: '✅'
                }}
                position="bottom"
              />
            </div>
            <AdvancedRiskFlags address={selectedWallet} />
          </div>
        </div>
      </div>
    </div>
  );
}
