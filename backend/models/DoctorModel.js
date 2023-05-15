const mongoose = require('mongoose');
const { Schema } = mongoose;

// Doctor Model
const doctorSchema = new Schema({
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
  appointments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
  ],
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
