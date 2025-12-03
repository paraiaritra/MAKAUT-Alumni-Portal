import React, { useState } from 'react';
import { CheckCircle, Shield, Crown, Loader } from 'lucide-react';
import { paymentAPI } from '../services/api';

const Membership = ({ user, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);

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

      // 1. Create Order
      const orderRes = await paymentAPI.createOrder(500); 
      
      // 2. Razorpay Options
      const options = {
        key: "rzp_test_Rmm7Aii5K66Xvo", // Your Key ID
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'MAKAUT Alumni Association',
        description: 'Lifetime Premium Membership',
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await paymentAPI.verifyPayment(response);
            if (verifyRes.data.success) {
              alert('Payment Successful! Welcome to Premium.');
              if (onUpdateSuccess) onUpdateSuccess();
            }
          } catch (error) {
            alert('Payment verification failed on server.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#ea580c', // Orange theme
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 text-center text-white">
          <Crown size={64} className="mx-auto mb-4 text-yellow-300" />
          <h1 className="text-3xl font-bold mb-2">Alumni Membership</h1>
          <p className="text-orange-100 text-lg">Unlock the full potential of your alumni network</p>
        </div>

        <div className="p-8">
          {user?.membershipStatus === 'premium' ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">You are a Premium Member</h2>
              <p className="text-gray-600">Valid until: {user.membershipExpiry ? new Date(user.membershipExpiry).toDateString() : 'Lifetime'}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Why Upgrade?</h3>
                <ul className="space-y-4">
                  {[
                    "Access to exclusive job postings",
                    "Priority registration for events",
                    "Profile verified badge",
                    "Direct messaging with alumni",
                    "Voting rights in alumni elections"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-600">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100 text-center">
                <p className="text-gray-500 font-semibold mb-2">LIFETIME ACCESS</p>
                <div className="text-5xl font-bold text-gray-900 mb-6">₹500</div>
                
                <button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader className="animate-spin" /> : <Shield size={20} />}
                  {loading ? 'Processing...' : 'Become a Member'}
                </button>
                <p className="text-xs text-gray-400 mt-4">Secured by Razorpay • 100% Safe</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Membership;