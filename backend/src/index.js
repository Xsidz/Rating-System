import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./route/auth.route.js";
import { connectDB } from "./utils/connectDB.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use("/auth", authRoute);

app.listen(PORT, (req, res) => {
  console.log("Server active on Port" + " " + PORT);
  connectDB();
});

