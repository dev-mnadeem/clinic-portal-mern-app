import mongoose from 'mongoose';
import { protectCredentials } from './privateFields.js';

const adminSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
password: {
    select: false,
      type: String,
      required: true,
    },
  });

protectCredentials(adminSchema);
const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
