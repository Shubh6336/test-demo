import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Body parsers - ORDER MATTERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/test", (req, res) => {
  console.log("Received body:", req.body);
  res.json({ message: "POST works!", data: req.body });
});

// Routes
import userRouter from "./routes/user.routes.js";
app.use("/user", userRouter);

export { app };
