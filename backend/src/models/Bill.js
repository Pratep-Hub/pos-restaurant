import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  total: Number
});

const billSchema = new mongoose.Schema({
  tableNo: { type: String, required: true },
  items: [itemSchema],
  subtotal: Number,
  tax: Number,
  grandTotal: Number,
  date: { type: Date, default: Date.now },
  paid: { type: Boolean, default: false }
});

export default mongoose.model("Bill", billSchema);
