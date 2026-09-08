import { signIn, roleAccess, changeOwnPassword } from '../security/access.js';
import rateLimit from 'express-rate-limit';
import express from "express";
import {
  DoctorbyID,
  getAllPendingAppointments,
  rejectAppointments,
  addPrescription,
  addReport,
  getAllAcceptedAppointments,
  acceptAppointments,
  getPatientReport,
  addReportRemarks,
} from "../controllers/DoctorController.js";
//import * as DocModule from "../controllers/DoctorController.js"
const router = express.Router();
router.post('/login', rateLimit({windowMs:15 * 60 * 1000, limit:20, standardHeaders:'draft-7', legacyHeaders:false}), signIn('doctor'));
router.use(roleAccess('doctor'));


router.post('/changePass', changeOwnPassword('doctor'));
router.get("/DoctorbyID", DoctorbyID);
router.post("/addPrescription", addPrescription);
router.post("/addReport", addReport);
router.post("/getAllPendingAppointments", getAllPendingAppointments);
router.post("/getAllAcceptedAppointments", getAllAcceptedAppointments);
router.post("/rejectAppointments", rejectAppointments);
router.post("/acceptAppointments", acceptAppointments);
router.post("/getPatientReport",getPatientReport);
router.post("/addReportRemarks",addReportRemarks)
export default router;
