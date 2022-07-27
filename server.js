import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";

connectDB();

import authRoutes from "./router/auth.js";
const app = express();
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server is running on ${PORT}`));
