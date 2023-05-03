import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Patient from '../models/patientModel.js';
import Doctor from '../models/DoctorModel.js';
import Laboratory from '../models/LaboratoryModel.js';
import Pharmacy from '../models/PharmacyModel.js';
import Admin from '../models/adminModel.js';
import Appointment from '../models/AppointmentModel.js';
import Report from '../models/reportModel.js';
import Prescription from '../models/prescriptionModel.js';

const models = {patient: Patient, doctor: Doctor, lab: Laboratory, pharmacy: Pharmacy, admin: Admin};
const issuer = 'clinic-portal';
const audience = 'clinic-api';
function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error('JWT_SECRET must contain at least 32 random characters');
  return value;
}
const forbidden = (res) => res.status(403).json({error:'Access denied'});

export function signIn(role) {
  return async (req, res, next) => {
    try {
      const {email, password} = req.body?.data || req.body || {};
      if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).json({error:'Email and password are required'});
      const user = await models[role].findOne({email:email.trim()}).select('+password');
      if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).json({error:'Invalid email or password'});
      const token = jwt.sign({role, v:user.tokenVersion || 0}, secret(), {subject:String(user._id), issuer, audience, algorithm:'HS256', expiresIn:'15m'});
      const profile = user.toJSON();
      delete profile.password;
      delete profile.tokenVersion;
      return res.json({...profile, token, role});
    } catch (error) {next(error);}
  };
}

function ownIdentifiers(req, actor, names) {
  const objects = [req.body, req.body?.data, req.query];
  for (const object of objects) {
    if (!object || typeof object !== 'object' || Array.isArray(object)) continue;
    for (const name of names) {
      if (object[name] !== undefined && String(object[name]) !== actor.id) return false;
      object[name] = actor.id;
    }
    if (object.email !== undefined && object.email !== actor.email) return false;
    object.email = actor.email;
  }
  return true;
}

export function roleAccess(role) {
  return async (req, res, next) => {
    const authorization = req.get('Authorization') || '';
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({error:'Authentication required'});
    let claims;
    try {
      claims = jwt.verify(authorization.slice(7), secret(), {algorithms:['HS256'], issuer, audience});
    } catch {return res.status(401).json({error:'Invalid or expired session'});}
    if (claims.role !== role || !mongoose.isValidObjectId(claims.sub)) return forbidden(res);
    try {
      const user = await models[role].findById(claims.sub).select('_id email tokenVersion');
      if (!user || (user.tokenVersion || 0) !== claims.v) return res.status(401).json({error:'Session is no longer valid'});
      req.actor = {id:String(user._id), email:user.email, role};
      req.body ??= {};
      const data = req.body.data;
      const path = req.path.toLowerCase();
      const identityFields = role === 'patient' ? ['patientId','userID'] : role === 'doctor' ? ['doctorId','userID'] : role === 'lab' ? ['LabId','userID'] : role === 'pharmacy' ? ['PharmId','userID'] : [];
      if (role !== 'admin' && !ownIdentifiers(req, req.actor, identityFields)) return forbidden(res);

      if (role === 'patient') {
        const paths = ['/changepass','/findbyid','/findbyemail','/addappointment','/myprescription','/getallappointments','/getmyreport','/doctors'];
        const profileUpdate = req.method === 'PUT' && req.path.slice(1) === req.actor.id;
        if (!paths.includes(path) && !profileUpdate) return forbidden(res);
      } else if (role === 'doctor') {
        const paths = ['/changepass','/doctorbyid','/addprescription','/addreport','/getallpendingappointments','/getallacceptedappointments','/rejectappointments','/acceptappointments','/getpatientreport','/addreportremarks'];
        if (!paths.includes(path)) return forbidden(res);
        if (data?.AppID && !await Appointment.exists({_id:data.AppID,doctorId:req.actor.id})) return forbidden(res);
        if (data?.reportId && !await Report.exists({_id:data.reportId,doctorId:req.actor.id})) return forbidden(res);
        const patientId = typeof data === 'string' ? data : data?.patientId;
        if (patientId && !await Appointment.exists({patientId,doctorId:req.actor.id,Accepted:true})) return forbidden(res);
      } else if (role === 'lab') {
        const paths = ['/changepass','/getallreportslab','/getallreportspatient','/addreports','/labbyid','/addreportremarks','/getallreport'];
        if (!paths.includes(path)) return forbidden(res);
        if (['/addreports','/addreportremarks'].includes(path)) {
          if (!data?.reportId || !await Report.exists({_id:data.reportId,LabId:req.actor.id})) return forbidden(res);
        }
        const patientId = data?.patientId || req.body.patientId;
        if (patientId && !await Report.exists({patientId,LabId:req.actor.id})) return forbidden(res);
      } else if (role === 'pharmacy') {
        const paths = ['/changepass','/pharmbyid','/getclientprescription','/getallmedicine','/addmedicine','/delivermedicine','/patients'];
        if (!paths.includes(path)) return forbidden(res);
        if (data?.patientId && !await Prescription.exists({patientId:data.patientId,pharmacyId:req.actor.id})) return forbidden(res);
        if (path === '/delivermedicine' && (!data?.PresId || !await Prescription.exists({_id:data.PresId,pharmacyId:req.actor.id,delivered:false}))) return forbidden(res);
      } else {
        const paths = ['/addpatient','/addpharmacy','/adddoctor','/addlab','/getallpatients','/getallpharmacies','/getalldoctors','/getalllabs','/delpatient','/deldoctor','/delpharmacy','/dellab','/updatepatient','/updatedoctor','/updatepharmacy','/updatelab','/addadmin','/assignreport','/assignprescription','/assignments','/changepass'];
        if (!paths.includes(path)) return forbidden(res);
      }
      if (path === '/changepass' && (typeof data?.password !== 'string' || typeof data?.newpass !== 'string' || data.newpass.length < 12)) {
        return res.status(400).json({error:'Supply your current password and a new password of at least 12 characters'});
      }
      if (role === 'admin' && path !== '/changepass') {
        const password = req.body?.data?.password ?? req.body?.password;
        if (password !== undefined && (typeof password !== 'string' || password.length < 12)) return res.status(400).json({error:'Passwords must contain at least 12 characters'});
      }
      next();
    } catch (error) {
      if (error.name === 'CastError') return res.status(400).json({error:'Invalid record identifier'});
      next(error);
    }
  };
}

export function changeOwnPassword(role) {
  return async (req,res,next) => {
    try {
      const {password,newpass}=req.body.data;
      const user=await models[role].findById(req.actor.id).select('+password');
      if (!user || !await bcrypt.compare(password,user.password)) return res.status(401).json({error:'Current password is incorrect'});
      user.password=await bcrypt.hash(newpass,12);
      await user.save();
      return res.json({message:'Password changed. Sign in again.'});
    } catch(error) {next(error);}
  };
}
