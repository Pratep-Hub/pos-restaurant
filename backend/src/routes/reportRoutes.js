import express from "express";
import Bill from "../models/Bill.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const getDayRange = (dateStr) => {
  const d = new Date(dateStr);
  return {
    start: new Date(d.setHours(0, 0, 0, 0)),
    end: new Date(d.setHours(23, 59, 59, 999)),
  };
};

router.get("/daily", protect, async (req, res) => {
  try {
    const { date } = req.query;
    const { start, end } = getDayRange(date);

    const bills = await Bill.find({
      date: { $gte: start, $lte: end },
      paid: true
    });

    const totalAmount = bills.reduce((sum, b) => sum + b.grandTotal, 0);

    res.json({
      date,
      totalAmount,
      billCount: bills.length,
      bills
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
