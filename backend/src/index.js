import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./route/auth.route.js";
import userRoutes from "./route/user.route.js";
import storeRoutes from "./route/store.route.js";
import ratingRoutes from "./route/rating.route.js";
import dashboardRoutes from "./route/dashboard.route.js";

import { connectDB } from "./utils/connectDB.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5500", // frontend origin
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server active on Port ${PORT}`);
  connectDB();
});
