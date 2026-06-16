import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config(); 

// ✅ fix: dotenv.config() should be called once in server.js/index.js,
// not in individual service files — calling it here may run before
// env vars are loaded depending on import order
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
