const pharmacistSchema = new Schema({
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
    medicines: {
      type: Map,
      of: Number,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  });
  
  const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema);
  export default Pharmacist