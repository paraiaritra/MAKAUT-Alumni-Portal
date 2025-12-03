import React, { useState } from 'react';
import { X, Upload, User, Lock, Mail, Phone, Book, Calendar, CreditCard } from 'lucide-react';

const Auth = ({ onClose, login, register }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Registration Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    registrationNumber: '',
    mobileNumber: '',
    gender: '',
    course: '',
    passoutYear: '',
    password: '',
    confirmPassword: '',
    photo: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        onClose();
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          setLoading(false);
          return;
        }

        // Use FormData for File Upload
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === 'photo') {
            if(formData.photo) submissionData.append('photo', formData.photo);
          } else {
            submissionData.append(key, formData[key]);
          }
        });

        await register(submissionData);
        onClose();
      }
    } catch (err) {
      alert("Authentication failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold">{isLogin ? 'Welcome Back' : 'Join Alumni Network'}</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {isLogin ? (
            // LOGIN FIELDS
            <>
              <input name="email" type="email" placeholder="Email Address" onChange={handleChange} className="w-full border p-3 rounded-lg" required />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-3 rounded-lg" required />
            </>
          ) : (
            // SIGNUP FIELDS (Updated as per request)
            <>
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" placeholder="First Name" onChange={handleChange} className="border p-3 rounded-lg" required />
                <input name="lastName" placeholder="Last Name" onChange={handleChange} className="border p-3 rounded-lg" required />
              </div>
              <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border p-3 rounded-lg" required />
              <div className="grid grid-cols-2 gap-4">
                <input name="registrationNumber" placeholder="Reg. Number" onChange={handleChange} className="border p-3 rounded-lg" required />
                <input name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} className="border p-3 rounded-lg" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <select name="gender" onChange={handleChange} className="border p-3 rounded-lg" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <select name="passoutYear" onChange={handleChange} className="border p-3 rounded-lg" required>
                  <option value="">Passout Year</option>
                  {Array.from({length: 30}, (_, i) => 2025 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <select name="course" onChange={handleChange} className="w-full border p-3 rounded-lg" required>
                <option value="">Select Course</option>
                <option value="CSE">B.Tech CSE</option>
                <option value="IT">B.Tech IT</option>
                <option value="ECE">B.Tech ECE</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
              </select>

              <div className="border p-3 rounded-lg border-dashed text-center">
                <label className="cursor-pointer block">
                  <span className="text-gray-500 text-sm flex items-center justify-center gap-2">
                    <Upload size={16} /> {formData.photo ? formData.photo.name : "Upload Profile Photo"}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-3 rounded-lg" required />
              <input name="confirmPassword" type="password" placeholder="Re-enter Password" onChange={handleChange} className="w-full border p-3 rounded-lg" required />
            </>
          )}

          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-all">
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>

          <p className="text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already registered? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-bold hover:underline">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;