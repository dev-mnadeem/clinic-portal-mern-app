import mongoose from "mongoose";
import Patient from "./patientModel";
const reportSchema = new Schema({
    patientId:{    
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    LabId:{    
        type: Schema.Types.ObjectId,
        ref: 'Laboratory',
        required: true,
    },
})
const Reports

