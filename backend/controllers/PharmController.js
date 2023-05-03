import mongoose from 'mongoose';
import Patient from "../models/patientModel.js";
import Pharmacy from "../models/PharmacyModel.js";
import Prescription from "../models/prescriptionModel.js";

const PharmbyID = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.actor.id);
    if (!pharmacy) return res.status(404).json({ error: "Pharmacy not found" });
    res.json(pharmacy);
  } catch (error) {
    next(error);
  }
};

const getClientPrescription = async (req, res, next) => {
  try {
    const patientId = req.body.data?.patientId;
    if (!patientId) return res.status(400).json({ error: "patientId is required" });
    if (!await Patient.exists({ _id: patientId })) return res.status(404).json({ error: "Patient not found" });
    const pres = await Prescription.find({ pharmacyId: req.actor.id, patientId, delivered: false });
    res.json({ Prescription: pres });
  } catch (error) {
    next(error);
  }
};

const getAllMedicine = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.actor.id);
    if (!pharmacy) return res.status(404).json({ error: "Pharmacy not found" });
    res.json(pharmacy.medicines);
  } catch (error) {
    next(error);
  }
};
const addMedicine = async (req, res) => {
  const {Med, quantity} = req.body.data || {};
  if (typeof Med !== 'string' || !Med.trim() || /[.$]/.test(Med) || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({error:'Supply a medicine name and a positive integer quantity'});
  }
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.actor.id,
      {$inc:{[`medicines.${Med}`]:quantity}}, {new:true,runValidators:true});
    return res.json(pharmacy);
  } catch {return res.status(500).json({error:'Unable to update stock'});}
};

const deliverMedicine = async (req, res) => {
  try {
    await mongoose.connection.transaction(async session => {
      const prescription = await Prescription.findOne({
        _id:req.body.data.PresId, pharmacyId:req.actor.id, delivered:false,
      }).session(session);
      if (!prescription) throw Object.assign(new Error('Prescription is unavailable'), {status:409});
      const medicine = prescription.Medicine;
      const quantity = prescription.Quantity;
      if (typeof medicine !== 'string' || /[.$]/.test(medicine) || !Number.isInteger(quantity) || quantity <= 0) {
        throw Object.assign(new Error('Prescription needs a valid medicine and quantity'), {status:400});
      }
      const stock = `medicines.${medicine}`;
      const result = await Pharmacy.updateOne(
        {_id:req.actor.id, [stock]:{$gte:quantity}},
        {$inc:{[stock]:-quantity}}, {session},
      );
      if (result.modifiedCount !== 1) throw Object.assign(new Error('Insufficient stock'), {status:409});
      prescription.delivered = true;
      await prescription.save({session});
    });
    return res.json({message:'Medicine Given'});
  } catch (error) {
    return res.status(error.status || 500).json({error:error.status ? error.message : 'Unable to dispense medicine'});
  }
};

export {
  PharmbyID,
  getClientPrescription,
  getAllMedicine,
  addMedicine,
  deliverMedicine,
};
