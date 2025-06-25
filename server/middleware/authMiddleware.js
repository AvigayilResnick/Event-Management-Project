import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
console.log("🔐 Loaded secret:", process.env.JWT_SECRET);
console.log("🔐 Length:", process.env.JWT_SECRET.length);
console.log("🧪 Secret used for VERIFYING:", process.env.JWT_SECRET);

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 Incoming Authorization header:", req.headers.authorization);

  if (!authHeader) return res.status(401).json({ message: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
next();

  } catch (err) {
     console.error("JWT verification failed:", err.message);
    res.status(403).json({ message: 'Invalid token' });
  }
};