import mongoose from "mongoose";
import Patient from "./patientModel.js";
const reportSchema = new mongoose.Schema({
    patientId:{    
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    LabId:{    
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Laboratory',
        required: true,
    },
    Type:{
        type:String
    },
    progress:{
        type:String,
        default:"In Progress"
    }
});
const Report=mongoose.model("Report",reportSchema)
export default Report

