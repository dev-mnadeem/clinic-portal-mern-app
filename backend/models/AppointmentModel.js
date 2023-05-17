import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema({
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    dateTime: {
      type: String,
      required: true,
    },
    patientName:{
      type:String,
    },
    reason:{
      type:String
    },
    rejected:{
      type:Boolean,
      default:false
    }
  });
  
  const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment  