import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building, TrendingUp, TrendingDown, ArrowUpRight, Users, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { PageHeader } from '../components/PageHeader';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

// Mock entities data - expanded for pagination demo
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
  
  // Additional entities for pagination
  { id: 'ftx', name: 'FTX Estate', type: 'Exchange', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/524.png', holdings: '$3.2B', netflow24h: '-$89M', marketShare: 1.6, addresses: 234, activity: 'distributing', confidence: 45 },
  { id: 'polychain', name: 'Polychain Capital', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$2.1B', netflow24h: '+$34M', marketShare: 1.0, addresses: 167, activity: 'accumulating', confidence: 79 },
  { id: 'multicoin', name: 'Multicoin Capital', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$1.5B', netflow24h: '+$23M', marketShare: 0.7, addresses: 98, activity: 'accumulating', confidence: 74 },
  { id: 'alameda', name: 'Alameda Research', type: 'Smart Money', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$890M', netflow24h: '-$156M', marketShare: 0.4, addresses: 456, activity: 'distributing', confidence: 32 },
  { id: 'genesis', name: 'Genesis Trading', type: 'Market Maker', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', holdings: '$2.3B', netflow24h: '+$45M', marketShare: 1.1, addresses: 78, activity: 'rotating', confidence: 61 },
  { id: 'bitfinex', name: 'Bitfinex', type: 'Exchange', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/37.png', holdings: '$5.6B', netflow24h: '+$67M', marketShare: 2.8, addresses: 345, activity: 'accumulating', confidence: 71 },
  { id: 'okx', name: 'OKX', type: 'Exchange', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/294.png', holdings: '$9.8B', netflow24h: '+$89M', marketShare: 4.9, addresses: 567, activity: 'accumulating', confidence: 77 },
  { id: 'bybit', name: 'Bybit', type: 'Exchange', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/521.png', holdings: '$4.2B', netflow24h: '+$34M', marketShare: 2.1, addresses: 289, activity: 'holding', confidence: 69 },
  { id: 'kucoin', name: 'KuCoin', type: 'Exchange', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/311.png', holdings: '$2.8B', netflow24h: '-$12M', marketShare: 1.4, addresses: 234, activity: 'rotating', confidence: 64 },
  { id: 'deribit', name: 'Deribit', type: 'Exchange', logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/281.png', holdings: '$1.9B', netflow24h: '+$18M', marketShare: 0.9, addresses: 156, activity: 'accumulating', confidence: 72 },
];

const activityConfig = {
  'accumulating': { label: 'Accumulating', color: 'bg-gray-900 text-white' },
  'distributing': { label: 'Distributing', color: 'bg-gray-100 text-gray-600' },
  'rotating': { label: 'Rotating', color: 'bg-gray-200 text-gray-700' },
  'holding': { label: 'Holding', color: 'bg-gray-100 text-gray-600' },
};

const ITEMS_PER_PAGE = 9;

// Pagination Component
const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
            currentPage === 1 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-teal-500 hover:bg-teal-50'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-teal-400 text-sm">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                currentPage === page
                  ? 'bg-teal-500 text-white'
                  : 'text-teal-500 hover:bg-teal-50'
              }`}
            >
              {page}
            </button>
          )
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
            currentPage === totalPages 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-teal-500 hover:bg-teal-50'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Items Count */}
      <div className="text-sm text-gray-500">
        Showing {startItem} - {endItem} out of {totalItems}
      </div>
    </div>
  );
};

export default function EntitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEntities = entitiesData.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || entity.type === filterType;
    return matchesSearch && matchesType;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredEntities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEntities = filteredEntities.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when filter changes
  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                onChange={handleSearchChange}
                data-testid="entities-search-input"
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
              {['all', 'Exchange', 'Smart Money', 'Fund', 'Market Maker'].map(type => (
                <button
                  key={type}
                  onClick={() => handleFilterChange(type)}
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

          {/* Entities Grid - 3x3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedEntities.map((entity) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredEntities.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
