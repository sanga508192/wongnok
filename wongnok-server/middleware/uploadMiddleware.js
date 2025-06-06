const multer = require("multer");
const path = require("path");

// ตั้งค่าที่เก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// ฟิลเตอร์ไฟล์ให้เฉพาะ .jpg .jpeg .png เท่านั้น
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("รองรับเฉพาะไฟล์รูปภาพ .jpg .jpeg .png"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
