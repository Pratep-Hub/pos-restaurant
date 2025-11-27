import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import posRoutes from "./src/routes/posRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",   
  })
);

app.use(express.json());

// Connect MongoDB
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("POS API Running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pos", posRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
