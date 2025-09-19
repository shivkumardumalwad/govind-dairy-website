import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "govinddairy_secret";

export default function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ msg: "Access denied, admin only" });
    }
    req.user = decoded;  // attach decoded token data to request
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}
