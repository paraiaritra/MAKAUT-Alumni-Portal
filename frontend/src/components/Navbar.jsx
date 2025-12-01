import React, { useEffect, useRef, useState } from 'react';
import { LogOut, Menu, X, GraduationCap } from 'lucide-react';

const Navbar = ({ onLoginClick, activeTab, setActiveTab, user, logout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const tabsRef = useRef([]);
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'jobs', label: 'Jobs', icon: '💼' },
    { id: 'alumni', label: 'Alumni', icon: '👥' },
  ];

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

  // Keyboard navigation for tabs (left/right arrows)
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
      className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-xl sticky top-0 z-50"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div
            className="flex items-center gap-3 group cursor-pointer"
            role="link"
            tabIndex={0}
            onClick={() => setActiveTab('dashboard')}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('dashboard')}
            aria-label="MAKAUT Alumni - go to dashboard"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="text-indigo-600" size={28} aria-hidden="true" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">MAKAUT Alumni</h1>
              <p className="text-xs text-indigo-100">Connect • Grow • Succeed</p>
            </div>
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="text-right bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-indigo-100">{user.department}</p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                className="bg-white text-indigo-600 px-6 py-2.5 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                aria-label="Open login modal"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((s) => !s)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav
        className="hidden md:block bg-white/10 backdrop-blur-sm border-t border-white/20"
        role="navigation"
        aria-label="Primary"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex gap-1"
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
                className={`py-3 px-6 font-medium transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-white/40 rounded-t-md ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-indigo-100 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full" />
                )}
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
          className="md:hidden bg-white/10 backdrop-blur-sm border-t border-white/20"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="px-4 py-2 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
                className={`w-full text-left py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
              </button>
            ))}

            <div className="pt-2 border-t border-white/10">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    menuButtonRef.current?.focus();
                  }}
                  className="w-full text-left py-3 px-4 rounded-lg font-medium text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <LogOut size={18} aria-hidden="true" />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                    menuButtonRef.current?.focus();
                  }}
                  className="w-full py-3 px-4 rounded-lg font-medium bg-white text-indigo-600 hover:bg-indigo-50"
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
