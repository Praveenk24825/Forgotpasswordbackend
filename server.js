import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: [process.env.CLIENT_URL, "http://localhost:5173"],
  methods: ["POST"],
}));

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => res.send("🚀 API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
