import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tableNo: {
    type: String,
    required: true,
    unique: true    // example: T1, T2, T3
  },
  status: {
    type: String,
    enum: ["available", "occupied"],
    default: "available"
  },
  currentBillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bill",
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model("Table", tableSchema);
