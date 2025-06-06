const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "ไม่พบ token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // สามารถใช้งาน req.user ใน controller ได้
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token ไม่ถูกต้อง" });
  }
};
