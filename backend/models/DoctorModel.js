import mongoose from 'mongoose'
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
const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor
