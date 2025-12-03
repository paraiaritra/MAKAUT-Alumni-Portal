import React, { useState } from 'react';
import { ShieldCheck, Lock, UserPlus, LogIn, X, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const AdminAuth = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', adminSecret: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        // Standard login (backend verifies role)
        await login({ email: formData.email, password: formData.password });
        onClose(); 
      } else {
        // --- FIX FOR "REQUIRED FIELDS" ERROR ---
        // The backend now expects specific fields like firstName, lastName, regNo.
        // We auto-generate these for Admins since the form only asks for "Name".
        
        const nameParts = formData.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || 'Admin'; // Default last name if missing

        // We use FormData because the backend expects multipart/form-data now
        const adminPayload = new FormData();
        adminPayload.append('firstName', firstName);
        adminPayload.append('lastName', lastName);
        adminPayload.append('email', formData.email);
        adminPayload.append('password', formData.password);
        adminPayload.append('adminSecret', formData.adminSecret);
        
        // Fill required student fields with Admin dummy data
        adminPayload.append('registrationNumber', `ADMIN-${Date.now()}`); // Unique ID
        adminPayload.append('mobileNumber', '0000000000');
        adminPayload.append('gender', 'Other');
        adminPayload.append('course', 'ADMINISTRATION');
        adminPayload.append('passoutYear', '2025');

        // Register using the compatible payload
        await authAPI.register(adminPayload);
        
        // Auto login after reg
        await login({ email: formData.email, password: formData.password });
        onClose();
      }
    } catch (err) {
      console.error("Admin Auth Error:", err);
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || 'Authentication failed. Check credentials or Secret Key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
        
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 p-4 rounded-full shadow-lg shadow-red-900/50">
            <ShieldCheck size={40} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Admin Portal</h2>
        <p className="text-slate-400 text-center mb-6 uppercase tracking-wider text-xs font-bold">Authorized Personnel Only</p>
        
        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center text-sm border border-red-500/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input 
                type="text" 
                placeholder="Admin Name" 
                className="w-full bg-slate-700 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none placeholder-slate-400" 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <input 
                type="password" 
                placeholder="Secret Key (Required)" 
                className="w-full bg-slate-700 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none placeholder-slate-400" 
                onChange={e => setFormData({...formData, adminSecret: e.target.value})} 
                required 
              />
            </>
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-slate-700 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none placeholder-slate-400" 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-slate-700 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none placeholder-slate-400" 
            onChange={e => setFormData({...formData, password: e.target.value})} 
            required 
          />
          
          <button 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin" size={18} /> : (isLogin ? <><LogIn size={18} /> Login to Console</> : <><UserPlus size={18} /> Register Admin</>)}
          </button>
        </form>
        
        <div className="mt-6 flex justify-between text-sm text-slate-400">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="hover:text-white underline">
            {isLogin ? 'Register New Admin' : 'Back to Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;