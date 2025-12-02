import React, { useState } from 'react';
import { X, Upload, CreditCard, User, Loader } from 'lucide-react';
import { alumniAPI, paymentAPI } from '../services/api';

const EditProfileModal = ({ user, onClose, onUpdateSuccess }) => {
  const [activeTab, setActiveTab] = useState('details'); // details, photo, membership
  const [loading, setLoading] = useState(false);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    bio: user?.profile?.bio || '',
    company: user?.company || '',
    location: user?.location || '',
  });

  // 1. Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await alumniAPI.updateProfile(formData);
      alert('Profile Updated Successfully!');
      onUpdateSuccess(); // Refresh user data
      onClose();
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Image Upload
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
      alert('Upload failed. Make sure image is under 2MB.');
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
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // A. Create Order on Backend
      const orderData = await paymentAPI.createOrder(500); // ₹500 Membership Fee
      
      // B. Options for Razorpay Modal
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Frontend Key
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'MAKAUT Alumni Portal',
        description: 'Lifetime Membership',
        order_id: orderData.data.id,
        handler: async function (response) {
          // C. Verify Payment on Backend
          try {
            const verifyRes = await paymentAPI.verifyPayment(response);
            if (verifyRes.data.success) {
              alert('Payment Successful! You are now a Premium Member.');
              onUpdateSuccess();
              onClose();
            }
          } catch (error) {
            alert('Payment verification failed');
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
      alert('Something went wrong with payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'details' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          >
            <User size={16} className="inline mr-1" /> Details
          </button>
          <button 
            onClick={() => setActiveTab('photo')}
            className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'photo' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          >
            <Upload size={16} className="inline mr-1" /> Photo
          </button>
          <button 
            onClick={() => setActiveTab('membership')}
            className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'membership' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          >
            <CreditCard size={16} className="inline mr-1" /> Membership
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader className="animate-spin text-indigo-600 mb-2" size={32} />
              <p className="text-gray-500">Processing...</p>
            </div>
          ) : (
            <>
              {/* DETAILS TAB */}
              {activeTab === 'details' && (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company / Organization</label>
                    <input 
                      type="text" 
                      className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio / About</label>
                    <textarea 
                      className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                      rows="3"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700">
                    Save Changes
                  </button>
                </form>
              )}

              {/* PHOTO TAB */}
              {activeTab === 'photo' && (
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full border-4 border-indigo-100 overflow-hidden">
                    <img src={user.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} alt="Current" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 inline-flex items-center gap-2">
                      <Upload size={16} /> Choose New Image
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">Max size 2MB. JPG, PNG supported.</p>
                </div>
              )}

              {/* MEMBERSHIP TAB */}
              {activeTab === 'membership' && (
                <div className="text-center space-y-4">
                  {user.membershipStatus === 'premium' ? (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <h3 className="text-green-800 font-bold text-lg">You are a Premium Member! 🌟</h3>
                      <p className="text-green-600 text-sm mt-1">Thank you for supporting the community.</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                        <h3 className="text-yellow-800 font-bold">Free Membership</h3>
                        <p className="text-yellow-600 text-sm">Upgrade to unlock exclusive networking features.</p>
                      </div>
                      <div className="py-2">
                        <p className="text-2xl font-bold text-gray-800">₹500 <span className="text-sm font-normal text-gray-500">/ lifetime</span></p>
                      </div>
                      <button 
                        onClick={handlePayment}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                      >
                        Upgrade to Premium
                      </button>
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