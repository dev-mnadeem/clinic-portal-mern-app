import mongoose from 'mongoose';
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // id: {
  //   type: String,
  //   required: true,
  //   //unique: true
  // },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  disease: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
});
const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
