import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";
import path from "path";
import fs from "fs";

import { Server } from "socket.io";

import connectDB from "./src/config/db.js";
import AuthRouter from "./src/routers/authRouter.js";
import UserRouter from "./src/routers/userRouter.js";
import WebSocket from "./src/config/webSocket.js";

const app = express();

/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log("🌐 Allowed Origins:", allowedOrigins);

const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/uploads", express.static(uploadsDir));


app.use("/api/auth", AuthRouter);

app.use("/api/user", UserRouter);


app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Mingo Chat 678 API is running 🚀",
  });
});


app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  const statusCode = err.statusCode || 500;

  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
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
    console.log("🔄 Connecting to MongoDB...");

    await connectDB();

    console.log("✅ MongoDB connected successfully");

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Mingo backend running on port ${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:");
    console.error(error);

    process.exit(1);
  }
}

startServer();