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

let mongo;
const users={};
const tokens={};
const password='LocalTestPassword123!';
before(async () => {
  process.env.JWT_SECRET='test-only-signing-key-at-least-32-characters';
  mongo=await MongoMemoryReplSet.create({replSet:{count:1}});
  await mongoose.connect(mongo.getUri());
  const hash=await bcrypt.hash(password,4);
  for (const [role,Model] of Object.entries({patient:Patient,doctor:Doctor,lab:Laboratory,pharmacy:Pharmacy,admin:Admin})) {
    users[role]=await Model.create({name:`Test ${role}`,email:`${role}@example.test`,password:hash,phoneNumber:'0000000000',age:30});
    const endpoint={patient:'Patients',doctor:'Doctors',lab:'Labs',pharmacy:'Pharmacies',admin:'Admin'}[role];
    const response=await request(app).post(`/api/${endpoint}/login`).send({data:{email:users[role].email,password}}).expect(200);
    assert.equal(response.body.password,undefined);
    assert.equal(response.body.tokenVersion,undefined);
    tokens[role]=response.body.token;
  }
  users.other=await Patient.create({name:'Other patient',email:'other@example.test',password:hash,phoneNumber:'0000000000',age:31});
});
after(async () => {await mongoose.disconnect();if(mongo)await mongo.stop();});
const auth=role=>`Bearer ${tokens[role]}`;

test('medical and admin routes reject anonymous callers',async()=>{
  for(const endpoint of ['/api/Patients/getMyReport','/api/Doctors/addPrescription','/api/Labs/getAllReportsLab','/api/Pharmacies/deliverMedicine','/api/Admin/addAdmin']) {
    await request(app).post(endpoint).send({data:{}}).expect(401);
  }
});
test('a signed-in patient cannot access another patient or an admin route',async()=>{
  await request(app).post('/api/Patients/getMyReport').set('Authorization',auth('patient')).send({data:{patientId:String(users.other._id)}}).expect(403);
  await request(app).get('/api/Admin/getAllPatients').set('Authorization',auth('patient')).expect(403);
  const own=await request(app).get('/api/Patients/findbyID').set('Authorization',auth('patient')).expect(200);
  assert.equal(own.body._id,String(users.patient._id));
});
test('doctors need an accepted appointment before accessing a patient',async()=>{
  const payload={data:String(users.patient._id)};
  await request(app).post('/api/Doctors/getPatientReport').set('Authorization',auth('doctor')).send(payload).expect(403);
  await Appointment.create({doctorId:users.doctor._id,patientId:users.patient._id,dateTime:'2098-01-10T10:00',Accepted:true});
  await request(app).post('/api/Doctors/getPatientReport').set('Authorization',auth('doctor')).send(payload).expect(200);
});
test('laboratory listings contain only explicitly assigned requests',async()=>{
  const common={patientId:users.patient._id,doctorId:users.doctor._id,Type:'Demo test'};
  const assigned=await Report.create({...common,LabId:users.lab._id});
  await Report.create(common);
  const response=await request(app).get('/api/Labs/getAllReport').set('Authorization',auth('lab')).expect(200);
  assert.deepEqual(response.body.map(row=>row._id),[String(assigned._id)]);
});
test('pharmacies cannot retrieve unassigned prescriptions',async()=>{
  const prescription=await Prescription.create({doctorId:users.doctor._id,patientId:users.patient._id,Medicine:'Demo item',Quantity:1});
  const payload={data:{patientId:String(users.patient._id)}};
  await request(app).post('/api/Pharmacies/getClientPrescription').set('Authorization',auth('pharmacy')).send(payload).expect(403);
  await request(app).post('/api/Admin/assignPrescription').set('Authorization',auth('admin')).send({data:{prescriptionId:String(prescription._id),pharmacyId:String(users.pharmacy._id)}}).expect(200);
  const response=await request(app).post('/api/Pharmacies/getClientPrescription').set('Authorization',auth('pharmacy')).send(payload).expect(200);
  assert.equal(response.body.Prescription.length,1);
});
test('concurrent dispensing records one delivery and one stock decrement',async()=>{
  await Pharmacy.updateOne({_id:users.pharmacy._id}, {$set:{'medicines.Demo':5}});
  const prescription=await Prescription.create({doctorId:users.doctor._id,patientId:users.patient._id,pharmacyId:users.pharmacy._id,Medicine:'Demo',Quantity:2});
  const dispense=()=>request(app).post('/api/Pharmacies/deliverMedicine').set('Authorization',auth('pharmacy')).send({data:{PresId:String(prescription._id)}});
  const responses=await Promise.all([dispense(),dispense()]);
  assert.equal(responses.filter(r=>r.status===200).length,1);
  assert.ok(responses.some(r=>[403,409].includes(r.status)));
  const pharmacy=await Pharmacy.findById(users.pharmacy._id);
  assert.equal(pharmacy.medicines.get('Demo'),3);
  assert.equal((await Prescription.findById(prescription._id)).delivered,true);
});
test('changing a password invalidates the old session token',async()=>{
  await request(app).post('/api/Patients/changePass').set('Authorization',auth('patient')).send({data:{password,newpass:'ChangedPassword123!'}}).expect(200);
  await request(app).get('/api/Patients/findbyID').set('Authorization',auth('patient')).expect(401);
  await request(app).post('/api/Patients/login').send({data:{email:users.patient.email,password:'ChangedPassword123!'}}).expect(200);
});
