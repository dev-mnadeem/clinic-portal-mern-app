import Patient from "../models/patientModel.js";
import Doctor from "../models/DoctorModel.js";
import Pharmacy from "../models/PharmacyModel.js";
import Admin from "../models/adminModel.js";
import Appointment from "../models/AppointmentModel.js";
import Lab from "../models/LaboratoryModel.js";
import Report from "../models/reportModel.js";
import Prescription from "../models/prescriptionModel.js";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

// Each account type accepts a different set of profile fields from the admin
// form. The form sends `phone`; the schemas store it as `phoneNumber`.
const accountTypes = {
  patient: { Model: Patient, fields: ["name", "disease", "age", "address"] },
  doctor: { Model: Doctor, fields: ["name", "specification", "address"] },
  pharmacy: { Model: Pharmacy, fields: ["name"] },
  lab: { Model: Lab, fields: ["name", "specification", "address"] },
};

function profileFrom(input, fields) {
  const profile = {};
  for (const field of fields) {
    if (input[field] !== undefined && input[field] !== "") profile[field] = input[field];
  }
  if (input.phone !== undefined && input.phone !== "") profile.phoneNumber = input.phone;
  return profile;
}

function listAccounts(type) {
  const { Model } = accountTypes[type];
  return async (req, res, next) => {
    try {
      res.json(await Model.find());
    } catch (error) {
      next(error);
    }
  };
}

function createAccount(type) {
  const { Model, fields } = accountTypes[type];
  return async (req, res, next) => {
    try {
      const input = req.body.data || {};
      if (typeof input.email !== "string" || !input.email.trim() || typeof input.password !== "string") {
        return res.status(400).json({ error: "Email and password are required" });
      }
      const email = input.email.trim();
      if (await Model.exists({ email })) {
        return res.status(409).json({ error: "Email already in use" });
      }
      const account = await Model.create({
        ...profileFrom(input, fields),
        email,
        password: await bcrypt.hash(input.password, SALT_ROUNDS),
      });
      res.status(201).json({ message: "Account created", user: account });
    } catch (error) {
      if (error.name === "ValidationError") return res.status(400).json({ error: error.message });
      next(error);
    }
  };
}

function updateAccount(type) {
  const { Model, fields } = accountTypes[type];
  return async (req, res, next) => {
    try {
      const input = req.body.data || {};
      const user = await Model.findOne({ email: input.email });
      if (!user) return res.status(404).json({ error: "User not found" });
      user.set(profileFrom(input, fields));
      if (typeof input.password === "string" && input.password !== "") {
        user.password = await bcrypt.hash(input.password, SALT_ROUNDS);
      }
      await user.save();
      res.json({ message: "User updated successfully" });
    } catch (error) {
      if (error.name === "ValidationError") return res.status(400).json({ error: error.message });
      next(error);
    }
  };
}

// Records that only make sense while the account exists are removed with it.
const dependents = {
  patient: (id) => [Appointment.deleteMany({ patientId: id }), Report.deleteMany({ patientId: id }), Prescription.deleteMany({ patientId: id })],
  doctor: (id) => [Appointment.deleteMany({ doctorId: id })],
  pharmacy: (id) => [Prescription.updateMany({ pharmacyId: id, delivered: false }, { $unset: { pharmacyId: 1 } })],
  lab: (id) => [Report.updateMany({ LabId: id, progress: "In Progress" }, { $unset: { LabId: 1 } })],
};

function deleteAccount(type) {
  const { Model } = accountTypes[type];
  return async (req, res, next) => {
    try {
      const userId = req.body.data?.userId;
      if (!userId) return res.status(400).json({ error: "userId is required" });
      const user = await Model.findByIdAndDelete(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      await Promise.all(dependents[type](userId));
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      if (error.name === "CastError") return res.status(400).json({ error: "Invalid record identifier" });
      next(error);
    }
  };
}

const addAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body.data || {};
    if (typeof email !== "string" || !email.trim() || typeof password !== "string") {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (await Admin.exists({ email: email.trim() })) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const admin = await Admin.create({ name, email: email.trim(), password: await bcrypt.hash(password, SALT_ROUNDS) });
    res.status(201).json({ message: "Administrator created", user: admin });
  } catch (error) {
    next(error);
  }
};

export const getAllPatients = listAccounts("patient");
export const getAllDoctors = listAccounts("doctor");
export const getAllPharmacies = listAccounts("pharmacy");
export const getAllLabs = listAccounts("lab");
export const addPatient = createAccount("patient");
export const addDoctor = createAccount("doctor");
export const addPharmacy = createAccount("pharmacy");
export const addLab = createAccount("lab");
export const updatePatient = updateAccount("patient");
export const updateDoctor = updateAccount("doctor");
export const updatePharmacy = updateAccount("pharmacy");
export const updateLab = updateAccount("lab");
export const delPatient = deleteAccount("patient");
export const delDoctor = deleteAccount("doctor");
export const delPharmacy = deleteAccount("pharmacy");
export const delLab = deleteAccount("lab");
export { addAdmin };
