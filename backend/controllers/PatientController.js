import Patient from "../models/patientModel.js";
import bcrypt from "bcrypt";
import Doctor from "../models/DoctorModel.js";
import Appointment from "../models/AppointmentModel.js";
import Prescription from "../models/prescriptionModel.js";

const getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error getting patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePatient = async (req, res) => {
  try {
    console.log(req.body);
    // Find user based on email
    const user = await Patient.findOne({ email: req.body.email });

    // If user not found, return an error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if they are present in the request body
    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.password !== undefined) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      user.password = hashedPassword;
    }

    if (req.body.disease) {
      user.disease = req.body.disease;
    }

    if (req.body.age) {
      user.age = req.body.age;
    }

    if (req.body.phone) {
      user.phone = req.body.phone;
    }

    if (req.body.address) {
      user.address = req.body.address;
    }

    // Save updated user to database
    await user.save();

    // Return success response
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const patientLogin = async (req, res) => {
  try {
    const { email, password } = req.body.data;
    const PatientObj = await Patient.findOne({ email });
    if (!PatientObj) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, PatientObj.password);
    // console.log(password,PatientObj.password)
    // console.log(passwordMatch)
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.status(200).json(PatientObj);
  } catch (error) {
    console.error("Error logging in Patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getPatientByEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const patient = await Patient.find({ email: email });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error getting patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, reason, datetime } = req.body;
    if (!doctorId || !patientId || !reason || !datetime) {
      return res.status(400).json("Err: Expected all parameters");
    } else {
      const PatientObj = await Patient.findById(patientId);
      const DoctorObj = await Doctor.findById(doctorId);
      if (!PatientObj || !DoctorObj) {
        return res.status(400).json("Err: Incorrect Patient or Doctor ID");
      } else {
        const newApp = new Appointment({
          doctorId: doctorId,
          patientId: patientId,
          dateTime: datetime,
          patientName: PatientObj.name,
          reason: reason,
          doctorName: DoctorObj.name,
        });
        await newApp.save();
        return res.status(200).json(newApp);
      }
    }
  } catch (error) {
    console.error("Error getting patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const myPrescription = async (req, res) => {
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
const getAllAppointments = async (req, res) => {
  try {
    const userID = req.body.userID;
    const user = await Patient.findById(userID);
    if (!user) {
      return res.status(401).send("Invalid credentials");
    } else {
      const Appointments = await Appointment.find({
        patientId: userID,
        Accepted: true,
      });
      return res.status(200).json(Appointments);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};
export {
  getPatientById,
  updatePatient,
  patientLogin,
  getPatientByEmail,
  addAppointment,
  myPrescription,
  getAllAppointments,
};
