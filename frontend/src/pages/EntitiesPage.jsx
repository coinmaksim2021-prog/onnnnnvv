import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building, TrendingUp, TrendingDown, ArrowUpRight, Users, Info } from 'lucide-react';
import Header from '../components/Header';
import { PageHeader } from '../components/PageHeader';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

// Mock entities data
const entitiesData = [
  // Exchanges
  { id: 'binance', name: 'Binance', type: 'Exchange', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png', holdings: '$28.4B', netflow24h: '+$125M', marketShare: 14.2, addresses: 1247, activity: 'accumulating', confidence: 82 },
  { id: 'coinbase', name: 'Coinbase', type: 'Exchange', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/89.png', holdings: '$18.9B', netflow24h: '-$45M', marketShare: 9.4, addresses: 892, activity: 'rotating', confidence: 68 },
  { id: 'kraken', name: 'Kraken', type: 'Exchange', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/24.png', holdings: '$8.2B', netflow24h: '+$23M', marketShare: 4.1, addresses: 456, activity: 'accumulating', confidence: 74 },
  
  // Smart Money Funds
  { id: 'a16z', name: 'a16z Crypto', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$4.5B', netflow24h: '+$156M', marketShare: 2.2, addresses: 234, activity: 'accumulating', confidence: 82 },
  { id: 'paradigm', name: 'Paradigm', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$3.2B', netflow24h: '+$12M', marketShare: 1.6, addresses: 156, activity: 'holding', confidence: 67 },
  { id: 'pantera', name: 'Pantera Capital', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$3.5B', netflow24h: '+$23M', marketShare: 1.7, addresses: 189, activity: 'rotating', confidence: 75 },
  { id: 'jump', name: 'Jump Trading', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$1.2B', netflow24h: '-$67M', marketShare: 0.6, addresses: 67, activity: 'distributing', confidence: 71 },
  { id: 'galaxy', name: 'Galaxy Digital', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$1.8B', netflow24h: '+$78M', marketShare: 0.9, addresses: 134, activity: 'accumulating', confidence: 76 },
  
  // Funds
  { id: 'grayscale', name: 'Grayscale', type: 'Fund', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', holdings: '$21.5B', netflow24h: '+$234M', marketShare: 10.7, addresses: 45, activity: 'accumulating', confidence: 88 },
  
  // Market Makers
  { id: 'wintermute', name: 'Wintermute', type: 'Market Maker', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$890M', netflow24h: '+$34M', marketShare: 0.4, addresses: 89, activity: 'rotating', confidence: 65 },
];

const activityConfig = {
  'accumulating': { label: 'Accumulating', color: 'bg-gray-900 text-white' },
  'distributing': { label: 'Distributing', color: 'bg-gray-100 text-gray-600' },
  'rotating': { label: 'Rotating', color: 'bg-gray-200 text-gray-700' },
  'holding': { label: 'Holding', color: 'bg-gray-100 text-gray-600' },
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
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">Entities</h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Info className="w-4 h-4 text-gray-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
                  <p className="text-xs">Entity = group of addresses controlled by single actor. Track exchanges, funds, and market makers — their aggregate influence on the market.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-gray-500">Track exchanges, funds, and market makers — their holdings, flows, and market impact</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search entities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="entities-search-input"
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
              {['all', 'Exchange', 'Smart Money', 'Fund', 'Market Maker'].map(type => (
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

          {/* Entities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntities.map((entity) => (
              <Link key={entity.id} to={`/entity/${entity.id}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-900 transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={entity.logo} alt={entity.name} className="w-12 h-12 rounded-2xl" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{entity.name}</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                          {entity.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>{entity.addresses} addresses</span>
                      </div>
                    </div>
                  </div>

                  {/* Activity & Confidence */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${activityConfig[entity.activity]?.color || 'bg-gray-100 text-gray-600'}`}>
                      {activityConfig[entity.activity]?.label || entity.activity}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs text-gray-500 cursor-help">
                          {entity.confidence}% confidence
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
                        <p className="text-xs">Confidence based on net flow consistency, holdings stability, and historical patterns</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Holdings</div>
                      <div className="text-sm font-bold text-gray-900">{entity.holdings}</div>
                    </div>
                    <div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <div className="text-xs text-gray-500 mb-0.5">Net Flow (24h)</div>
                            <div className={`text-sm font-bold flex items-center gap-1 ${
                              entity.netflow24h.startsWith('+') ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {entity.netflow24h.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {entity.netflow24h}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white max-w-xs border border-white/20">
                          <p className="text-xs">Net flow = Total inflows - Total outflows across all entity addresses</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500">Market Share</div>
                      <div className="text-sm font-semibold text-gray-900">{entity.marketShare}%</div>
                    </div>
                    <div className="flex items-center text-gray-900 text-sm font-medium">
                      View Details <ArrowUpRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
