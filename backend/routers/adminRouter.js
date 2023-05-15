import  express  from "express";
import {} from "../controllers/adminController.js"
const Router = express.Router();


Router.post("/addPatient")
Router.post("/addPharmacy")
Router.post("/addDoctor")
Router.post("/addLab")
Router.get("/getAllPatients")
Router.get("/getAllPharmacies")
Router.get("/getAllDoctors")
Router.get("/getAllLabs")
Router.post("/delPatient")
Router.post("/delDoctor")
Router.post("/delPharmacy")
Router.post("/delLab")
Router.post("/login")

export default Router