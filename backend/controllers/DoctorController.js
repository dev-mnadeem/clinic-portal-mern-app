import Doctor from "../models/DoctorModel.js";
import Patient from "../models/patientModel.js";
import Appointment from "../models/AppointmentModel.js";
import Laboratory from "../models/LaboratoryModel.js";
import Prescription from "../models/prescriptionModel.js";
import Report from "../models/reportModel.js";


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
    res.status(500).json({error:"Internal server error"});
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
    res.status(500).json({error:"Internal server error"});
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
    res.status(500).json({error:"Internal server error"});
  }
};
const rejectAppointments = async (req, res) => {
  try {
    const AppID = req.body.data.AppID;
    const App = await Appointment.findByIdAndDelete(AppID);
    if (!App) {
      return res.status(401).send("Invalid value");
    } else {
      return res.status(200).json({message: "Updated successfully"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"Internal server error"});
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
      return res.status(200).json({message: "Updated successfully"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"Internal server error"});
  }
};
const addPrescription = async (req, res) => {
  try {
    const { Med, patientId, quantity, doctorId } = req.body.data;
    if (Med === null || patientId === null || quantity === null) {
      return res.status(401).send("Invalid value");
    } else {
      const PatientObj = await Patient.findById(patientId);
      const DoctorObj = await Doctor.findById(doctorId);
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
    res.status(500).json({error:"Internal server error"});
  }
};
const addReport = async (req, res) => {
  try {
    const { reporttype, patientId, doctorId } = req.body.data;

    if (reporttype === null || patientId === null || doctorId === null) {
      return res.status(401).send("Invalid value");
    } else {
      const PatientObj = await Patient.findById(patientId);
      const DoctorObj = await Doctor.findById(doctorId);
      if (!PatientObj || !DoctorObj) {
        return res.status(401).send("Invalid Patient OR Doctor");
      } else {
        const newRep = new Report({
          Type: reporttype,
          patientId: patientId,
          doctorId: doctorId,
          patientName: PatientObj.name,
        });
        await newRep.save();
        return res.status(201).json(newRep);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"Internal server error"});
  }
};
const getPatientReport = async (req, res) => {
  try {
    const patientId = req.body.data;
    if (!patientId) {
      return res.status(401).send("Invalid credentials");
    } else {
      const reports = await Report.find({
        patientId: patientId,
      });
      if (!reports) {
        return res.status(401).send("Invalid Report");
      } else {
        return res.status(200).json(reports);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"Internal server error"});
  }
};
const addReportRemarks = async (req, res) => {
  try {
    const { Remarks, reportId } = req.body.data;
    if (!reportId || Remarks) {
      return res.status(401).send("Missing Values");
    } else {
      const reports = await Report.findById(reportId);
      if (!reports) {
        return res.status(401).send("Invalid Report");
      } else {
        reports.doctorRemarks = Remarks;
        await reports.save();
        return res.status(200).json(reports);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"Internal server error"});
  }
};
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
