import React, { useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Admin uses standard login, backend checks role
      await login({ email, password });
      onClose(); // Close modal on success
    } catch (err) {
      setError('Invalid Admin Credentials');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 p-4 rounded-full">
            <ShieldCheck size={40} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Admin Portal</h2>
        <p className="text-slate-400 text-center mb-6">Restricted Access Only</p>
        
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-center text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Admin Email</label>
            <input 
              type="email" 
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
            <Lock size={18} /> Login to Console
          </button>
        </form>
        <button onClick={onClose} className="w-full text-center mt-4 text-slate-500 hover:text-white text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;