import Doctor from "../models/DoctorModel.js";
import Patient from "../models/patientModel.js";
import Appointment from "../models/AppointmentModel.js";
import Prescription from "../models/prescriptionModel.js";
import Report from "../models/reportModel.js";

// The access layer pins doctorId/userID to the signed-in doctor and checks that
// any AppID, reportId or patientId in the body belongs to one of their
// appointments, so these handlers can use req.actor.id directly.

const DoctorbyID = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.actor.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

function appointmentsWhere(Accepted) {
  return async (req, res, next) => {
    try {
      res.json(await Appointment.find({ doctorId: req.actor.id, Accepted }));
    } catch (error) {
      next(error);
    }
  };
}

const rejectAppointments = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndDelete({ _id: req.body.data?.AppID, doctorId: req.actor.id, Accepted: false });
    if (!appointment) return res.status(404).json({ error: "Pending appointment not found" });
    res.json({ message: "Appointment rejected" });
  } catch (error) {
    next(error);
  }
};

const acceptAppointments = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.body.data?.AppID, doctorId: req.actor.id },
      { $set: { Accepted: true } },
      { new: true },
    );
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    res.json({ message: "Appointment accepted", appointment });
  } catch (error) {
    next(error);
  }
};

const addPrescription = async (req, res, next) => {
  try {
    const { Med, patientId } = req.body.data || {};
    const quantity = Number(req.body.data?.quantity);
    if (typeof Med !== "string" || !Med.trim() || /[.$]/.test(Med) || !Number.isInteger(quantity) || quantity <= 0 || !patientId) {
      return res.status(400).json({ error: "Supply a medicine name, a positive whole quantity and a patient" });
    }
    const [patient, doctor] = await Promise.all([Patient.findById(patientId), Doctor.findById(req.actor.id)]);
    if (!patient || !doctor) return res.status(404).json({ error: "Patient or doctor not found" });
    const prescription = await Prescription.create({
      doctorId: doctor._id,
      patientId: patient._id,
      Medicine: Med.trim(),
      Quantity: quantity,
      doctorName: doctor.name,
    });
    res.status(201).json({ message: "Prescription added", Prescription: prescription });
  } catch (error) {
    next(error);
  }
};

const addReport = async (req, res, next) => {
  try {
    const { reporttype, patientId } = req.body.data || {};
    if (typeof reporttype !== "string" || !reporttype.trim() || !patientId) {
      return res.status(400).json({ error: "Supply a test type and a patient" });
    }
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    const report = await Report.create({
      Type: reporttype.trim(),
      patientId: patient._id,
      doctorId: req.actor.id,
      patientName: patient.name,
    });
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

const getPatientReport = async (req, res, next) => {
  try {
    const patientId = req.body.data;
    if (typeof patientId !== "string" || !patientId) return res.status(400).json({ error: "patientId is required" });
    res.json(await Report.find({ patientId }));
  } catch (error) {
    next(error);
  }
};

const addReportRemarks = async (req, res, next) => {
  try {
    const { Remarks, reportId } = req.body.data || {};
    if (!reportId || typeof Remarks !== "string" || !Remarks.trim()) {
      return res.status(400).json({ error: "Supply a report and remarks" });
    }
    const report = await Report.findOneAndUpdate(
      { _id: reportId, doctorId: req.actor.id },
      { $set: { doctorRemarks: Remarks.trim() } },
      { new: true },
    );
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (error) {
    next(error);
  }
};

const getAllPendingAppointments = appointmentsWhere(false);
const getAllAcceptedAppointments = appointmentsWhere(true);

export {
  DoctorbyID,
  getAllPendingAppointments,
  rejectAppointments,
  addPrescription,
  addReport,
  getAllAcceptedAppointments,
  acceptAppointments,
  getPatientReport,
  addReportRemarks,
};
