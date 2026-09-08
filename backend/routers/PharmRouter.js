import Prescription from '../models/prescriptionModel.js';
import Patient from '../models/patientModel.js';
import { signIn, roleAccess, changeOwnPassword } from '../security/access.js';
import rateLimit from 'express-rate-limit';
import express from "express";
import {
  PharmbyID,
  getClientPrescription,
  getAllMedicine,
  addMedicine,
  deliverMedicine,
} from "../controllers/PharmController.js";
const router = express.Router();
router.post('/login', rateLimit({windowMs:15 * 60 * 1000, limit:20, standardHeaders:'draft-7', legacyHeaders:false}), signIn('pharmacy'));
router.use(roleAccess('pharmacy'));


router.post('/changePass', changeOwnPassword('pharmacy'));
router.get("/PharmbyID", PharmbyID);
router.post("/getClientPrescription", getClientPrescription);
router.post("/getAllMedicine", getAllMedicine);
router.post("/addMedicine", addMedicine);
router.post("/deliverMedicine", deliverMedicine);
router.get('/patients', async (req,res,next) => {
  try {
    const ids=await Prescription.find({pharmacyId:req.actor.id,delivered:false}).distinct('patientId');
    res.json(await Patient.find({_id:{$in:ids}}).select('_id name'));
  } catch(error) {next(error);}
});
export default router;
