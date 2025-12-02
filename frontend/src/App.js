import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { eventsAPI, jobsAPI, alumniAPI } from './services/api';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Events from './components/Events';
import Jobs from './components/Jobs';
import Alumni from './components/Alumni';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard'; // 1. Import AdminDashboard
import './App.css';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading, login, register, logout } = useAuth();

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
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Login Required</h3>
            <p className="text-gray-600 mb-8 text-lg">
              Please login to access this section and connect with the alumni community
            </p>
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
                user={user}                   // <--- This connects the logged-in user data
                setActiveTab={setActiveTab}   // <--- This makes the buttons clickable
              />
            )}
            {activeTab === 'events' && (
              <Events 
                eventsAPI={eventsAPI} 
                user={user} 
              />
            )}
            {activeTab === 'jobs' && (
              <Jobs 
                jobsAPI={jobsAPI} 
                user={user} 
              />
            )}
            {activeTab === 'alumni' && (
              <Alumni 
                alumniAPI={alumniAPI} 
              />
            )}
            
            {/* 4. Add Admin Dashboard Logic */}
            {activeTab === 'admin' && user?.role === 'admin' && (
              <AdminDashboard />
            )}
          </>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <h3 className="font-bold text-gray-800">MAKAUT Alumni</h3>
              </div>
              <p className="text-sm text-gray-600">
                Connecting graduates, fostering growth, and building a stronger community together.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Connect With Us</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-all">
                  <span className="font-bold">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-all">
                  <span className="font-bold">t</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-all">
                  <span className="font-bold">in</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-gray-600 text-sm">
              © 2025 MAKAUT Alumni Portal. All rights reserved. Made with ❤️ for our alumni community.
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