import Patient from "../models/patientModel";
import Doctor from "../models/DoctorModel.js";
import Pharmacy from "../models/PharmacyModel.js"
import Admin from "../models/adminModel.js";
import Appointment from "../models/AppointmentModel.js";
import Lab from "../models/LaboratoryModel.js";
import bcrypt from "bcrypt";

const getAllPatients= async (req, res) => {
    try {
      const patients = await Patient.find();
      res.status(200).json(patients);
    } catch (error) {
      console.error('Error getting patients:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}
const getAllPharmacies= async (req, res) => {
    try {
      const Pharmacies = await Pharmacy.find();
      res.status(200).json(Pharmacies);
    } catch (error) {
      console.error('Error getting Data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  const getAllDoctors= async (req, res) => {
    try {
      const Doctors = await Doctor.find();
      res.status(200).json(Doctors);
    } catch (error) {
      console.error('Error getting Data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  const getAllLabs= async (req, res) => {
    try {
      const Labs = await Lab.find();
      res.status(200).json(Labs);
    } catch (error) {
      console.error('Error getting Data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  const addPatient = async (req, res) => {
    try {
      console.log(req.body)
      
      const { name, email, password, disease, age, phone, address } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const existingPatient = await Patient.findOne({ email });
      if (existingPatient) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      const patient = new Patient({ name, email, password:hashedPassword, age,disease, phone, address });
      await patient.save();
      res.status(201).json({ message: 'Patient created successfully' });
    } catch (error) {
      console.error('Error creating patient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  const addDoctor = async (req, res) => {
    try{
      console.log(req.body)
      
      const { name, email, password, specification, phone, address } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      const  doctor = new Doctor({ name, email, password:hashedPassword, specification, phone, address  });
      await doctor.save();
      res.status(201).json({ "message": ' Doctor created successfully' });
    } catch (error) {
      console.error('Error creating :Doctor', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}

const addPharmacy = async (req, res) => {
    try{
      console.log(req.body)
      
      const { name, email, password,phone } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const existingPharmacy = await Pharmacy.findOne({ email });
      if (existingPharmacy) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      const  newPharmacy= new Pharmacy({ name, email, password:hashedPassword ,phone  });
      await newPharmacy.save();
      res.status(201).json({ "message": ' Pharm created successfully' });
    } catch (error) {
      console.error('Error creating :Pharm', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}
const addLab = async (req, res) => {
    try{
      console.log(req.body)
      
      const { name, email, password,address,phone,specification } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const existingLab = await Lab.findOne({ email });
      if (existingLab) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      const  newLab= new Lab({ name, email, password:hashedPassword,address,specification ,phone  });
      await newLab.save();
      res.status(201).json({ "message": ' Lab created successfully' });
    } catch (error) {
      console.error('Error creating :Lab', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}

Router.post("/addPatient",addPatient)
Router.post("/addPharmacy",addPharmacy)
Router.post("/addDoctor",addDoctor)
Router.post("/addLab",addLab)
Router.get("/getAllPatients",getAllPatients)
Router.get("/getAllPharmacies",getAllPharmacies)
Router.get("/getAllDoctors",getAllDoctors)
Router.get("/getAllLabs",getAllLabs)
Router.post("/delPatient")
Router.post("/delDoctor")
Router.post("/delPharmacy")
Router.post("/delLab")
Router.post("updatePatient")
Router.post("updateDoctor")
Router.post("updatePharmacy")
Router.post("updateLab")
Router.post("/login")