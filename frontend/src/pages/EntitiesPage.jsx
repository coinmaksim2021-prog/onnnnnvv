import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building, TrendingUp, TrendingDown, ArrowUpRight, Users } from 'lucide-react';
import Header from '../components/Header';
import { PageHeader } from '../components/PageHeader';

const GlassCard = ({ children, className = "", hover = false }) => (
  <div className={`glass-card ${hover ? 'glass-card-hover cursor-pointer' : ''} ${className}`}>
    {children}
  </div>
);

// Mock entities data - теперь включает Smart Money funds
const entitiesData = [
  // Exchanges
  { id: 'binance', name: 'Binance', type: 'Exchange', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png', holdings: '$28.4B', netflow24h: '+$125M', marketShare: 14.2, addresses: 1247, activity: 'active' },
  { id: 'coinbase', name: 'Coinbase', type: 'Exchange', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/89.png', holdings: '$18.9B', netflow24h: '-$45M', marketShare: 9.4, addresses: 892, activity: 'active' },
  { id: 'kraken', name: 'Kraken', type: 'Exchange', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/24.png', holdings: '$8.2B', netflow24h: '+$23M', marketShare: 4.1, addresses: 456, activity: 'active' },
  
  // Smart Money Funds (добавлены из SmartMoneyModal)
  { id: 'alameda', name: 'Alameda Research', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$4.2B', netflow24h: '+$89M', marketShare: 2.1, addresses: 234, activity: 'accumulating', confidence: 69 },
  { id: 'dwf-labs', name: 'DWF Labs', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$2.8B', netflow24h: '+$45M', marketShare: 1.4, addresses: 156, activity: 'adding', confidence: 73 },
  { id: 'pantera', name: 'Pantera Capital', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$3.5B', netflow24h: '+$23M', marketShare: 1.7, addresses: 189, activity: 'rotating', confidence: 75 },
  { id: 'a16z', name: 'a16z Crypto', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$4.5B', netflow24h: '+$156M', marketShare: 2.2, addresses: 234, activity: 'accumulating', confidence: 82 },
  { id: 'paradigm', name: 'Paradigm', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$3.2B', netflow24h: '+$12M', marketShare: 1.6, addresses: 156, activity: 'holding', confidence: 67 },
  { id: 'jump', name: 'Jump Trading', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$1.2B', netflow24h: '-$67M', marketShare: 0.6, addresses: 67, activity: 'distributing', confidence: 71 },
  { id: 'three-arrows', name: 'Three Arrows Capital', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$890M', netflow24h: '+$18M', marketShare: 0.4, addresses: 89, activity: 'rotating', confidence: 58 },
  { id: 'grayscale', name: 'Grayscale', type: 'Fund', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', holdings: '$21.5B', netflow24h: '+$234M', marketShare: 10.7, addresses: 45, activity: 'accumulating', confidence: 88 },
  { id: 'galaxy', name: 'Galaxy Digital', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$1.8B', netflow24h: '+$78M', marketShare: 0.9, addresses: 134, activity: 'adding', confidence: 76 },
  
  // Market Makers
  { id: 'wintermute', name: 'Wintermute', type: 'Market Maker', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$890M', netflow24h: '+$34M', marketShare: 0.4, addresses: 89, activity: 'adding' },
];

const typeBadgeColors = {
  'Exchange': 'badge-blue',
  'Fund': 'badge-purple',
  'Smart Money': 'badge-emerald',
  'Market Maker': 'badge-orange',
};

const activityBadgeColors = {
  'accumulating': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '↑' },
  'adding': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '↑' },
  'distributing': { bg: 'bg-red-50', text: 'text-red-700', icon: '↓' },
  'rotating': { bg: 'bg-blue-50', text: 'text-blue-700', icon: '⟳' },
  'holding': { bg: 'bg-gray-50', text: 'text-gray-700', icon: '=' },
  'active': { bg: 'bg-blue-50', text: 'text-blue-700', icon: '●' },
};

export default function EntitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredEntities = entitiesData.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || entity.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Header />
      
      <PageHeader 
        title="Entities"
        description="Track exchanges, funds, and market makers — their holdings, flows, and activity"
      />

      {/* Filters */}
      <div className="px-4 mb-6">
        <GlassCard className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search entities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="entities-search-input"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div className="time-selector">
              {['all', 'Exchange', 'Smart Money', 'Fund', 'Market Maker'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`time-selector-btn ${filterType === type ? 'active' : ''}`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Entities Grid */}
      <div className="px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntities.map((entity) => (
            <Link key={entity.id} to={`/entity/${entity.id}`}>
              <GlassCard className="p-4" hover>
                <div className="flex items-center gap-3 mb-4">
                  <img src={entity.logo} alt={entity.name} className="w-12 h-12 rounded-2xl" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-body font-semibold text-gray-900">{entity.name}</span>
                      <span className={`badge ${typeBadgeColors[entity.type]}`}>{entity.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-hint">
                        <Users className="w-3 h-3" />
                        <span>{entity.addresses} addresses</span>
                      </div>
                      {entity.activity && (
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${activityBadgeColors[entity.activity]?.bg} ${activityBadgeColors[entity.activity]?.text}`}>
                          {activityBadgeColors[entity.activity]?.icon} {entity.activity.charAt(0).toUpperCase() + entity.activity.slice(1)}
                        </span>
                      )}
                      {entity.confidence && (
                        <span className="text-xs text-gray-500">
                          ({entity.confidence}% confidence)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-hint">Holdings</div>
                    <div className="text-value-sm">{entity.holdings}</div>
                  </div>
                  <div>
                    <div className="text-hint">Net Flow (24h)</div>
                    <div className={`text-value-sm flex items-center gap-1 ${entity.netflow24h.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                      {entity.netflow24h.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {entity.netflow24h}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-hint">Market Share</div>
                    <div className="text-body font-semibold">{entity.marketShare}%</div>
                  </div>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    View Details <ArrowUpRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
