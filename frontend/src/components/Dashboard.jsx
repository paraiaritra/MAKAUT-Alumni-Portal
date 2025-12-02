import React, { useState } from 'react';
import { X, Upload, CreditCard, User, Loader, CheckCircle } from 'lucide-react';
import { alumniAPI, paymentAPI } from '../services/api';

const EditProfileModal = ({ user, onClose, onUpdateSuccess }) => {
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'photo', 'membership'
  const [loading, setLoading] = useState(false);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    bio: user?.profile?.bio || '',
    company: user?.company || '',
    location: user?.location || '',
  });

  // 1. Handle Profile Details Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await alumniAPI.updateProfile(formData);
      alert('Profile Updated Successfully!');
      onUpdateSuccess(); 
      onClose();
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Image Upload (Cloudinary)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setLoading(true);
    try {
      await alumniAPI.uploadAvatar(data);
      alert('Profile Picture Updated!');
      onUpdateSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Upload failed. Ensure image is under 2MB.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Razorpay Payment
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Razorpay SDK failed to load. Check your internet connection.');
        return;
      }

      // A. Create Order on Backend
      // Note: Amount is in INR. 500 = ₹500
      const orderRes = await paymentAPI.createOrder(500); 
      
      // B. Configure Razorpay Options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, 
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'MAKAUT Alumni',
        description: 'Lifetime Premium Membership',
        order_id: orderRes.data.id,
        handler: async function (response) {
          // C. Verify Payment on Backend
          try {
            const verifyRes = await paymentAPI.verifyPayment(response);
            if (verifyRes.data.success) {
              alert('Payment Successful! Welcome to Premium.');
              onUpdateSuccess();
              onClose();
            }
          } catch (error) {
            alert('Payment verification failed on server.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#4f46e5',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert('Could not initiate payment. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Edit Profile
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'details' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <User size={16} className="inline mr-1" /> Details
          </button>
          <button 
            onClick={() => setActiveTab('photo')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'photo' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Upload size={16} className="inline mr-1" /> Photo
          </button>
          <button 
            onClick={() => setActiveTab('membership')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'membership' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <CreditCard size={16} className="inline mr-1" /> Membership
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-60">
              <Loader className="animate-spin text-indigo-600 mb-3" size={40} />
              <p className="text-gray-500 font-medium">Processing request...</p>
            </div>
          ) : (
            <>
              {/* --- TAB 1: DETAILS --- */}
              {activeTab === 'details' && (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company / Organization</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Where do you work?"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      rows="4"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                    Save Changes
                  </button>
                </form>
              )}

              {/* --- TAB 2: PHOTO --- */}
              {activeTab === 'photo' && (
                <div className="text-center space-y-6 pt-4">
                  <div className="w-32 h-32 mx-auto rounded-full border-4 border-indigo-100 shadow-md overflow-hidden relative group">
                    <img 
                      src={user.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                      alt="Current" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div className="relative inline-block">
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label 
                      htmlFor="file-upload" 
                      className="cursor-pointer bg-white border border-gray-300 text-gray-700 py-2.5 px-6 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all inline-flex items-center gap-2 shadow-sm font-medium"
                    >
                      <Upload size={18} /> Upload New Photo
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Supported formats: JPG, PNG. Max size: 2MB.
                  </p>
                </div>
              )}

              {/* --- TAB 3: MEMBERSHIP --- */}
              {activeTab === 'membership' && (
                <div className="text-center space-y-5 pt-2">
                  {user.membershipStatus === 'premium' ? (
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="text-green-600" size={32} />
                      </div>
                      <h3 className="text-green-800 font-bold text-xl">Premium Member</h3>
                      <p className="text-green-600 mt-2">
                        You have full access to all premium features. Thank you for your support!
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100">
                        <h3 className="text-indigo-900 font-bold text-lg mb-1">Lifetime Membership</h3>
                        <p className="text-indigo-600 text-sm mb-4">Unlock exclusive networking events and job boards.</p>
                        <div className="text-3xl font-bold text-gray-900">₹500</div>
                      </div>
                      
                      <button 
                        onClick={handlePayment}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                      >
                         Pay Now & Upgrade
                      </button>
                      <p className="text-xs text-gray-400 mt-2">Secured by Razorpay</p>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;