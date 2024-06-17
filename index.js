import express from "express";
import mongoose from "mongoose";
import booksRoute from "./routes/booksRoute.js";
import cors from "cors";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cookieParser());

// app.use(cors());
const allowedOrigins = [
  "http://localhost:3000",
  "https://mernstackpractice-client.vercel.app",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow requests with no Origin header

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);
      } else {
        return callback(new Error("Origin not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "csrf-token"], // Include csrf-token in allowed headers
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get("/", (request, response) => {
  let message = "Welcome to MERN Stack Tutorial!";
  if (process.env.NODE_ENV === "production") {
    message += " [Deployed]";
  }
  return response.status(200).send(message);
});

app.use("/books", booksRoute);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("App connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

export default app;
