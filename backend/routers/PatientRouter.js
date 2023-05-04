import express from 'express';
import {
    getPatientById,
    deletePatient,
    addPatient,
    updatePatient,
    patientLogin,
    getPatientByEmail,
    patientSignUp
} from '../controllers/PatientController.js';


const router = express.Router();

// Define the patient routes
router.get('/login', patientLogin);
router.get('/findbyID', getPatientById);
router.get('/findbyEmail', getPatientByEmail);
router.post('/addPatient', addPatient);
router.put('/:id', updatePatient);
router.post('/signup',patientSignUp)
//router.delete('/:id', deletePatient);//admin command

// Export the router
export default router;
