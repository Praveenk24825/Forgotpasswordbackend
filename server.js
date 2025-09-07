import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

// ✅ Fix CORS
app.use(cors({
  origin: ["http://localhost:5173", process.env.CLIENT_URL], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// DB connection
connectDB();

// Health check
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
