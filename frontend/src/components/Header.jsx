import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, Coins, Wallet, Building, Bell, Eye, 
  Search, Menu, X, Layers
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Market', icon: BarChart3, description: 'Market overview' },
  { path: '/tokens', label: 'Tokens', icon: Coins, description: 'Token analytics' },
  { path: '/wallets', label: 'Wallets', icon: Wallet, description: 'Wallet analysis' },
  { path: '/entities', label: 'Entities', icon: Building, description: 'Exchanges & funds' },
  { path: '/watchlist', label: 'Watchlist', icon: Eye, description: 'Track addresses' },
  { path: '/alerts', label: 'Alerts', icon: Bell, description: 'Notifications' },
];

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 px-4 py-3 backdrop-blur-xl bg-gradient-to-br from-white/80 via-blue-50/60 to-purple-50/60">
      <div className="glass-card px-5 py-3 hover-lift">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - без контейнера, только изображение */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <img 
              src="/assets/logo.png" 
              alt="FOMO" 
              className="h-10 w-auto transition-all group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation - Telegram Pill Style */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-gray-50/80 rounded-full p-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300
                    ${active 
                      ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                      : 'text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:shadow-sm'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${active ? 'drop-shadow-sm' : ''}`} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search - Telegram Style */}
            <div className={`hidden md:flex items-center gap-2.5 px-4 py-2.5 bg-gray-50/80 rounded-full transition-all duration-300 ${searchFocused ? 'ring-2 ring-gray-900/20 bg-white/90' : ''}`}>
              <Search className={`w-4 h-4 transition-colors ${searchFocused ? 'text-gray-900' : 'text-gray-400'}`} />
              <input 
                type="text" 
                placeholder="Search..." 
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-48 bg-transparent border-none outline-none text-sm font-medium text-gray-700 placeholder-gray-400"
              />
            </div>
            
            {/* Connect Button - Black */}
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:scale-105 active:scale-95">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Connect</span>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden icon-btn"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex flex-col items-center gap-2 p-4 rounded-2xl transition-all
                      ${active 
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                        : 'bg-gray-50/80 text-gray-600 hover:bg-white/80 hover:shadow-sm'
                      }
                    `}
                  >
                    <Icon className={`w-6 h-6 ${active ? 'drop-shadow-sm' : ''}`} />
                    <span className="text-xs font-bold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
