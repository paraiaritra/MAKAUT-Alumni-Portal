import React, { useEffect, useRef, useState } from 'react';
import { LogOut, Menu, X, CreditCard, Shield, Briefcase, Calendar, Users, BarChart2 } from 'lucide-react';

const Navbar = ({ onLoginClick, activeTab, setActiveTab, user, logout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const tabsRef = useRef([]);

  // Define tabs dynamically based on user role
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={18} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
    { id: 'jobs', label: 'Jobs', icon: <Briefcase size={18} /> },
    { id: 'alumni', label: 'Directory', icon: <Users size={18} /> },
    { id: 'membership', label: 'Membership', icon: <CreditCard size={18} /> },
  ];

  // Only add Admin tab if the user is an admin
  if (user?.role === 'admin') {
    tabs.push({ id: 'admin', label: 'Admin Console', icon: <Shield size={18} /> });
  }

  // Close mobile menu on ESC or click outside
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const onClickOutside = (e) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !menuButtonRef.current?.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Keyboard navigation
  const onTabKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') {
      const next = (index + 1) % tabs.length;
      tabsRef.current[next]?.focus();
      setActiveTab(tabs[next].id);
    } else if (e.key === 'ArrowLeft') {
      const prev = (index - 1 + tabs.length) % tabs.length;
      tabsRef.current[prev]?.focus();
      setActiveTab(tabs[prev].id);
    } else if (e.key === 'Home') {
      tabsRef.current[0]?.focus();
      setActiveTab(tabs[0].id);
    } else if (e.key === 'End') {
      tabsRef.current[tabs.length - 1]?.focus();
      setActiveTab(tabs[tabs.length - 1].id);
    }
  };

  return (
    <header
      className="bg-slate-900 shadow-md sticky top-0 z-50 border-b border-slate-800"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div
            className="flex items-center gap-3 group cursor-pointer"
            role="link"
            tabIndex={0}
            onClick={() => setActiveTab('dashboard')}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('dashboard')}
            aria-label="MAKAUT Alumni - go to dashboard"
          >
            <div className="relative p-1 bg-white rounded-full shadow-md overflow-hidden">
              <img 
                src="https://res.cloudinary.com/dyo7pelfy/image/upload/v1764753199/MAKAUAT_LOGO_hdrzi9.png" 
                alt="MAKAUT Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight group-hover:text-orange-400 transition-colors">
                MAKAUT Alumni
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                University of Technology
              </p>
            </div>
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <div className="text-right hidden lg:block">
                  <p className="font-semibold text-white text-sm">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.department}</p>
                </div>
                <div className="h-8 w-px bg-slate-700 mx-2"></div>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
                  aria-label="Logout"
                >
                  <LogOut size={18} aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="bg-orange-600 text-white px-5 py-2 rounded-full hover:bg-orange-700 transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-orange-900/20"
                aria-label="Open login modal"
              >
                Login / Join
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((s) => !s)}
            className="md:hidden text-slate-300 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      <nav
        className="hidden md:block bg-slate-800/50 border-t border-slate-800"
        role="navigation"
        aria-label="Primary"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex gap-8"
            role="tablist"
            aria-orientation="horizontal"
          >
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                ref={(el) => (tabsRef.current[i] = el)}
                role="tab"
                aria-selected={activeTab === tab.id}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-medium transition-all duration-200 relative focus:outline-none flex items-center gap-2 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-orange-400 border-orange-400'
                    : 'text-slate-400 border-transparent hover:text-white hover:border-slate-600'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={mobileMenuRef}
          className="md:hidden bg-slate-900 border-t border-slate-800 absolute w-full shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="px-4 py-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
                className={`w-full text-left py-3 px-4 rounded-lg font-medium transition-colors flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-orange-400'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}

            <div className="pt-4 mt-2 border-t border-slate-800">
              {user ? (
                <div className="space-y-3 px-4">
                  <div className="text-sm">
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className="text-slate-500">{user.department}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      menuButtonRef.current?.focus();
                    }}
                    className="w-full text-left py-2 text-slate-300 hover:text-white flex items-center gap-2"
                  >
                    <LogOut size={18} aria-hidden="true" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                    menuButtonRef.current?.focus();
                  }}
                  className="w-full py-3 px-4 rounded-lg font-medium bg-orange-600 text-white hover:bg-orange-700 text-center"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;