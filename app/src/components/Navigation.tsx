import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, User, ShoppingCart, X, ChevronRight, Car, Zap, LogIn, HelpCircle, Smartphone, Home, MapPin, Mail, Wrench, BookOpen } from 'lucide-react';

interface NavigationProps {
  transparent?: boolean;
}

export function Navigation({ transparent = false }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginTab, setLoginTab] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [menuOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [searchOpen]);

  // Focus search input when opened and close on ESC
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [searchOpen]);

  // Close login modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setLoginOpen(false);
      }
    };

    if (loginOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [loginOpen]);

  // Close login modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLoginOpen(false);
      }
    };

    if (loginOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [loginOpen]);

  const menuSections = [
    {
      title: 'Vehicles',
      icon: Car,
      items: [
        { label: 'Cybertruck', href: '#', icon: Smartphone },
        { label: 'Model S', href: '#', icon: Car },
        { label: 'Model 3', href: '#', icon: Car },
        { label: 'Model X', href: '#', icon: Car },
        { label: 'Model Y', href: '#', icon: Car },
      ],
    },
    {
      title: 'Charging',
      icon: Zap,
      items: [
        { label: 'Supercharging', href: '#', icon: Zap },
        { label: 'Home Charging', href: '#', icon: Home },
        { label: 'Charging Map', href: '#', icon: MapPin },
      ],
    },
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Sign In', href: '#', icon: LogIn },
        { label: 'My Tesla', href: '#', icon: User },
        { label: 'Orders', href: '#', icon: ShoppingCart },
      ],
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        { label: 'Contact Us', href: '#', icon: Mail },
        { label: 'Service Centers', href: '#', icon: Wrench },
        { label: 'Documentation', href: '#', icon: BookOpen },
      ],
    },
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate login
    if (formData.email && formData.password) {
      console.log('Login:', { email: formData.email, password: formData.password });
      setFormData({ email: '', password: '', name: '', confirmPassword: '' });
      setLoginOpen(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate register
    if (formData.email && formData.password && formData.name && formData.confirmPassword) {
      if (formData.password === formData.confirmPassword) {
        console.log('Register:', { name: formData.name, email: formData.email, password: formData.password });
        setFormData({ email: '', password: '', name: '', confirmPassword: '' });
        setLoginOpen(false);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent ? 'bg-transparent' : (scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent')
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left - Menu */}
          <div className="flex items-center gap-2 sm:gap-4 relative" ref={menuRef}>
            {transparent ? (
              <Link
                to="/"
                className="flex items-center gap-1 sm:gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="text-xs font-medium tracking-wider uppercase hidden xs:inline">
                  Home
                </span>
              </Link>
            ) : (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1 sm:gap-2 text-white/80 hover:text-white transition-colors"
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
                <span className="text-xs font-medium tracking-wider uppercase hidden xs:inline">
                  {menuOpen ? 'Close' : 'Menu'}
                </span>
              </button>
            )}

            {/* Dropdown Modal Menu - Desktop */}
            {menuOpen && !transparent && (
              <div className="hidden md:block">
                <div
                  className="absolute top-full left-0 mt-2 w-96 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
                  style={{
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-white/5 to-transparent border-b border-white/10 px-6 py-4">
                    <h3 className="text-white font-light text-sm tracking-widest uppercase">Navigation Menu</h3>
                  </div>

                  {/* Menu Sections */}
                  <div className="max-h-[70vh] overflow-y-auto">
                    {menuSections.map((section, idx) => (
                      <div
                        key={section.title}
                        className={`${
                          idx !== menuSections.length - 1 ? 'border-b border-white/5' : ''
                        }`}
                      >
                        {/* Section Title */}
                        <div className="px-6 pt-4 pb-2 flex items-center gap-2">
                          {section.icon && <section.icon className="w-4 h-4 text-white/40" />}
                          <h4 className="text-white/60 text-xs font-medium tracking-wider uppercase">
                            {section.title}
                          </h4>
                        </div>

                        {/* Section Items */}
                        <div className="px-2">
                          {section.items.map((item) => (
                            <a
                              key={item.label}
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center justify-between px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 group"
                            >
                              <div className="flex items-center gap-3">
                                {item.icon && <item.icon className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />}
                                <span className="text-sm font-light">{item.label}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="bg-gradient-to-r from-transparent to-white/5 border-t border-white/10 px-6 py-4">
                    <p className="text-white/40 text-xs font-light">
                      Press <span className="text-white/60">ESC</span> to close menu
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sidebar Menu - Mobile */}
            {menuOpen && !transparent && (
              <>
                {/* Backdrop Overlay */}
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
                  onClick={() => setMenuOpen(false)}
                />

                {/* Sidebar */}
                <div className="fixed left-0 top-0 h-screen w-72 bg-black/95 backdrop-blur-xl border-r border-white/10 md:hidden z-40 animate-in slide-in-from-left duration-300 overflow-y-auto">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-white/5 to-transparent border-b border-white/10 px-6 py-6 flex items-center justify-between sticky top-0">
                    <h3 className="text-white font-light text-sm tracking-widest uppercase">Menu</h3>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Menu Sections */}
                  <div className="p-4">
                    {menuSections.map((section, idx) => (
                      <div key={section.title} className="mb-6">
                        {/* Section Title */}
                        <div className="flex items-center gap-2 mb-3 px-2">
                          {section.icon && <section.icon className="w-4 h-4 text-white/40" />}
                          <h4 className="text-white/60 text-xs font-medium tracking-wider uppercase">
                            {section.title}
                          </h4>
                        </div>

                        {/* Section Items */}
                        <div className="space-y-1">
                          {section.items.map((item) => (
                            <a
                              key={item.label}
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center justify-between px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 group"
                            >
                              <div className="flex items-center gap-3">
                                {item.icon && <item.icon className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />}
                                <span className="text-sm font-light">{item.label}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-transparent to-white/5 border-t border-white/10 px-6 py-4">
                    <p className="text-white/40 text-xs font-light">
                      Press <span className="text-white/60">ESC</span> to close
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a href="#" className="font-orbitron text-white font-semibold tracking-[0.3em] text-xs sm:text-sm uppercase">
              Tesla
            </a>
          </div>

          {/* Right - Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Bar */}
            <div
              ref={searchRef}
              className="relative flex items-center"
            >
              {searchOpen ? (
                <div className="flex items-center bg-white/5 backdrop-blur-lg border border-white/15 rounded-full px-4 py-2.5 transition-all duration-500 ease-out animate-in fade-in slide-in-from-right-4"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        console.log('Search:', searchValue);
                        setSearchOpen(false);
                        setSearchValue('');
                      }
                    }}
                    className="bg-transparent text-white text-sm outline-none w-40 sm:w-56 placeholder-white/40 transition-all duration-500"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchValue('');
                    }}
                    className="ml-2 text-white/50 hover:text-white/80 transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-white/60 hover:text-white transition-all duration-500 ease-out"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setLoginOpen(!loginOpen)}
                className="text-white/60 hover:text-white transition-all duration-500"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Login Dropdown Modal */}
              {loginOpen && (
                <div
                  ref={loginRef}
                  className="absolute top-full right-0 mt-2 w-96 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
                  style={{
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-white/5 to-transparent border-b border-white/10 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-white font-light text-sm tracking-widest uppercase">
                      {loginTab === 'login' ? 'Sign In' : 'Create Account'}
                    </h3>
                    <button
                      onClick={() => setLoginOpen(false)}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-white/10">
                    <button
                      onClick={() => setLoginTab('login')}
                      className={`flex-1 px-4 py-3 text-sm font-medium tracking-wide transition-all duration-300 ${
                        loginTab === 'login'
                          ? 'text-white border-b-2 border-white bg-white/5'
                          : 'text-white/50 hover:text-white/70'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setLoginTab('register')}
                      className={`flex-1 px-4 py-3 text-sm font-medium tracking-wide transition-all duration-300 ${
                        loginTab === 'register'
                          ? 'text-white border-b-2 border-white bg-white/5'
                          : 'text-white/50 hover:text-white/70'
                      }`}
                    >
                      Register
                    </button>
                  </div>

                  {/* Login Form */}
                  {loginTab === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 animate-in fade-in duration-300">
                      <div>
                        <label className="block text-white/70 text-xs font-medium tracking-wide uppercase mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-xs font-medium tracking-wide uppercase mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleFormChange}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 mt-6 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-medium tracking-wide uppercase text-sm rounded-lg transition-all duration-300"
                      >
                        Sign In
                      </button>
                      <p className="text-center text-white/50 text-xs">
                        Forgot your password?{' '}
                        <button type="button" className="text-white hover:underline">
                          Reset
                        </button>
                      </p>
                    </form>
                  )}

                  {/* Register Form */}
                  {loginTab === 'register' && (
                    <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 animate-in fade-in duration-300">
                      <div>
                        <label className="block text-white/70 text-xs font-medium tracking-wide uppercase mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-xs font-medium tracking-wide uppercase mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-xs font-medium tracking-wide uppercase mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleFormChange}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-xs font-medium tracking-wide uppercase mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleFormChange}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 mt-6 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-medium tracking-wide uppercase text-sm rounded-lg transition-all duration-300"
                      >
                        Create Account
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
            <Link 
              to="/showroom"
              className="text-white/60 hover:text-white transition-all duration-500 relative flex items-center"
            >
              <Car className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
