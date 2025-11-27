import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import posRoutes from "./src/routes/posRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";

dotenv.config();

const app = express();

/* ----------------------
   FIX CORS 100% (Render)
---------------------- */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://pos-restaurant-frontend.onrender.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

// ALSO add express.json
app.use(express.json());

// Connect MongoDB
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("POS API running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pos", posRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
