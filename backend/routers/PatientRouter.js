import express from "express";
import {
  getPatientById,
  updatePatient,
  patientLogin,
  getPatientByEmail,
  addAppointment,
  myPrescription,
  getAllAppointments,
} from "../controllers/PatientController.js";

const router = express.Router();

// Define the patient routes
router.post("/login", patientLogin);
router.get("/findbyID", getPatientById);
router.get("/findbyEmail", getPatientByEmail);
router.put("/:id", updatePatient); //takes param
router.post("/addAppointment", addAppointment);
router.get("/myPrescription", myPrescription);
router.post("/getAllAppointments", getAllAppointments);
export default router;
