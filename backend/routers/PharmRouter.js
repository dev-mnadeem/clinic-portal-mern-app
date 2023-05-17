import  express from "express";
import {login,changePass,PharmbyID,getClientPrescription,getAllMedicine,addMedicine} from "../controllers/PharmController.js";
const router = express.Router();

router.post("/login",login)
router.post("/changePass",changePass)
router.get("/PharmbyID",PharmbyID)
router.get("/getClientPrescription",getClientPrescription)
router.get("/getAllMedicine",getAllMedicine)
router.post("addMedicine",addMedicine)
export default router