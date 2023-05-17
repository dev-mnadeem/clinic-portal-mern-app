import mongoose from "mongoose";
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
  
  const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema);
  export default Pharmacist