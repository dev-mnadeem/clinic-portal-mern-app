import Doctor from "../models/DoctorModel.js";
import Patient from "../models/patientModel.js";
import Appointment from "../models/AppointmentModel.js";
import Laboratory from "../models/LaboratoryModel.js";
import Prescription from "../models/prescriptionModel.js";
import bcrypt from "bcrypt";
const login = async (req, res) => {
  const { password, email } = req.body.data;

  try {
    // Find the user by username
    const user = await Doctor.findOne({ email: email });
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
    const user = await Doctor.findOne({ email: email });
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

const DoctorbyID = async (req, res) => {
  try {
    const userID = req.body.userID;
    const user = await Doctor.findById(userID);
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
const getAllPendingAppointments = async (req, res) => {
  try {
    const userID = req.body.data.userID;
    const user = await Doctor.findById(userID);
    if (!user) {
      return res.status(401).send("Invalid credentials");
    } else {
      const Appointments = await Appointment.find({
        doctorId: userID,
        Accepted: false,
      });

      // let i=0
      // user.appointments.forEach(async element => {
      //     let temp=await Appointment.findById(element)
      //     if (!temp.rejected){
      //         Appointments[i]=temp;
      //         i++;
      //     }
      // });
      return res.status(200).json(Appointments);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};
const getAllAcceptedAppointments = async (req, res) => {
  try {
    const userID = req.body.data.userID;
    const user = await Doctor.findById(userID);
    if (!user) {
      return res.status(401).send("Invalid credentials");
    } else {
      const Appointments = await Appointment.find({
        doctorId: userID,
        Accepted: true,
      });

      // let i=0
      // user.appointments.forEach(async element => {
      //     let temp=await Appointment.findById(element)
      //     if (!temp.rejected){
      //         Appointments[i]=temp;
      //         i++;
      //     }
      // });
      return res.status(200).json(Appointments);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};
const rejectAppointments = async (req, res) => {
  try {
    const AppID = req.body.data.AppID;
    const App = await Appointment.findByIdAndDelete(AppID);
    if (!App) {
      return res.status(401).send("Invalid value");
    } else {
      return res.status(200);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};
const acceptAppointments = async (req, res) => {
  try {
    const AppID = req.body.data.AppID;

    const App = await Appointment.findById(AppID);
    if (!App) {
      return res.status(401).send("Invalid value");
    } else {
      App.Accepted = true;
      App.save();
      return res.status(200);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};
const addPrescription = async (req, res) => {
  try {
    const { Med, patientId, quantity, doctorId } = req.body.data;
    console.log(Med, patientId, quantity, doctorId);
    if (Med === null || patientId === null || quantity === null) {
      return res.status(401).send("Invalid value");
    } else {
      const PatientObj = await Patient.findById(patientId);
      const DoctorObj = await Doctor.findById(doctorId);
      console.log(PatientObj, DoctorObj);
      if (!PatientObj || !DoctorObj) {
        return res.status(401).send("Invalid Parameters Entered");
      } else {
        const newPres = new Prescription({
          doctorId: doctorId,
          patientId: patientId,
        });
        newPres.Medicine = Med;
        newPres.Quantity = quantity;
        newPres.doctorName = DoctorObj.name;
        await newPres.save();
        return res.status(200).json({
          message: "Medcine Added",
          user: PatientObj,
          Prescription: newPres,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};
const addReport = async (req, res) => {
  try {
    const { reporttype, patiendId, quantity } = req.body;
    if (reporttype === null || patiendId === null || quantity === null) {
      return res.status(401).send("Invalid value");
    } else {
      const PatientObj = await Patient.findById(patiendId);
      if (!PatientObj) {
        return res.status(401).send("Invalid Patient");
      } else {
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export {
  login,
  changePass,
  DoctorbyID,
  getAllPendingAppointments,
  rejectAppointments,
  addPrescription,
  addReport,
  getAllAcceptedAppointments,
  acceptAppointments,
};
