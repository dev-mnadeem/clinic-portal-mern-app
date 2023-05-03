import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../backend/models/adminModel.js';

const email=process.env.BOOTSTRAP_ADMIN_EMAIL;
const password=process.env.BOOTSTRAP_ADMIN_PASSWORD;
if (!email || !password || password.length<12 || !process.env.MONGO_URI) {
  throw new Error('Set MONGO_URI, BOOTSTRAP_ADMIN_EMAIL and a BOOTSTRAP_ADMIN_PASSWORD of at least 12 characters');
}
try {
  await mongoose.connect(process.env.MONGO_URI);
  if (await Admin.exists({})) throw new Error('An admin already exists; use the authenticated admin API');
  await Admin.create({name:'Clinic administrator',email,password:await bcrypt.hash(password,12)});
  console.log('Initial administrator created');
} finally {await mongoose.disconnect();}
