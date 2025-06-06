const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "wongnok_super_secret_key"; // ควรใช้ process.env.JWT_SECRET ในโปรดักชัน

// สมัครสมาชิก
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashed });
    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// ล็อกอิน
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, name: user.name, email: user.email });
});

module.exports = router;
