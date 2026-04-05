module.exports = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only ❌" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
