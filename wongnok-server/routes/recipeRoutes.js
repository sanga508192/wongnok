const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // ✅ import multer middleware
const Upload = require("../models/Upload"); // ✅ import model


// ✅ GET: ดึงสูตรอาหารทั้งหมด
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

// ✅ POST: เพิ่มสูตร ต้องล็อกอิน
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, ingredients, duration, difficulty, imageUrl } = req.body;

    const recipe = new Recipe({
      name,
      ingredients,
      duration,
      difficulty,
      imageUrl: imageUrl || "", // ✅ หากไม่อัปโหลดรูป
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    console.error("❌ POST /recipes error:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ PUT: แก้ไขสูตร ต้องล็อกอิน
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, ingredients, duration, difficulty, imageUrl } = req.body;

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { name, ingredients, duration, difficulty, imageUrl: imageUrl || "" },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "ไม่พบเมนูนี้" });
    }

    res.json(updated);
  } catch (error) {
    console.error("❌ PUT /recipes error:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ DELETE: ลบสูตร ต้องล็อกอิน
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "ไม่พบเมนูนี้" });
    }
    res.json({ message: "ลบสำเร็จ" });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    res.status(500).json({ error: error.message });
  }
});



// ✅ Route อัปโหลดรูป
router.post("/upload", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // ✅ บันทึกลง DB
    const newUpload = new Upload({
      filename: req.file.filename,
    });
    await newUpload.save();

    res.status(200).json({ imageUrl: imagePath });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "อัปโหลดไม่สำเร็จ" });
  }
});

// ✅ Route สำหรับดูประวัติการอัปโหลด
router.get("/uploads", verifyToken, async (req, res) => {
  try {
    const uploads = await Upload.find({ uploadedBy: req.user.userId }).sort({ uploadedAt: -1 });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถดึงประวัติการอัปโหลดได้" });
  }
});

module.exports = router;
