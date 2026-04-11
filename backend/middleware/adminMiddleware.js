const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Header se token uthao
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided. Please login. 🔐" });
    }

    const token = authHeader.split(" ")[1];

    // Verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role } ab har route mein milega

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
    return res.status(401).json({ message: "Invalid token. Access denied. ❌" });
  }
};

module.exports = authMiddleware;