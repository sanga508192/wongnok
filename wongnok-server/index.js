const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const recipeRoutes = require('./routes/recipeRoutes');
app.use('/api/recipes', recipeRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.get('/', (req, res) => {
  res.send('Wongnok Recipes API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const path = require('path');

// เพิ่ม middleware สำหรับเสิร์ฟรูป
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

