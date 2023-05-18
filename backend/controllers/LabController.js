import Patient from "../models/patientModel.js";
import Pharmacy from "../models/PharmacyModel.js";
import Prescription from "../models/prescriptionModel.js";
import Laboratory from "../models/LaboratoryModel.js";
import Report from "../models/reportModel.js";
import bcrypt from "bcrypt";
const login = async (req, res) => {
  const { password, email } = req.body.data;

  try {
    // Find the user by username
    const user = await Laboratory.findOne({ email: email });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Invalid credentials");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

const changePass = async (req, res) => {
  const { password, email, newpass } = req.body.data;

  try {
    // Find the user by username
    const user = await Laboratory.findOne({ email: email });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Invalid credentials");
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newpass, saltRounds);
      user.password = hashedPassword;
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

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
    res.status(500);
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
    console.log(req.body.data);
    const { LabId, patientId, Type } = req.body.data;
    if (!LabId || !patientId || !Type) {
      return res.status(400).json("Err: Expected all parameters");
    } else {
      const LabObj = await Laboratory.findById(LabId);
      console.log(LabObj);

      const PatientObj = await Patient.findById(patientId);
      console.log(PatientObj);
      if (!LabObj || !PatientObj) {
        return res.status(400).json("Err: Incorrect Patient or Lab ID");
      } else {
        const NewRep = new Report({
          LabId: LabId,
          patientId: patientId,
          Type: Type,
        });
        await NewRep.save();
        return res.status(200).json(NewRep);
      }
    }
  } catch (error) {
    console.error("Error getting patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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
export {
  getAllReportsLab,
  getAllReportsPatient,
  addReports,
  getClientPrescription,
  LabbyID,
  changePass,
  login,
};
