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
import Membership from './components/Membership'; // IMPORT MEMBERSHIP
import './App.css';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading, login, register, logout } = useAuth();
  
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

  const handleRefresh = () => {
    window.location.reload(); 
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navbar
        onLoginClick={() => setShowAuthModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            
            {/* ADDED MEMBERSHIP ROUTE */}
            {activeTab === 'membership' && (
              <Membership user={user} onUpdateSuccess={handleRefresh} />
            )}

            {activeTab === 'admin' && user?.role === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

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