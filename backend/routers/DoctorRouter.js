import express from "express";
import {
  login,
  changePass,
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

router.post("/login", login);
router.post("/changePass", changePass);
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
