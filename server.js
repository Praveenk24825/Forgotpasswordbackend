import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Health check route
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

// Routes
app.use('/api/auth', authRoutes);

// Server listen
const PORT = process.env.PORT || 5000; // Better keep default 5000 for APIs
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
