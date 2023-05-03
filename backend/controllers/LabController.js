import Patient from "../models/patientModel.js";
import Pharmacy from "../models/PharmacyModel.js";
import Prescription from "../models/prescriptionModel.js";
import Laboratory from "../models/LaboratoryModel.js";
import Report from "../models/reportModel.js";


const LabbyID = async (req, res) => {
  try {
    const userID = req.body.userID;
    const user = await Laboratory.findById(userID);
    if (!user) {
      return res.status(401).send("Invalid credentials");
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"Internal server error"});
  }
};
const getClientPrescription = async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!patientId) {
      return res.status(400).json("Err: Expected all parameters");
    } else {
      const PatientObj = await Patient.findById(patientId);
      if (!PatientObj) {
        return res.status(400).json("Err: Incorrect Patient ID");
      } else {
        const pres = await Prescription.find({ patientId: patientId });
        return res.status(200).json({ Prescription: pres });
      }
    }
  } catch (error) {
    console.error("Error getting patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addReports = async (req, res) => {
  try {
    const {reportId, Remarks} = req.body.data;
    const report = await Report.findOneAndUpdate(
      {_id:reportId, LabId:req.actor.id},
      {$set:{LabRemarks:Remarks || '', progress:'Completed'}},
      {new:true, runValidators:true},
    );
    if (!report) return res.status(404).json({error:'Assigned request not found'});
    return res.json(report);
  } catch {return res.status(500).json({error:'Unable to save report'});}
};

const getAllReportsPatient = async (req, res) => {
  try {
    const { LabId, patientId } = req.body;
    if (!LabId || !patientId) {
      return res.status(400).json("Err: Expected all parameters");
    } else {
      const LabObj = await Laboratory.findById(LabId);
      const PatientObj = await Patient.findById(patientId);
      if (!LabObj || !PatientObj) {
        return res.status(400).json("Err: Incorrect Patient or Lab ID");
      } else {
        const RetRep = await Report.find({
          patientId: patientId,
          LabId: LabId,
        });
        return res.status(200).json(RetRep);
      }
    }
  } catch (error) {
    console.error("Error getting patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllReportsLab = async (req, res) => {
  try {
    const { LabId } = req.body.data;
    if (!LabId) {
      return res.status(400).json("Err: Expected all parameters");
    } else {
      const LabObj = await Laboratory.findById(LabId);
      if (!LabObj) {
        return res.status(400).json("Err: Incorrect Lab ID");
      } else {
        const RetRep = await Report.find({ LabId: LabId });
        return res.status(200).json(RetRep);
      }
    }
  } catch (error) {
    console.error("Error getting patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addReportRemarks = async (req, res) => {
  try {
    const { LabId, Remarks, reportId } = req.body.data;
    if (!LabId || !Remarks || !reportId) {
      return res.status(401).send("Missing Values");
    } else {
      const reports = await Report.findById(reportId);
      if (!reports) {
        return res.status(401).send("Invalid Report");
      } else {
        reports.LabRemarks = Remarks;
        reports.LabId = LabId;
        reports.progress = "Completed";
        await reports.save();
        return res.status(200).json(reports);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"Internal server error"});
  }
};
const getAllReport = async (req, res) => {
  try {
    const reports = await Report.find({ progress: "In Progress", LabId: req.actor.id });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error getting Data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export {
  getAllReportsLab,
  getAllReportsPatient,
  addReports,
  getClientPrescription,
  LabbyID,
  addReportRemarks,
  getAllReport,
};
