import mongoose from 'mongoose';
import { protectCredentials } from './privateFields.js';

const doctorSchema = new mongoose.Schema({
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
  history: {
    type: String,
  },
  address: {
    type: String,
  },
  specification: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

protectCredentials(doctorSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
