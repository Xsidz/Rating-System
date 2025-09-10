import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./route/auth.route.js";
import adminRoute from "./route/user.route.js"
import storeRoutes from "./route/store.route.js"
import { connectDB } from "./utils/connectDB.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5500",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use("/auth", authRoute);
app.use("/api/users", adminRoute)
app.use("/",storeRoutes)

app.listen(PORT, (req, res) => {
  console.log("Server active on Port" + " " + PORT);
  connectDB();
});

