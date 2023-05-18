import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import PatientRouter from "./routers/PatientRouter.js";
import DoctorRouter from "./routers/DoctorRouter.js";
import PharmRouter from "./routers/PharmRouter.js";
import LabRouter from "./routers/LabRouter.js";
import adminRouter from "./routers/adminRouter.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/Patients", PatientRouter);
app.use("/api/Doctors", DoctorRouter);
app.use("/api/Pharmacies", PharmRouter);
app.use("/api/Labs", LabRouter);
app.use("/api/Admin", adminRouter);
app.use("*", (req, res) => {
  res.status(404);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
