import express from 'express';
import {
    getPatientById,
    updatePatient,
    patientLogin,
    getPatientByEmail,
    addAppointment,
    myPrescription
} from'../controllers/PatientController.js';


const router = express.Router();

// Define the patient routes
router.get('/login', patientLogin);
router.get('/findbyID', getPatientById);
router.get('/findbyEmail',getPatientByEmail);
router.put('/:id', updatePatient);//takes param
router.post("/addAppointment",addAppointment)
router.get("/myPrescription",myPrescription)
export default router;
