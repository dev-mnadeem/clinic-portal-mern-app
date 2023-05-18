import Patient from "../models/patientModel.js";
import Pharmacy from "../models/PharmacyModel.js";
import Prescription from "../models/prescriptionModel.js";
import bcrypt from "bcrypt";
const login = async (req, res) => {
  const { password, email } = req.body.data;

  try {
    // Find the user by username
    const user = await Pharmacy.findOne({ email: email });
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
  const { password, email, newpass } = req.body;

  try {
    // Find the user by username
    const user = await Pharmacy.findOne({ email: email });
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

const PharmbyID = async (req, res) => {
  try {
    const userID = req.body.userID;
    const user = await Pharmacy.findById(userID);
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
    const { patientId, PharmID } = req.body;
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
const getAllMedicine = async (req, res) => {
  try {
    const { PharmId } = req.body;
    if (!PharmId) {
      return res.status(400).json("Err: Expected all parameters");
    } else {
      const PharmObj = await Pharmacy.findById(PharmId);
      if (!PharmObj) {
        return res.status(400).json("Err: Incorrect Pharm ID");
      } else {
        return res.status(200).json(PharmObj.medicines);
      }
    }
  } catch (error) {
    console.error("Error getting patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addMedicine = async (req, res) => {
  try {
    const { PharmId, Med, quantity } = req.body;
    if (!PharmId || !Med || !quantity) {
      return res.status(400).json("Err: Expected all parameters");
    } else {
      const PharmObj = await Pharmacy.findById(PharmId);
      if (PharmObj) {
        let orgQuan = 0;
        orgQuan = PharmObj.medicines.get(Med);
        if (orgQuan != 0) {
          PharmObj.medicines.set(Med, orgQuan + quantity);
        } else {
          PharmObj.medicines.set(Med, quantity);
        }
        await PharmObj.save();
        return res.status(200);
      } else {
        return res.status(400).json({ message: "Incorrect Pharmacy ID" });
      }
    }
  } catch (error) {
    console.error("Error getting patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export {
  PharmbyID,
  login,
  changePass,
  getClientPrescription,
  getAllMedicine,
  addMedicine,
};
