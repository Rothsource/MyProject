import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // load your .env

export const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  // Extract token: format is "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Malformed token" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    // Attach decoded payload to request object
    req.user = decoded; 
    next(); // call the next middleware or route handler
  });
};
