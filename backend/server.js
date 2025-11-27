import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import posRoutes from "./src/routes/posRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";

dotenv.config();

const app = express();

// Correct CORS for Render Deployment
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://pos-restaurant-frontend.onrender.com"
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Connect MongoDB
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("POS API running");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/pos", posRoutes);
app.use("/api/reports", reportRoutes);

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
