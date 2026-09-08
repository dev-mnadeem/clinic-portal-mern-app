import { signIn, roleAccess, changeOwnPassword } from '../security/access.js';
import rateLimit from 'express-rate-limit';
import express from "express";
import {
  getAllReportsLab,
  getAllReportsPatient,
  addReports,
  getClientPrescription,
  LabbyID,
  addReportRemarks,
  getAllReport,
} from "../controllers/LabController.js";
const router = express.Router();
router.post('/login', rateLimit({windowMs:15 * 60 * 1000, limit:20, standardHeaders:'draft-7', legacyHeaders:false}), signIn('lab'));
router.use(roleAccess('lab'));


router.post('/changePass', changeOwnPassword('lab'));
router.post("/getAllReportsLab", getAllReportsLab);
router.get("/getClientPrescription", getClientPrescription);
router.get("/getAllReportsPatient", getAllReportsPatient);
router.post("/addReports", addReports);
router.get("/LabbyID", LabbyID);
router.post("/addReportRemarks", addReportRemarks);
router.get("/getAllReport", getAllReport);
export default router;
