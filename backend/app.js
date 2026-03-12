import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./DB/Database.js";

import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";
import aiRoutes from "./Routers/aiRoutes.js"; // 🤖 AI ROUTES

const app = express();

/* ============================= */
/* Allowed Frontend URLs */
/* ============================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://coinflow-premchalase3-bytes-projects.vercel.app",
];

/* ============================= */
/* CORS Configuration */
/* ============================= */

app.use(
  cors({
    origin: function (origin, callback) {

      // allow requests with no origin (mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }

    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* ============================= */
/* Middlewares */
/* ============================= */

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(helmet());
app.use(morgan("dev"));

/* ============================= */
/* Routes */
/* ============================= */

app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

/* 🤖 AI Financial Advisor Route */

app.use("/api/ai", aiRoutes);

/* ============================= */
/* Health Check */
/* ============================= */

app.get("/", (req, res) => {
  res.send("CoinFlow Backend Running 🚀");
});

/* ============================= */
/* Start Server */
/* ============================= */

const PORT = process.env.PORT || 5000;

/* ============================= */
/* Connect MongoDB then Start */
/* ============================= */

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});