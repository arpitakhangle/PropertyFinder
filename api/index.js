import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingrouter from "./routes/listing.route.js";
import path from "path";
console.log("MONGO URL:", process.env.MONGO);

dotenv.config();

const __dirname = path.resolve();
const app = express();

// ✅ Connect to MongoDB (ONLY ONCE)
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingrouter);

// Serve Frontend
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Start server AFTER middleware setup
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
