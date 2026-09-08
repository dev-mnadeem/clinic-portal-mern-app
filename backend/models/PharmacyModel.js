import mongoose from 'mongoose';
import { protectCredentials } from './privateFields.js';

const pharmacistSchema = new mongoose.Schema({
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
    medicines: {
      type: Map,
      of: Number,
      default:[]
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  });

protectCredentials(pharmacistSchema);
const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema);
export default Pharmacist;
