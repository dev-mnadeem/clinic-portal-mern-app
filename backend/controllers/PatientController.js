import Patient from '../models/patientModel.js';
import bcrypt from "bcrypt"


  const getPatientById= async (req, res) => {
    try {
      const patientId = req.params.id;
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.status(200).json(patient);
    } catch (error) {
      console.error('Error getting patient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  const addPatient = async (req, res) => {
    try {
      console.log(req.body)
      
      const { name, id, email, password, disease, age, phone, address } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const existingPatient = await Patient.findOne({ email });
      if (existingPatient) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      const patient = new Patient({ name, id, email, password:hashedPassword, disease, age, phone, address });
      await patient.save();
      res.status(201).json({ message: 'Patient created successfully' });
    } catch (error) {
      console.error('Error creating patient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  const updatePatient= async (req, res) => {
    try {
      const patientId = req.params.id;
      const { name, id, email, password, disease, age, phone, address } = req.body;
      const patient = await Patient.findByIdAndUpdate(patientId, { name, id, email, password, disease, age, phone, address }, { new: true });
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.status(200).json(patient);
    } catch (error) {
      console.error('Error updating patient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

 const deletePatient = async (req, res) => {
    try {
      const patientId = req.params.id;
      const patient = await Patient.findByIdAndDelete(patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
      console.error('Error deleting patient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  const patientLogin = async (req,res)=>{
    try {
      const { email, password } = req.body;
      const PatientObj = await Patient.findOne({ email });
      if (!PatientObj) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const passwordMatch = await bcrypt.compare(password, PatientObj.password);
      // console.log(password,PatientObj.password)
      // console.log(passwordMatch)
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.status(200).json(PatientObj);
    } catch (error) {
      console.error('Error logging in Patient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  const getPatientByEmail= async (req, res) => {
    try {
      const email = req.body.email;
      const patient = await Patient.find({email:email});
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.status(200).json(patient);
    } catch (error) {
      console.error('Error getting patient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  const patientSignUp = async(req,res)=>{
    try {
      const { name, id, email, password, disease, age, phone, address } = req.body;
      const existingPatient = await Patient.findOne({ email });
      if (existingPatient) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const patient = new Patient({ name, id, email, password: hashedPassword, disease, age, phone, address });
      await patient.save();
      res.status(201).json({ message: 'Patient created successfully' });
    } catch (error) {
      console.error('Error creating patient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

export {getAllPatients,getPatientById,addPatient,deletePatient,updatePatient,patientLogin,getPatientByEmail,patientSignUp};
