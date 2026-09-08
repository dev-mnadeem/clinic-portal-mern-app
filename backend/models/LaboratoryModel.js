import mongoose from 'mongoose';
import { protectCredentials } from './privateFields.js';

const laboratorySchema = new mongoose.Schema({
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

protectCredentials(laboratorySchema);
const Laboratory = mongoose.model('Laboratory', laboratorySchema);
export default Laboratory;
