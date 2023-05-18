import express from "express";
import {
  getAllReportsLab,
  getAllReportsPatient,
  addReports,
  getClientPrescription,
  LabbyID,
  changePass,
  login,
} from "../controllers/LabController.js";
const router = express.Router();

router.post("/login", login);
router.post("/changePass", changePass);
router.post("/getAllReportsLab", getAllReportsLab);
router.get("/getClientPrescription", getClientPrescription);
router.get("/getAllReportsPatient", getAllReportsPatient);
router.post("/addReports", addReports);
router.get("/LabbyID", LabbyID);
export default router;
