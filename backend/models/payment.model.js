import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    Oid: {
      type: String,
    },
    productDetails: {
      type: Object,
      required: true,
    },
    payment_status:{
      type:String,
      default:"unpaid"
    },
    created:{
      type:Number,
    },
    amount:{
      type:Number,
    }
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model("Payment", paymentSchema);
