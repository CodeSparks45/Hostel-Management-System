// backend/middleware/isRector.js

const isRector = (req, res, next) => {
  // Assuming your previous authMiddleware sets req.user
  if (req.user && (req.user.role === 'rector' || req.user.role === 'admin')) {
    next(); // User is a rector, proceed to the route
  } else {
    return res.status(403).json({ 
      success: false, 
      message: "Access Denied: Only Rectors can perform this action." 
    });
  }
};

module.exports = isRector;