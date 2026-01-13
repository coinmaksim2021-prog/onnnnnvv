import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Wallet, TrendingUp, TrendingDown, Shield, AlertTriangle, ArrowUpRight,
  Activity, Check, Bell, Eye, Info, X, Zap, Target, Clock
} from 'lucide-react';
import Header from '../components/Header';
import { PageHeader, SectionHeader } from '../components/PageHeader';
import { InfoIcon } from '../components/Tooltip';
import PnLEngine from '../components/PnLEngine'; // UNIFIED: replaces CostBasisPnL + SwapsPnL
import BehaviorFingerprint from '../components/BehaviorFingerprint';
import AdvancedRiskFlags from '../components/AdvancedRiskFlags';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

const GlassCard = ({ children, className = "", hover = false }) => (
  <div className={`glass-card ${hover ? 'glass-card-hover cursor-pointer' : ''} ${className}`}>
    {children}
  </div>
);

// Mock wallets data
const topWallets = [
  { 
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 
    label: 'Vitalik Buterin', 
    type: 'Smart Money', 
    balance: '$45.2M', 
    pnl: '+27.4%', 
    riskScore: 12,
    whyFeatured: 'Accumulating L2 tokens during bullish regime'
  },
  { 
    address: '0x28C6c06298d514Db089934071355E5743bf21d60', 
    label: 'Binance Hot Wallet', 
    type: 'Exchange', 
    balance: '$2.8B', 
    pnl: '+31.8%', 
    riskScore: 5,
    whyFeatured: 'High volume institutional accumulation'
  },
  { 
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 
    label: 'Unknown Whale', 
    type: 'Whale', 
    balance: '$127.5M', 
    pnl: '-6.4%', 
    riskScore: 45,
    whyFeatured: 'Early buyer of AI narrative tokens'
  },
  { 
    address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', 
    label: 'a16z Crypto', 
    type: 'Fund', 
    balance: '$890.2M', 
    pnl: '+26.3%', 
    riskScore: 8,
    whyFeatured: 'Strategic positions in infrastructure plays'
  },
  { 
    address: '0x1234567890abcdef1234567890abcdef12345678', 
    label: 'DeFi Farmer', 
    type: 'Smart Money', 
    balance: '$8.9M', 
    pnl: '+23.6%', 
    riskScore: 22,
    whyFeatured: 'Profitable yield farming strategies'
  },
  { 
    address: '0xabcdef1234567890abcdef1234567890abcdef12', 
    label: 'NFT Trader', 
    type: 'Trader', 
    balance: '$1.2M', 
    pnl: '-15.0%', 
    riskScore: 67,
    whyFeatured: 'High-frequency NFT trading activity'
  },
];

// Wallet Intelligence data
const walletIntelligence = {
  classification: 'Smart Money',
  confidence: 87,
  currentMode: 'Accumulation',
  marketAlignment: 'Risk-On',
  tokenOverlap: ['ETH', 'AI', 'L2'],
  reliabilityScore: 82
};

// Wallet Alerts configuration
const walletAlertTypes = [
  {
    id: 'behavioral_shift',
    name: 'Behavioral Shift',
    description: 'Alert when wallet changes trading pattern',
    triggers: [
      'Switched from accumulation to distribution',
      'Changed from holder to active trader',
      'Shift in primary DEX usage'
    ],
    icon: Activity
  },
  {
    id: 'narrative_entry',
    name: 'Narrative Entry',
    description: 'Alert when wallet enters new narrative cluster',
    triggers: [
      'First purchase in new narrative (AI, Gaming, L2)',
      'Large allocation to emerging sector',
      'Following Smart Money into new category'
    ],
    icon: Target
  },
  {
    id: 'risk_threshold',
    name: 'Risk Threshold',
    description: 'Alert on portfolio risk changes',
    triggers: [
      'PnL drawdown exceeds 10%',
      'Risk score increases above 50',
      'Interaction with high-risk tokens'
    ],
    icon: AlertTriangle
  }
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
  const [showAlertModal, setShowAlertModal] = useState(false);

  const filteredWallets = topWallets.filter(wallet => {
    const matchesSearch = wallet.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wallet.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || wallet.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="px-4 py-6">
          {/* Wallet Intelligence Summary - НОВЫЙ БЛОК */}
          <div className="bg-gray-900 text-white rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Wallet Intelligence</div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{walletIntelligence.classification}</span>
                  <span className="px-2 py-1 bg-white/10 rounded-lg text-xs font-medium">
                    {walletIntelligence.currentMode}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Reliability Score</div>
                <div className="text-2xl font-bold">{walletIntelligence.reliabilityScore}/100</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Classification</div>
                <div className="text-sm font-semibold text-white">
                  {walletIntelligence.classification}
                  <span className="text-xs text-gray-400 ml-2">({walletIntelligence.confidence}% confidence)</span>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Market Alignment</div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-white">{walletIntelligence.marketAlignment}</span>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Token Overlap</div>
                <div className="flex items-center gap-1">
                  {walletIntelligence.tokenOverlap.map((token, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-xs font-medium">{token}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              <button 
                onClick={() => setShowAlertModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-4 h-4" />
                Create Wallet Alert
              </button>
              <Link to="/tokens" className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
                <Activity className="w-4 h-4" />
                View Token Overlap
              </Link>
              <button className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
                <Eye className="w-4 h-4" />
                Track Wallet
              </button>
            </div>
          </div>

          {/* Top Wallets Quick View */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Top Wallets</h2>
                <p className="text-sm text-gray-500">Click to analyze detailed behavior</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by address or label..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="wallets-search-input"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-900 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                  {['all', 'Smart Money', 'Whale', 'Fund'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        filterType === type 
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-600 hover:bg-white'
                      }`}
                    >
                      {type === 'all' ? 'All' : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWallets.map((wallet) => (
                <div
                  key={wallet.address}
                  onClick={() => setSelectedWallet(wallet.address)}
                  className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:border-gray-900 ${
                    selectedWallet === wallet.address 
                      ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{wallet.label}</div>
                        <code className="text-xs text-gray-500 font-mono">
                          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </code>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
                      {wallet.type}
                    </span>
                  </div>

                  {/* Why Featured? */}
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-0.5">Why featured?</div>
                    <div className="text-xs font-medium text-gray-900">{wallet.whyFeatured}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Balance</div>
                      <div className="text-sm font-bold text-gray-900">{wallet.balance}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">PnL</div>
                      <div className={`text-sm font-bold ${
                        wallet.pnl.startsWith('+') ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {wallet.pnl}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Risk</div>
                      <div className="text-sm font-bold text-gray-900">
                        {wallet.riskScore}/100
                      </div>
                    </div>
                  </div>
                </div>
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
