import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, Coins, Wallet, Building, Bell, Eye, 
  Search, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// Main navigation items (centered)
const navItems = [
  { path: '/', label: 'Market', icon: BarChart3 },
  { path: '/tokens', label: 'Tokens', icon: Coins },
  { path: '/wallets', label: 'Wallets', icon: Wallet },
  { path: '/entities', label: 'Entities', icon: Building },
];

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img 
                src="/assets/logo.png" 
                alt="FOMO" 
                className="h-8 w-auto"
              />
            </Link>

            {/* Centered Navigation */}
            <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                      ${active 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Section - Icons + Connect */}
            <div className="flex items-center gap-2">
              {/* Search Icon / Input */}
              {searchOpen ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                    className="w-40 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
                  />
                  <button onClick={() => setSearchOpen(false)}>
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => setSearchOpen(true)}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white">
                    <p className="text-xs">Search</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Watchlist Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/watchlist"
                    className={`p-2 rounded-full transition-colors ${
                      isActive('/watchlist') 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-white">
                  <p className="text-xs">Watchlist</p>
                </TooltipContent>
              </Tooltip>

              {/* Alerts Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/alerts"
                    className={`p-2 rounded-full transition-colors relative ${
                      isActive('/alerts') 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    {/* Notification dot */}
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-white">
                  <p className="text-xs">Alerts</p>
                </TooltipContent>
              </Tooltip>

              {/* Divider */}
              <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1"></div>

              {/* Connect Wallet Button - Gradient */}
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30">
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                {[...navItems, 
                  { path: '/watchlist', label: 'Watchlist', icon: Eye },
                  { path: '/alerts', label: 'Alerts', icon: Bell }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-xl transition-all
                        ${active 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}
        </div>
      </header>
    </TooltipProvider>
  );
}
