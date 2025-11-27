import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// Signup – only if no admin exists
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Allow only ONE admin
    const existingAdmin = await User.findOne();
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const user = await User.create({ name, email, password });

    return res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
