import Report from '../models/reportModel.js';
import Prescription from '../models/prescriptionModel.js';
import Laboratory from '../models/LaboratoryModel.js';
import Pharmacy from '../models/PharmacyModel.js';
import { signIn, roleAccess, changeOwnPassword } from '../security/access.js';
import rateLimit from 'express-rate-limit';
import express from "express";
import {
  addPatient,
  addPharmacy,
  addDoctor,
  addLab,
  getAllPatients,
  getAllPharmacies,
  getAllDoctors,
  getAllLabs,
  delPatient,
  delDoctor,
  delPharmacy,
  delLab,
  updatePatient,
  updateDoctor,
  updatePharmacy,
  updateLab,
  signup,
} from "../controllers/adminController.js";
const Router = express.Router();
Router.post('/login', rateLimit({windowMs:15 * 60 * 1000, limit:20, standardHeaders:'draft-7', legacyHeaders:false}), signIn('admin'));
Router.use(roleAccess('admin'));
Router.post('/changePass', changeOwnPassword('admin'));


Router.post("/addPatient", addPatient); //checked
Router.post("/addPharmacy", addPharmacy); //checked
Router.post("/addDoctor", addDoctor); //checked
Router.post("/addLab", addLab); //checked
Router.get("/getAllPatients", getAllPatients); //checked
Router.get("/getAllPharmacies", getAllPharmacies); //checked
Router.get("/getAllDoctors", getAllDoctors); //checked
Router.get("/getAllLabs", getAllLabs); //checked
Router.post("/delPatient", delPatient); //checked
Router.post("/delDoctor", delDoctor); //checked
Router.post("/delPharmacy", delPharmacy); //checked
Router.post("/delLab", delLab);
Router.post("/updatePatient", updatePatient);
Router.post("/updateDoctor", updateDoctor);
Router.post("/updatePharmacy", updatePharmacy);
Router.post("/updateLab", updateLab);
Router.post("/addAdmin", signup);

Router.post('/assignReport', async (req, res, next) => {
  try {
    const {reportId, LabId} = req.body.data || {};
    if (!reportId || !LabId || !await Laboratory.exists({_id:LabId})) return res.status(400).json({error:'Valid reportId and LabId are required'});
    const report = await Report.findByIdAndUpdate(reportId, {$set:{LabId}}, {new:true,runValidators:true});
    if (!report) return res.status(404).json({error:'Report not found'});
    return res.json(report);
  } catch (error) {next(error);}
});
Router.post('/assignPrescription', async (req, res, next) => {
  try {
    const {prescriptionId, pharmacyId} = req.body.data || {};
    if (!prescriptionId || !pharmacyId || !await Pharmacy.exists({_id:pharmacyId})) return res.status(400).json({error:'Valid prescriptionId and pharmacyId are required'});
    const prescription = await Prescription.findOneAndUpdate({_id:prescriptionId,delivered:false}, {$set:{pharmacyId}}, {new:true,runValidators:true});
    if (!prescription) return res.status(404).json({error:'Undelivered prescription not found'});
    return res.json(prescription);
  } catch (error) {next(error);}
});
Router.get('/assignments', async (req,res,next) => {
  try {
    const [reports,prescriptions,labs,pharmacies]=await Promise.all([
      Report.find({LabId:null}).select('_id patientName Type'),
      Prescription.find({pharmacyId:null,delivered:false}).select('_id patientId Medicine Quantity').populate('patientId','name'),
      Laboratory.find().select('_id name'),
      Pharmacy.find().select('_id name'),
    ]);
    res.json({reports,prescriptions,labs,pharmacies});
  } catch(error) {next(error);}
});
export default Router;
