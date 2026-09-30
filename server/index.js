import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import AuthRouter from "./src/routers/authRouter.js";
import UserRouter from "./src/routers/userRouter.js";

import http from "http";
import { Server } from "socket.io";
import WebSocket from "./src/config/webSocket.js";

const app = express();

import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean),
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

// Health check
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Mingo Chat 678 API is running 🚀" });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("❌ Error:", err);
  res.status(statusCode).json({ success: false, message });
});
const PORT = process.env.PORT || 10000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

WebSocket(io);

async function startServer() {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
}

startServer();