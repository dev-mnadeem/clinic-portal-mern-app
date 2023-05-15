const appointmentSchema = new Schema({
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    dateTime: {
      type: String,
      required: true,
    },
  });
  
  const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment  