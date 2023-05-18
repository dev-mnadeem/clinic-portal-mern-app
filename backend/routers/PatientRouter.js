import {
  getPatientById,
  updatePatient,
  patientLogin,
  getPatientByEmail,
  addAppointment,
  myPrescription,
  getAllAppointments,
  changePass,
} from "../controllers/PatientController.js";
import express from "express";
const router = express.Router();

// Define the patient routes
router.post("/login", patientLogin);
router.post("/changePass", changePass);
router.get("/findbyID", getPatientById);
router.get("/findbyEmail", getPatientByEmail);
router.put("/:id", updatePatient); //takes param
router.post("/addAppointment", addAppointment);
router.post("/myPrescription", myPrescription);
router.post("/getAllAppointments", getAllAppointments);
export default router;
