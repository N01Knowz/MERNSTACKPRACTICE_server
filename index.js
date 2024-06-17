import express from "express";
import mongoose from "mongoose";
import booksRoute from "./routes/booksRoute.js";
import cors from "cors";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cookieParser());

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
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
  //   console.log(request);
  return response.status(234).send("WELCOME TO MERN STACK TUTORIAL");
});

app.use("/books", booksRoute);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("App connected to database");

    app.listen(process.env.PORT, () => {
      console.log(`App is listening to PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
