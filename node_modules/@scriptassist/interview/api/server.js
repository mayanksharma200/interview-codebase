import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "@vercel/node";

dotenv.config();

const app = express();
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

const allowedOrigins = [
  "https://your-frontend-domain.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// Define your routes
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "lax",
    });
    return res.json({ token });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Export the Express app as a Vercel serverless function
export default createServer(app);
