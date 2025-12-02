import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { eventsAPI, jobsAPI, alumniAPI } from './services/api';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Events from './components/Events';
import Jobs from './components/Jobs';
import Alumni from './components/Alumni';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile'; // <--- 1. Import This
import './App.css';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading, login, register, logout } = useAuth();

  // Helper to force a data refresh (Passed down to components)
  const handleRefresh = () => {
    // In a real app, this would trigger AuthContext to refetch /me
    // For now, reload serves as a hard refresh to show new pictures
    window.location.reload(); 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading MAKAUT Alumni Portal...</p>
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
            {/* ... Login Required UI ... */}
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
              />
            )}
            {activeTab === 'events' && <Events eventsAPI={eventsAPI} user={user} />}
            {activeTab === 'jobs' && <Jobs jobsAPI={jobsAPI} user={user} />}
            {activeTab === 'alumni' && <Alumni alumniAPI={alumniAPI} />}
            
            {/* 2. Add Profile Route */}
            {activeTab === 'profile' && (
              <UserProfile 
                user={user} 
                onUpdateRefresh={handleRefresh} 
              />
            )}

            {activeTab === 'admin' && user?.role === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Footer... */}
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