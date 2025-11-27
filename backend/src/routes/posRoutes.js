import express from "express";
import Bill from "../models/Bill.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/bill", protect, async (req, res) => {
  try {
    const { tableNo, items } = req.body;

    const subtotal = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const bill = await Bill.create({
      tableNo,
      items: items.map((i) => ({
        ...i,
        total: i.price * i.quantity
      })),
      subtotal,
      tax: 0,
      grandTotal: subtotal,
      paid: false
    });

    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/bill/:id/pay", protect, async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { paid: true },
      { new: true }
    );
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
