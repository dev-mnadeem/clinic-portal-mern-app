import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
        // `select: false` keeps the hash out of every query result by default.
    // Without it, every endpoint that returned a user document — login,
    // changePass, findbyID, findbyEmail and the admin listings — shipped the
    // bcrypt hash to the browser. Code that genuinely needs it must now ask,
    // with .select('+password').
password: {
    select: false,
      type: String,
      required: true,
    },
  });
  
  const Admin = mongoose.model('Admin', adminSchema);
  export default Admin
  

// Never serialise the password hash, however the document was obtained.
//
// `select: false` above stops queries pulling it in by default, but the login
// and change-password paths ask for it explicitly with .select('+password'),
// and a document built in memory (`new Patient({...})`) was never subject to
// select at all. Both of those paths returned the whole document to the
// client, hash included. This closes it at serialisation, which is the only
// place that catches every route.
adminSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});
