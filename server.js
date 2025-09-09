import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// ✅ Fix CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",        // React dev
      "https://qwery98.netlify.app"   // Netlify frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Root route for Render / testing
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// Routes
app.use("/api/auth", authRoutes);

// Connect DB and Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
