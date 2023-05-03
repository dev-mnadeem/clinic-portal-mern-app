// Fills an empty local database with invented people and records so every
// workspace has something to show. Every name, address and condition here is
// fictional. All demo accounts share DEMO_PASSWORD.
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Patient from '../backend/models/patientModel.js';
import Doctor from '../backend/models/DoctorModel.js';
import Laboratory from '../backend/models/LaboratoryModel.js';
import Pharmacy from '../backend/models/PharmacyModel.js';
import Appointment from '../backend/models/AppointmentModel.js';
import Prescription from '../backend/models/prescriptionModel.js';
import Report from '../backend/models/reportModel.js';

const password = process.env.DEMO_PASSWORD;
if (!process.env.MONGO_URI || !password || password.length < 12) {
  throw new Error('Set MONGO_URI and a DEMO_PASSWORD of at least 12 characters');
}

try {
  await mongoose.connect(process.env.MONGO_URI);
  if (await Patient.exists({email: 'avery@demo.example.test'})) {
    console.log('Demo records already exist; nothing to do');
  } else {
    const hash = await bcrypt.hash(password, 12);
    const [avery, jordan, sam] = await Patient.create([
      {name: 'Avery Fictional', email: 'avery@demo.example.test', password: hash, age: 41, phoneNumber: '555-0100', disease: 'Seasonal allergy', address: '12 Example Lane'},
      {name: 'Jordan Placeholder', email: 'jordan@demo.example.test', password: hash, age: 63, phoneNumber: '555-0106', disease: 'Hypertension (demo)'},
      {name: 'Sam Sample', email: 'sam@demo.example.test', password: hash, age: 28, phoneNumber: '555-0107'},
    ]);
    const [rowan, quinn] = await Doctor.create([
      {name: 'Dr. Rowan Sample', email: 'rowan@demo.example.test', password: hash, phoneNumber: '555-0101', specification: 'General practice'},
      {name: 'Dr. Quinn Example', email: 'quinn@demo.example.test', password: hash, phoneNumber: '555-0102', specification: 'Cardiology'},
    ]);
    const lab = await Laboratory.create({name: 'Northside Demo Lab', email: 'lab@demo.example.test', password: hash, phoneNumber: '555-0103', specification: 'Blood and urine panels'});
    const pharmacy = await Pharmacy.create({name: 'Corner Demo Pharmacy', email: 'pharmacy@demo.example.test', password: hash, phoneNumber: '555-0105', medicines: {'Demo antihistamine': 40, 'Demo saline spray': 12}});

    const visit = (patient, doctor, dateTime, reason, Accepted) => ({patientId: patient._id, patientName: patient.name, doctorId: doctor._id, doctorName: doctor.name, dateTime, reason, Accepted});
    await Appointment.create([
      visit(avery, rowan, '2099-03-14', 'Spring allergy review', true),
      visit(jordan, quinn, '2099-03-15', 'Blood pressure follow-up', true),
      visit(sam, rowan, '2099-03-18', 'Sports physical', false),
      visit(avery, quinn, '2099-03-21', 'Palpitations after exercise', false),
    ]);
    await Prescription.create([
      {patientId: avery._id, doctorId: rowan._id, doctorName: rowan.name, Medicine: 'Demo antihistamine', Quantity: 10, pharmacyId: pharmacy._id},
      {patientId: jordan._id, doctorId: quinn._id, doctorName: quinn.name, Medicine: 'Demo saline spray', Quantity: 1},
    ]);
    await Report.create([
      {patientId: avery._id, patientName: avery.name, doctorId: rowan._id, Type: 'Allergy panel', LabId: lab._id},
      {patientId: jordan._id, patientName: jordan.name, doctorId: quinn._id, Type: 'Lipid panel'},
      {patientId: jordan._id, patientName: jordan.name, doctorId: quinn._id, Type: 'Full blood count', LabId: lab._id, progress: 'Completed', LabRemarks: 'Within reference range'},
    ]);
    console.log('Demo records created');
  }
} finally {
  await mongoose.disconnect();
}
