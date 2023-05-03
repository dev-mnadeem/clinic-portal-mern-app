import mongoose from 'mongoose';
import express from "express";
import PatientRouter from "./routers/PatientRouter.js";
import DoctorRouter from "./routers/DoctorRouter.js";
import PharmRouter from "./routers/PharmRouter.js";
import LabRouter from "./routers/LabRouter.js";
import adminRouter from "./routers/adminRouter.js";
import cors from "cors";
const app = express();
app.use(express.json({limit:"64kb"}));
app.use(cors({origin:(process.env.CORS_ORIGIN || "http://localhost:3000").split(",")}));

app.get("/health", (req,res) => res.status(mongoose.connection.readyState===1?200:503).json({ready:mongoose.connection.readyState===1}));
app.use("/api/Patients", PatientRouter);
app.use("/api/Doctors", DoctorRouter);
app.use("/api/Pharmacies", PharmRouter);
app.use("/api/Labs", LabRouter);
app.use("/api/Admin", adminRouter);
app.use("*", (req, res) => {
  res.status(404).json({error:"Not found"});
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.name === 'CastError') return res.status(400).json({error:'Invalid record identifier'});
  if (error.expose && error.status >= 400 && error.status < 500) return res.status(error.status).json({error:error.message});
  console.error('Clinic request failed:', error.name);
  res.status(500).json({error:'Internal server error'});
});
export default app;
