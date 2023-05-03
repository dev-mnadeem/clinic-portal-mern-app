import Laboratory from "../models/LaboratoryModel.js";
import Report from "../models/reportModel.js";

const LabbyID = async (req, res, next) => {
  try {
    const lab = await Laboratory.findById(req.actor.id);
    if (!lab) return res.status(404).json({ error: "Laboratory not found" });
    res.json(lab);
  } catch (error) {
    next(error);
  }
};

const getAllReportsLab = async (req, res, next) => {
  try {
    res.json(await Report.find({ LabId: req.actor.id }));
  } catch (error) {
    next(error);
  }
};

const getAllReportsPatient = async (req, res, next) => {
  try {
    const patientId = req.query.patientId || req.body.patientId;
    if (!patientId) return res.status(400).json({ error: "patientId is required" });
    res.json(await Report.find({ patientId, LabId: req.actor.id }));
  } catch (error) {
    next(error);
  }
};

const getAllReport = async (req, res, next) => {
  try {
    res.json(await Report.find({ progress: "In Progress", LabId: req.actor.id }));
  } catch (error) {
    next(error);
  }
};

// Filing remarks completes the request. The access layer has already checked
// that the report is assigned to this laboratory; the filter repeats that check
// so the write cannot touch another lab's request.
const addReports = async (req, res, next) => {
  try {
    const { reportId, Remarks } = req.body.data;
    if (typeof Remarks !== "string" || !Remarks.trim()) {
      return res.status(400).json({ error: "Remarks are required" });
    }
    const report = await Report.findOneAndUpdate(
      { _id: reportId, LabId: req.actor.id },
      { $set: { LabRemarks: Remarks.trim(), progress: "Completed" } },
      { new: true, runValidators: true },
    );
    if (!report) return res.status(404).json({ error: "Assigned request not found" });
    res.json(report);
  } catch (error) {
    next(error);
  }
};

export { LabbyID, getAllReportsLab, getAllReportsPatient, getAllReport, addReports };
