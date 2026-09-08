import Doctor from '../models/DoctorModel.js';
import { signIn, roleAccess, changeOwnPassword } from '../security/access.js';
import rateLimit from 'express-rate-limit';
import {
  getPatientById,
  updatePatient,
  getPatientByEmail,
  addAppointment,
  myPrescription,
  getAllAppointments,
  getMyReport,
} from "../controllers/PatientController.js";
import express from "express";
const router = express.Router();
router.post('/login', rateLimit({windowMs:15 * 60 * 1000, limit:20, standardHeaders:'draft-7', legacyHeaders:false}), signIn('patient'));
router.use(roleAccess('patient'));


// Define the patient routes
router.post('/changePass', changeOwnPassword('patient'));
router.get("/findbyID", getPatientById);
router.get("/findbyEmail", getPatientByEmail);
router.put("/:id", updatePatient); //takes param
router.post("/addAppointment", addAppointment);
router.post("/myPrescription", myPrescription);
router.post("/getAllAppointments", getAllAppointments);
router.post("/getMyReport",getMyReport);
router.get('/doctors', async (req,res,next) => {
  try {res.json(await Doctor.find().select('_id name specification'));} catch(error) {next(error);}
});
export default router;
