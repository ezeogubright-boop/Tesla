import { useState, useEffect } from 'react';
import { Menu, Search, User, ShoppingCart } from 'lucide-react';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left - Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="flex items-center gap-1 sm:gap-2 text-white/80 hover:text-white transition-colors">
              <Menu className="w-5 h-5" />
              <span className="text-xs font-medium tracking-wider uppercase hidden xs:inline">Menu</span>
            </button>
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a href="#" className="font-orbitron text-white font-semibold tracking-[0.3em] text-xs sm:text-sm uppercase">
              Tesla
            </a>
          </div>

          {/* Right - Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="text-white/80 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-white/80 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="text-white/80 hover:text-white transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
