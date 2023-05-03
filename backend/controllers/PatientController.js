import Patient from "../models/patientModel.js";
import Doctor from "../models/DoctorModel.js";
import Appointment from "../models/AppointmentModel.js";
import Prescription from "../models/prescriptionModel.js";
import Report from "../models/reportModel.js";

// The access layer pins patientId, userID and email to the signed-in patient,
// so every query below is scoped to req.actor.id.

const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.actor.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

const getPatientByEmail = async (req, res, next) => {
  try {
    res.json(await Patient.find({ _id: req.actor.id }));
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    if (req.body.password !== undefined) {
      return res.status(400).json({ error: "Use changePass with your current password" });
    }
    const patient = await Patient.findById(req.actor.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    const { name, disease, age, phone, address } = req.body;
    if (name) patient.name = name;
    if (disease !== undefined) patient.disease = disease;
    if (age !== undefined && age !== "") patient.age = age;
    if (phone) patient.phoneNumber = phone;
    if (address !== undefined) patient.address = address;
    await patient.save();
    res.json({ message: "Profile updated", user: patient });
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ error: error.message });
    next(error);
  }
};

const addAppointment = async (req, res, next) => {
  try {
    const { doctorId, reason, datetime } = req.body.data || {};
    if (!doctorId || typeof reason !== "string" || !reason.trim() || typeof datetime !== "string" || !datetime) {
      return res.status(400).json({ error: "Choose a doctor, a date and a reason" });
    }
    const [patient, doctor] = await Promise.all([Patient.findById(req.actor.id), Doctor.findById(doctorId)]);
    if (!patient || !doctor) return res.status(404).json({ error: "Doctor not found" });
    const appointment = await Appointment.create({
      doctorId: doctor._id,
      patientId: patient._id,
      dateTime: datetime,
      patientName: patient.name,
      reason: reason.trim(),
      doctorName: doctor.name,
    });
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

const myPrescription = async (req, res, next) => {
  try {
    res.json({ Prescription: await Prescription.find({ patientId: req.actor.id }) });
  } catch (error) {
    next(error);
  }
};

// Pending requests are returned too, flagged by Accepted, so a patient can see
// that a booking is waiting for the doctor rather than assume it was lost.
const getAllAppointments = async (req, res, next) => {
  try {
    res.json(await Appointment.find({ patientId: req.actor.id }).sort({ dateTime: 1 }));
  } catch (error) {
    next(error);
  }
};

const getMyReport = async (req, res, next) => {
  try {
    res.json(await Report.find({ patientId: req.actor.id }));
  } catch (error) {
    next(error);
  }
};

export {
  getPatientById,
  updatePatient,
  getPatientByEmail,
  addAppointment,
  myPrescription,
  getAllAppointments,
  getMyReport,
};
