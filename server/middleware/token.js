import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]?.trim();
    if (!token) return res.status(403).json({ message: "Missing Token" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User does not exist" });

    req.user = user;
    next();
  } catch (error) {
    console.log("verifyToken error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
