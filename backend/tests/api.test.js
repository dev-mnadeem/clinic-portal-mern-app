import {before, after, test} from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import {MongoMemoryReplSet} from 'mongodb-memory-server';
import app from '../app.js';
import Patient from '../models/patientModel.js';
import Doctor from '../models/DoctorModel.js';
import Laboratory from '../models/LaboratoryModel.js';
import Pharmacy from '../models/PharmacyModel.js';
import Admin from '../models/adminModel.js';
import Appointment from '../models/AppointmentModel.js';
import Report from '../models/reportModel.js';
import Prescription from '../models/prescriptionModel.js';

// Every name, address and condition below is invented for the test.
let mongo;
const password = 'LocalTestPassword123!';
const users = {};
const tokens = {};
const endpoints = {patient: 'Patients', doctor: 'Doctors', lab: 'Labs', pharmacy: 'Pharmacies', admin: 'Admin'};

async function signIn(role, user) {
  const response = await request(app).post(`/api/${endpoints[role]}/login`).send({data: {email: user.email, password}}).expect(200);
  return response.body.token;
}
const as = (key) => ({Authorization: `Bearer ${tokens[key]}`});
const post = (key, path, data) => request(app).post(path).set(as(key)).send({data});

before(async () => {
  process.env.JWT_SECRET = 'test-only-signing-key-at-least-32-characters';
  mongo = await MongoMemoryReplSet.create({replSet: {count: 1}});
  await mongoose.connect(mongo.getUri());
  const hash = await bcrypt.hash(password, 4);
  const fixtures = {
    admin: [Admin, {name: 'Demo Admin', email: 'admin@clinic.example.test'}],
    patient: [Patient, {name: 'Avery Fictional', email: 'avery@clinic.example.test', age: 41, phoneNumber: '555-0100'}],
    doctor: [Doctor, {name: 'Dr. Rowan Sample', email: 'rowan@clinic.example.test', phoneNumber: '555-0101', specification: 'General practice'}],
    doctor2: [Doctor, {name: 'Dr. Quinn Example', email: 'quinn@clinic.example.test', phoneNumber: '555-0102'}],
    lab: [Laboratory, {name: 'Northside Demo Lab', email: 'lab@clinic.example.test', phoneNumber: '555-0103'}],
    lab2: [Laboratory, {name: 'Southside Demo Lab', email: 'lab2@clinic.example.test', phoneNumber: '555-0104'}],
    pharmacy: [Pharmacy, {name: 'Corner Demo Pharmacy', email: 'pharmacy@clinic.example.test', phoneNumber: '555-0105'}],
  };
  for (const [key, [Model, fields]] of Object.entries(fixtures)) {
    users[key] = await Model.create({...fields, password: hash});
    tokens[key] = await signIn(key.replace(/\d$/, ''), users[key]);
  }
});
after(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

test('health reports a connected database and unknown routes return 404', async () => {
  await request(app).get('/health').expect(200, {ready: true});
  await request(app).get('/api/Nowhere').expect(404);
});

test('malformed JSON is a client error, not a server error', async () => {
  await request(app).post('/api/Patients/login').set('Content-Type', 'application/json').send('{"data":').expect(400);
});

test('login rejects a wrong password without revealing which field was wrong', async () => {
  const response = await request(app).post('/api/Doctors/login').send({data: {email: users.doctor.email, password: 'not-the-password'}}).expect(401);
  assert.equal(response.body.error, 'Invalid email or password');
});

test('admin creates each account type and rejects duplicates and weak passwords', async () => {
  const created = await post('admin', '/api/Admin/addPatient', {name: 'Blake Placeholder', email: 'blake@clinic.example.test', password, age: 29, phone: '555-0110', disease: 'Seasonal allergy (demo)'}).expect(201);
  assert.equal(created.body.user.phoneNumber, '555-0110');
  assert.equal(created.body.user.password, undefined);
  await post('admin', '/api/Admin/addDoctor', {name: 'Dr. Casey Mock', email: 'casey@clinic.example.test', password, phone: '555-0111'}).expect(201);
  await post('admin', '/api/Admin/addLab', {name: 'Mock Lab', email: 'mocklab@clinic.example.test', password, phone: '555-0112'}).expect(201);
  await post('admin', '/api/Admin/addPharmacy', {name: 'Mock Pharmacy', email: 'mockpharm@clinic.example.test', password, phone: '555-0113'}).expect(201);
  await post('admin', '/api/Admin/addPatient', {name: 'Duplicate', email: 'blake@clinic.example.test', password, age: 30, phone: '555-0114'}).expect(409);
  await post('admin', '/api/Admin/addDoctor', {name: 'Short', email: 'short@clinic.example.test', password: 'short', phone: '555-0115'}).expect(400);
  await post('admin', '/api/Admin/addDoctor', {name: 'No password', email: 'nopass@clinic.example.test', phone: '555-0116'}).expect(400);
  await post('admin', '/api/Admin/addPatient', {name: 'No age', email: 'noage@clinic.example.test', password, phone: '555-0117'}).expect(400);
  const doctors = await request(app).get('/api/Admin/getAllDoctors').set(as('admin')).expect(200);
  assert.ok(doctors.body.some(doctor => doctor.email === 'casey@clinic.example.test'));
  assert.ok(doctors.body.every(doctor => doctor.password === undefined));
});

test('admin can add another administrator who can then sign in', async () => {
  await post('admin', '/api/Admin/addAdmin', {name: 'Second Admin', email: 'admin2@clinic.example.test', password}).expect(201);
  await request(app).post('/api/Admin/login').send({data: {email: 'admin2@clinic.example.test', password}}).expect(200);
});

test('admin updates store the phone number and a new password ends old sessions', async () => {
  const doctor = await Doctor.create({name: 'Dr. Update Me', email: 'update@clinic.example.test', password: await bcrypt.hash(password, 4), phoneNumber: '555-0120'});
  const oldToken = await signIn('doctor', doctor);
  await post('admin', '/api/Admin/updateDoctor', {email: doctor.email, phone: '555-0199', specification: 'Dermatology', password: 'ResetByAdmin12345'}).expect(200);
  const stored = await Doctor.findById(doctor._id);
  assert.equal(stored.phoneNumber, '555-0199');
  assert.equal(stored.specification, 'Dermatology');
  await request(app).get('/api/Doctors/DoctorbyID').set('Authorization', `Bearer ${oldToken}`).expect(401);
  await post('admin', '/api/Admin/updateDoctor', {email: 'missing@clinic.example.test', name: 'Nobody'}).expect(404);
});

test('deleting a patient removes their appointments, reports and prescriptions', async () => {
  const patient = await Patient.create({name: 'Temporary Patient', email: 'temp@clinic.example.test', password: 'x', age: 50, phoneNumber: '555-0130'});
  const links = {patientId: patient._id, doctorId: users.doctor._id};
  await Appointment.create({...links, dateTime: '2099-03-01'});
  await Report.create({...links, Type: 'Blood panel'});
  await Prescription.create({...links, Medicine: 'Demo tablets', Quantity: 1});
  await post('admin', '/api/Admin/delPatient', {userId: String(patient._id)}).expect(200);
  assert.equal(await Appointment.countDocuments({patientId: patient._id}), 0);
  assert.equal(await Report.countDocuments({patientId: patient._id}), 0);
  assert.equal(await Prescription.countDocuments({patientId: patient._id}), 0);
  await post('admin', '/api/Admin/delPatient', {userId: String(patient._id)}).expect(404);
  await post('admin', '/api/Admin/delPatient', {userId: 'not-an-id'}).expect(400);
});

test('deleting a laboratory returns its open requests to the assignment desk', async () => {
  const lab = await Laboratory.create({name: 'Closing Lab', email: 'closing@clinic.example.test', password: 'x', phoneNumber: '555-0140'});
  const report = await Report.create({patientId: users.patient._id, doctorId: users.doctor._id, Type: 'Lipid panel', LabId: lab._id});
  await post('admin', '/api/Admin/delLab', {userId: String(lab._id)}).expect(200);
  const desk = await request(app).get('/api/Admin/assignments').set(as('admin')).expect(200);
  assert.ok(desk.body.reports.some(row => row._id === String(report._id)));
});

test('a booking flows from patient request to doctor acceptance', async () => {
  const booked = await post('patient', '/api/Patients/addAppointment', {doctorId: String(users.doctor._id), reason: 'Routine check-up', datetime: '2099-04-02'}).expect(201);
  assert.equal(booked.body.patientName, 'Avery Fictional');
  await post('patient', '/api/Patients/addAppointment', {doctorId: String(users.doctor._id), reason: '', datetime: '2099-04-02'}).expect(400);

  let mine = await post('patient', '/api/Patients/getAllAppointments', {}).expect(200);
  assert.equal(mine.body.find(row => row._id === booked.body._id).Accepted, false);

  const pending = await post('doctor', '/api/Doctors/getAllPendingAppointments', {}).expect(200);
  assert.ok(pending.body.some(row => row._id === booked.body._id));
  await post('doctor2', '/api/Doctors/acceptAppointments', {AppID: booked.body._id}).expect(403);
  await post('doctor', '/api/Doctors/acceptAppointments', {AppID: booked.body._id}).expect(200);

  mine = await post('patient', '/api/Patients/getAllAppointments', {}).expect(200);
  assert.equal(mine.body.find(row => row._id === booked.body._id).Accepted, true);
  const accepted = await post('doctor', '/api/Doctors/getAllAcceptedAppointments', {}).expect(200);
  assert.ok(accepted.body.some(row => row._id === booked.body._id));
});

test('a doctor rejects only their own pending appointments', async () => {
  const appointment = await Appointment.create({patientId: users.patient._id, doctorId: users.doctor._id, dateTime: '2099-05-05', reason: 'Follow-up'});
  await post('doctor2', '/api/Doctors/rejectAppointments', {AppID: String(appointment._id)}).expect(403);
  await post('doctor', '/api/Doctors/rejectAppointments', {AppID: String(appointment._id)}).expect(200);
  assert.equal(await Appointment.exists({_id: appointment._id}), null);
});

test('prescriptions and test requests are validated and tied to the signed-in doctor', async () => {
  const patientId = String(users.patient._id);
  await Appointment.create({patientId: users.patient._id, doctorId: users.doctor._id, dateTime: '2099-06-01', Accepted: true});
  await post('doctor', '/api/Doctors/addPrescription', {Med: 'Demo syrup', patientId, quantity: 0}).expect(400);
  await post('doctor', '/api/Doctors/addPrescription', {Med: 'bad.name', patientId, quantity: 1}).expect(400);
  const created = await post('doctor', '/api/Doctors/addPrescription', {Med: 'Demo syrup', patientId, quantity: '2', doctorId: String(users.doctor._id)}).expect(201);
  assert.equal(created.body.Prescription.Quantity, 2);
  assert.equal(created.body.Prescription.doctorName, 'Dr. Rowan Sample');
  await post('doctor', '/api/Doctors/addPrescription', {Med: 'Demo syrup', patientId, quantity: 1, doctorId: String(users.doctor2._id)}).expect(403);

  const report = await post('doctor', '/api/Doctors/addReport', {reporttype: 'Full blood count', patientId}).expect(201);
  assert.equal(report.body.doctorId, String(users.doctor._id));
  await post('doctor2', '/api/Doctors/addReport', {reporttype: 'Full blood count', patientId}).expect(403);

  await post('doctor', '/api/Doctors/addReportRemarks', {reportId: report.body._id, Remarks: 'Repeat in six months'}).expect(200);
  assert.equal((await Report.findById(report.body._id)).doctorRemarks, 'Repeat in six months');
  await post('doctor', '/api/Doctors/addReportRemarks', {reportId: report.body._id}).expect(400);
});

test('a laboratory completes only requests assigned to it', async () => {
  const report = await Report.create({patientId: users.patient._id, doctorId: users.doctor._id, Type: 'Thyroid panel', patientName: 'Avery Fictional'});
  await post('admin', '/api/Admin/assignReport', {reportId: String(report._id), LabId: String(users.lab._id)}).expect(200);
  await post('lab2', '/api/Labs/addReportRemarks', {reportId: String(report._id), Remarks: 'Not mine'}).expect(403);
  await post('lab', '/api/Labs/addReportRemarks', {reportId: String(report._id), Remarks: ''}).expect(400);
  const done = await post('lab', '/api/Labs/addReportRemarks', {reportId: String(report._id), Remarks: 'Within reference range'}).expect(200);
  assert.equal(done.body.progress, 'Completed');

  const all = await post('lab', '/api/Labs/getAllReportsLab', {}).expect(200);
  assert.ok(all.body.some(row => row._id === String(report._id)));
  const open = await request(app).get('/api/Labs/getAllReport').set(as('lab')).expect(200);
  assert.ok(open.body.every(row => row.progress === 'In Progress'));
  const byPatient = await request(app).get(`/api/Labs/getAllReportsPatient?patientId=${users.patient._id}`).set(as('lab')).expect(200);
  assert.ok(byPatient.body.length >= 1);
  await request(app).get(`/api/Labs/getAllReportsPatient?patientId=${users.patient._id}`).set(as('lab2')).expect(403);

  const reports = await post('patient', '/api/Patients/getMyReport', {}).expect(200);
  assert.equal(reports.body.find(row => row._id === String(report._id)).LabRemarks, 'Within reference range');
});

test('pharmacy stock accepts only named items with positive whole quantities', async () => {
  await post('pharmacy', '/api/Pharmacies/addMedicine', {Med: 'Demo drops', quantity: 4}).expect(200);
  await post('pharmacy', '/api/Pharmacies/addMedicine', {Med: 'Demo drops', quantity: 3}).expect(200);
  await post('pharmacy', '/api/Pharmacies/addMedicine', {Med: 'Demo drops', quantity: -1}).expect(400);
  await post('pharmacy', '/api/Pharmacies/addMedicine', {Med: '$where', quantity: 1}).expect(400);
  const stock = await post('pharmacy', '/api/Pharmacies/getAllMedicine', {}).expect(200);
  assert.equal(stock.body['Demo drops'], 7);
});

test('dispensing fails cleanly when stock is short', async () => {
  const prescription = await Prescription.create({doctorId: users.doctor._id, patientId: users.patient._id, pharmacyId: users.pharmacy._id, Medicine: 'Scarce demo item', Quantity: 5});
  const response = await post('pharmacy', '/api/Pharmacies/deliverMedicine', {PresId: String(prescription._id)}).expect(409);
  assert.equal(response.body.error, 'Insufficient stock');
  assert.equal((await Prescription.findById(prescription._id)).delivered, false);
  const patients = await request(app).get('/api/Pharmacies/patients').set(as('pharmacy')).expect(200);
  assert.deepEqual(patients.body.map(row => row.name), ['Avery Fictional']);
});

test('a patient profile update cannot change another account or the password', async () => {
  await request(app).put(`/api/Patients/${users.patient._id}`).set(as('patient')).send({phone: '555-0177', address: '1 Example Street'}).expect(200);
  assert.equal((await Patient.findById(users.patient._id)).phoneNumber, '555-0177');
  await request(app).put(`/api/Patients/${users.doctor._id}`).set(as('patient')).send({phone: '555-0000'}).expect(403);
  await request(app).put(`/api/Patients/${users.patient._id}`).set(as('patient')).send({password: 'AnotherPassword123'}).expect(400);
});
