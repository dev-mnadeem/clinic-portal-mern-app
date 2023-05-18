import express from "express";
import {
  login,
  changePass,
  PharmbyID,
  getClientPrescription,
  getAllMedicine,
  addMedicine,
  deliverMedicine,
} from "../controllers/PharmController.js";
const router = express.Router();

router.post("/login", login);
router.post("/changePass", changePass);
router.get("/PharmbyID", PharmbyID);
router.post("/getClientPrescription", getClientPrescription);
router.post("/getAllMedicine", getAllMedicine);
router.post("/addMedicine", addMedicine);
router.post("/deliverMedicine", deliverMedicine);
export default router;
