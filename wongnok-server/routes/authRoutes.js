const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// สมัคร
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: "Username ซ้ำ" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed, role: "member" });

  
  await user.save();
  res.status(201).json({ message: "สมัครสำเร็จ" });
});

// ล็อกอิน
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "ไม่พบผู้ใช้" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });

const token = jwt.sign(
  { userId: user._id, username: user.username }, // ✅ เพิ่ม username ลงไป
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

  res.json({ token });
});

module.exports = router;
