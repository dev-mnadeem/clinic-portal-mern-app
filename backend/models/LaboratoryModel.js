import mongoose from "mongoose";
const laboratorySchema = new mongoose.Schema({
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
  
  const Laboratory = mongoose.model('Laboratory', laboratorySchema);
export default Laboratory  