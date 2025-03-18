import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./router/index";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,

    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: [
    //   "Content-Type",
    //   "Authorization",
    //   "X-Requested-With",
    //   "Accept",
    // ],
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
const server = http.createServer(app);

server.listen(8050, () => {
  console.log("Server running on http://localhost:8050/");
});
const MONGO_URL = process.env.DATABASE_URL;

if (!MONGO_URL) {
  console.error('DATABASE_URL is not defined in environment variables');
  process.exit(1);
}
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: Error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

  
app.use("/api/", router());