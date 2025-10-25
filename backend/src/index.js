import express from "express";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import activityRoutes from "./routes/activityRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

dotenv.config();
const app = express();

// Performance optimizations
app.use(compression()); // Enable gzip compression
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add response headers for better caching
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache
  next();
});

app.use("/api/activities", activityRoutes);
app.use("/api/goals", goalRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend server is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
