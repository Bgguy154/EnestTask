import express, { json } from "express";

import { connect } from "mongoose";

import { config } from "dotenv";

import cookieParser from "cookie-parser";
import cors from 'cors'

//import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

import "./middleware/authMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import dns from 'dns';
// Change DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

config();

const app = express();

//app.use(helmet());

app.use(json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());

connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))

  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("MERN Task Manager API is running!");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Backend is running",
    timestamp: new Date().toISOString()
  });
});

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
