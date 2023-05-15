const patientSchema = new Schema({
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
  appointments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
  ],
  prescriptions: {
    type: Map,
    of: Number,
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