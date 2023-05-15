const laboratorySchema = new Schema({
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
    reports: {
      type: Map,
      of: String,
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