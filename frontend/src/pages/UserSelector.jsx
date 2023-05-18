import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../styles/userStyle.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserSelector = () => {
  

  let navigate = useNavigate();
  const navpatient = () => {
    navigate("/patientlogin");
  };
  const navdoc = () => {
    navigate("/doctorlogin");
  };
  const navpharm = () => {
    navigate("/pharmacylogin");
  };
  const navlab = () => {
    navigate("/lablogin");
  };
  const navadmin = () => {
    navigate("/adminlogin");
  };
  return (
    <div className="user-main d-flex flex-column justify-content-evenly align-items-center ">
      <h1>Login</h1>
      <div className=" user-contain d-flex flex-column flex-xl-row flex-lg-row align-items-center justify-content-evenly">
        <div
          className="circle-contain d-flex flex-column align-items-center justify-content-evenly"
          onClick={navpatient}
        >
          <div className="circle" id="patient"></div>
          <h3>Patient</h3>
        </div>
        <div
          className="circle-contain d-flex flex-column align-items-center justify-content-evenly"
          onClick={navdoc}
        >
          <div className="circle" id="doctor"></div>
          <h3>Doctor</h3>
        </div>
        <div
          className="circle-contain d-flex flex-column align-items-center justify-content-evenly"
          onClick={navpharm}
        >
          <div className="circle" id="pharmacy"></div>
          <h3>Pharmacy</h3>
        </div>
        <div
          className="circle-contain d-flex flex-column align-items-center justify-content-evenly"
          onClick={navlab}
        >
          <div className="circle" id="lab"></div>
          <h3>Laboratory</h3>
        </div>
      </div>
      <h4 onClick={navadmin}>Login as Administrator</h4>
    </div>
  );
};
export default UserSelector;
