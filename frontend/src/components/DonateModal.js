import React, { useState } from 'react';
import { X, Smartphone, QrCode, Copy, Check } from 'lucide-react';

const DonateModal = ({ onClose }) => {
  const [amount, setAmount] = useState('500');
  const [copied, setCopied] = useState(false);

  // --- YOUR DETAILS ---
  const UPI_ID = "paraiaritra-2@okhdfcbank"; 
  const PAYEE_NAME = "ARITRA PARAI"; 
  // --------------------

  // Construct the UPI Deep Link
  // pa = Payee Address, pn = Payee Name, am = Amount, cu = Currency
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR`;
  
  // QR Code API (Generates a QR image from the link)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Donate via UPI
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (INR)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2 pl-8 pr-4 focus:ring-2 focus:ring-pink-500 outline-none font-bold text-lg"
              />
            </div>
          </div>

          {/* Desktop View: QR Code */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-500 mb-3 font-medium flex items-center gap-2">
              <QrCode size={16} /> Scan to Pay with GPay / PhonePe
            </p>
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <img src={qrCodeUrl} alt="Donate QR" className="w-48 h-48" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Paying to: {PAYEE_NAME}</p>
          </div>

          {/* Mobile View: Direct Button */}
          <div className="md:hidden">
            <a 
              href={upiLink} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Smartphone size={20} /> Tap to Pay via UPI
            </a>
            <p className="text-center text-xs text-gray-400 mt-2">Opens Google Pay, PhonePe, or Paytm</p>
          </div>

          {/* Manual Copy Section */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500 mb-2">Or copy UPI ID manually:</p>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border border-gray-200">
              <span className="font-mono text-gray-700 font-medium select-all">{UPI_ID}</span>
              <button 
                onClick={handleCopy}
                className="text-gray-500 hover:text-pink-600 transition-colors p-1"
                title="Copy UPI ID"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DonateModal;