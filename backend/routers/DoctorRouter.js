import express  from "express";
 import {
    login,
    changePass,
    DoctorbyID,
    getAllAppointments,
    rejectAppointments,
    addPrescription,
    addReport
} from "../controllers/DoctorController.js"
//import * as DocModule from "../controllers/DoctorController.js"
const router = express.Router()

router.post("/login",login)
router.post("/changePass",changePass)
router.get("/DoctorbyID",DoctorbyID)
router.get("/getAllAppointments",getAllAppointments)
router.post("/rejectAppointments",rejectAppointments)
router.post("/addPrescription",addPrescription)
router.post("/addReport",addReport)
export default router