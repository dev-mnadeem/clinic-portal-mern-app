import  express  from "express";
import {
    addPatient,
    addPharmacy,
    addDoctor,
    addLab,
    getAllPatients,
    getAllPharmacies,
    getAllDoctors,
    getAllLabs,
    delPatient,
    delDoctor,
    delPharmacy,
    delLab,
    updatePatient,
    updateDoctor,
    updatePharmacy,
    updateLab,
    login,
    signup} from"../controllers/adminController.js";
const Router = express.Router();


Router.post("/addPatient",addPatient)//checked
Router.post("/addPharmacy",addPharmacy)//checked
Router.post("/addDoctor",addDoctor)//checked
Router.post("/addLab",addLab)//checked
Router.get("/getAllPatients",getAllPatients)//checked
Router.get("/getAllPharmacies",getAllPharmacies)//checked
Router.get("/getAllDoctors",getAllDoctors)//checked
Router.get("/getAllLabs",getAllLabs)//checked
Router.post("/delPatient",delPatient)//checked
Router.post("/delDoctor",delDoctor)//checked
Router.post("/delPharmacy",delPharmacy)//checked
Router.post("/delLab",delLab)
Router.post("/updatePatient",updatePatient)
Router.post("/updateDoctor",updateDoctor)
Router.post("/updatePharmacy",updatePharmacy)
Router.post("/updateLab",updateLab)
Router.post("/login",login)
Router.post("/addAdmin",signup)

export default Router