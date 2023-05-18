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
  const { password, email, newpass } = req.body.data;

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
    const { patientId } = req.body.data;
    if (!patientId) {
      return res.status(400).json("Err: Expected all parameters");
    } else {
      const PatientObj = await Patient.findById(patientId);
      if (!PatientObj) {
        return res.status(400).json("Err: Incorrect Patient ID");
      } else {
        const pres = await Prescription.find({
          patientId: patientId,
          delivered: false,
        });
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
    const { PharmId } = req.body.data;
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
    const { PharmId, Med, quantity } = req.body.data;

    if (!PharmId || !Med || !quantity) {
      return res.status(400).json("Err: Expected all parameters");
    } else {
      const PharmObj = await Pharmacy.findById(PharmId);
      if (PharmObj) {
        let orgQuan = 0;
        orgQuan = PharmObj.medicines.get(Med);

        if (orgQuan === null || orgQuan === undefined) {
          orgQuan = 0;
        }

        console.log(Med, orgQuan, quantity);
        if (orgQuan != 0) {
          PharmObj.medicines.set(Med, orgQuan + parseInt(quantity));
        } else {
          PharmObj.medicines.set(Med, parseInt(quantity));
        }
        await PharmObj.save();
        return res.status(200).json(PharmObj);
      } else {
        return res.status(400).json({ message: "Incorrect Pharmacy ID" });
      }
    }
  } catch (error) {
    console.error("Error getting patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deliverMedicine = async (req, res) => {
  try {
    const { Med, quantity, PharmId, PresId } = req.body.data;
    if (!Med || !quantity || !PharmId || !PresId) {
      return res.status(400).json("Err: Expected all parameters");
    } else {
      const PharmObj = await Pharmacy.findById(PharmId);
      const PrescObj = await Prescription.findById(PresId);
      if (!PharmObj || !PrescObj) {
        return res
          .status(400)
          .json({ message: "Incorrect Pharmacy or Prescription ID" });
      } else {
        if (PharmObj.medicines.has(Med)) {
          let medquan = PharmObj.medicines.get(Med);
          if (medquan < quantity) {
            return res.status(400).json({ message: "Insufficient Quantity" });
          } else {
            medquan -= quantity;
            PharmObj.medicines.set(Med, medquan);
            await PharmObj.save();
            PrescObj.delivered = true;
            await PrescObj.save();
            return res.status(200).json({ message: "Medicine Given" });
          }
        }
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
  deliverMedicine,
};
