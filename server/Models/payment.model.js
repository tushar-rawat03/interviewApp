import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ fix: was missing type entirely
      ref: "User",
      required: true,
    },
    planId: String,
    amount: Number,
    credits: Number,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
