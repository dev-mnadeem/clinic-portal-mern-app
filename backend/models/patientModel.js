import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({
  name:{
    type:String,
    required : true
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
  age: {
    type: Number,
    required: true,
  },
  disease: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient