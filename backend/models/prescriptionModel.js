import mongoose from "mongoose";
const PrescriptionSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  Medicine: {
    type: String,
  },
  Quantity: {
    type: Number,
  },
  doctorName: {
    type: String,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
});

const Prescription = mongoose.model("Prescription", PrescriptionSchema);
export default Prescription;
