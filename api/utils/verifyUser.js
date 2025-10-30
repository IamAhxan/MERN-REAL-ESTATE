import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  try {
    // ✅ Prefer cookie, fallback to Authorization header
    const token =
      req.cookies?.access_token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      console.log("❌ No token found");
      return next(errorHandler(401, "Unauthorized"));
    }

    // ✅ Verify JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("❌ Invalid or expired token:", err.message);
        return next(errorHandler(403, "Forbidden"));
      }

      // ✅ Attach decoded user (contains id)
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(errorHandler(500, "Token verification failed"));
  }
};
