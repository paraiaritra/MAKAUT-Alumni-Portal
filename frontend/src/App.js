import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { eventsAPI, jobsAPI, alumniAPI } from './services/api';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Events from './components/Events';
import Jobs from './components/Jobs';
import Alumni from './components/Alumni';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
import Membership from './components/Membership'; 
import { MapPin, Phone, Mail, ArrowRight, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'; // Import icons for footer
import './App.css';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Import refreshUser from context
  const { user, loading, login, register, logout, refreshUser } = useAuth();
  
  const [loadingMessage, setLoadingMessage] = useState('Loading MAKAUT Alumni Portal...');
  const [showTechTip, setShowTechTip] = useState(false);

  useEffect(() => {
    let timer1, timer2;
    if (loading) {
      timer1 = setTimeout(() => {
        setLoadingMessage('Waking up the server... (This may take up to 60s on Free Tier)');
      }, 3000);
      timer2 = setTimeout(() => {
        setLoadingMessage('Still connecting... Please check your internet or refresh.');
        setShowTechTip(true);
      }, 15000);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [loading]);

  // Updated Handler: Uses context instead of window.reload
  const handleRefresh = async () => {
    await refreshUser(); 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{loadingMessage}</h2>
          <p className="text-gray-500 text-sm">Thank you for your patience.</p>
          {showTechTip && (
            <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 text-xs text-left rounded-lg border border-yellow-200">
              <strong>Troubleshooting:</strong><br/>
              1. If this takes 2 mins, the backend might be down.<br/>
              2. Check console (F12) for connection errors.<br/>
              3. Ensure <code>REACT_APP_API_URL</code> is set in deployment.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col">
      <Navbar
        onLoginClick={() => setShowAuthModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {!user && activeTab !== 'dashboard' ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Login Required</h3>
            <p className="text-gray-600 mb-8 text-lg">Please login to access this section.</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold text-lg"
            >
              Login / Sign Up Now
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard 
                eventsAPI={eventsAPI} 
                jobsAPI={jobsAPI} 
                alumniAPI={alumniAPI} 
                user={user} 
                setActiveTab={setActiveTab}
                onLoginClick={() => setShowAuthModal(true)}
              />
            )}
            {activeTab === 'events' && <Events eventsAPI={eventsAPI} user={user} />}
            {activeTab === 'jobs' && <Jobs jobsAPI={jobsAPI} user={user} />}
            {activeTab === 'alumni' && <Alumni alumniAPI={alumniAPI} />}
            {activeTab === 'profile' && <UserProfile user={user} onUpdateRefresh={handleRefresh} />}
            
            {/* Membership Route passing handleRefresh */}
            {activeTab === 'membership' && (
              <Membership user={user} onUpdateSuccess={handleRefresh} />
            )}

            {activeTab === 'admin' && user?.role === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Comprehensive Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Column 1: Alumni Association Info */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-orange-500 inline-block pb-1">Alumni Association</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-white">City Office:</p>
                  <p>BF-142, Sector-I, Saltlake City, Kol-64</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-white">Main Office:</p>
                  <p>NH12, Simhat, Nadia, West Bengal, 741249</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <p className="text-sm">033 2589 1555</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <p className="text-sm">makautwb.alumni@gmail.com</p>
              </div>
            </div>

            {/* Column 2: Useful Links */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-orange-500 inline-block pb-1">Useful Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-2"><span className="text-orange-500">›</span> University Home</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-2"><span className="text-orange-500">›</span> University Exam</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-2"><span className="text-orange-500">›</span> Terms of Service</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-2"><span className="text-orange-500">›</span> Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-2"><span className="text-orange-500">›</span> Upcoming Events</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-2"><span className="text-orange-500">›</span> Alumni Meet 2025</a></li>
              </ul>
            </div>

            {/* Column 3: Newsletter */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-orange-500 inline-block pb-1">Our Newsletter</h3>
              <p className="text-sm mb-4">Want to subscribe to our newsletter? Stay updated with the latest news and events.</p>
              <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter Email Address" 
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500 text-sm"
                />
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center gap-2">
                  Subscribe <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {/* Column 4: Socials (Optional but good for layout) */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-orange-500 inline-block pb-1">Follow Us</h3>
              <p className="text-sm mb-4">Connect with us on social media for updates.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Facebook size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all"><Twitter size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all"><Linkedin size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"><Instagram size={20} /></a>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© Copyright 2025. All Rights Reserved</p>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              Designed by <span className="text-orange-500 font-bold">ALUMNI TEAM</span>
            </p>
          </div>
        </div>
      </footer>

      {showAuthModal && (
        <Auth 
          onClose={() => setShowAuthModal(false)} 
          login={login}
          register={register}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;