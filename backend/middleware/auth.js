const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";



function authenticateUser(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "user") {
      return res.status(403).json({ error: "Not a user token" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function authenticateAdmin(req, res, next) {
  const token = req.cookies.adminToken; // ✅ read from adminToken cookie

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

module.exports = { authenticateUser, authenticateAdmin };
