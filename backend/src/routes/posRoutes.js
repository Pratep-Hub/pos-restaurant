import express from "express";
import Bill from "../models/Bill.js";

const router = express.Router();

// CREATE BILL
router.post("/bill", async (req, res) => {
  try {
    const { tableNo, items } = req.body;

    const calculatedItems = items.map(i => ({
      ...i,
      total: i.quantity * i.price
    }));

    const subtotal = calculatedItems.reduce((sum, i) => sum + i.total, 0);

    const bill = await Bill.create({
      tableNo,
      items: calculatedItems,
      subtotal,
      tax: 0,
      grandTotal: subtotal,
      paid: false,
      date: new Date()
    });

    res.json(bill);

  } catch (err) {
    console.error("Bill Save Error:", err);
    res.status(500).json({ error: "Bill save failed" });
  }
});

// MARK BILL AS PAID
router.post("/bill/:id/pay", async (req, res) => {
  try {
    await Bill.findByIdAndUpdate(req.params.id, { paid: true });
    res.json({ message: "Bill marked as paid" });
  } catch (err) {
    console.error("Pay Bill Error:", err);
    res.status(500).json({ error: "Payment update failed" });
  }
});

export default router;
