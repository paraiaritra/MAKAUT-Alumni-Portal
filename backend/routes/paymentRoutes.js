const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
// FIX: Ensure this points to '../middleware/auth', NOT 'authMiddleware'
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. Create Order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body; 
    
    // Short receipt ID to fit Razorpay's 40-char limit
    const shortReceiptId = `rcpt_${Date.now().toString().slice(-8)}`;

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: shortReceiptId, 
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Razorpay Create Order Error:", err); // Log error for debugging
    res.status(500).send(err);
  }
});

// 2. Verify Payment
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log("--- Starting Payment Verification ---");
    console.log("User:", req.user.email);
    console.log("Order ID:", razorpay_order_id);
    console.log("Payment ID:", razorpay_payment_id);
    
    // DEBUG: Check if Secret exists (Safety check)
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("FATAL ERROR: RAZORPAY_KEY_SECRET is missing in Environment Variables!");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Generate Expected Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    console.log("Signature Expected:", expectedSignature);
    console.log("Signature Received:", razorpay_signature);

    if (expectedSignature === razorpay_signature) {
      console.log("Payment Verified Successfully. Updating User...");
      
      // Payment Successful - Update User
      const user = await User.findById(req.user._id);
      user.membershipStatus = 'premium';
      // Set expiry to 1 year from now
      user.membershipExpiry = new Date(new Date().setFullYear(new Date().getFullYear() + 1)); 
      await user.save();

      console.log("User upgraded to Premium.");
      res.json({ success: true, message: 'Membership activated!' });
    } else {
      console.error("Signature Mismatch! This usually means the Key Secret on Backend doesn't match the Key ID on Frontend.");
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    console.error("Razorpay Verify API Error:", err);
    res.status(500).json({ message: 'Verification failed' });
  }
});

module.exports = router;