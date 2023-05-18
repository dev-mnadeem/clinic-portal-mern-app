import React from "react";
import "../styles/DoctorDashStyle.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import Userdisplay from "../components/Userdisplay";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";

const DoctorDash = () => {
  const location = useLocation();
  const [appointments, setappointments] = useState([]);
  const [booked, setbooked] = useState([]);
  const [reset, setreset] = useState(false);
  const fetch = async (id, type) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Doctors/${type}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            userID: id,
          },
        }
      );
      if (type == "getAllPendingAppointments") {
        setappointments(response.data);
      }
      if (type == "getAllAcceptedAppointments") {
        console.log(response.data);
        setbooked(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetch(location.state.user._id, "getAllPendingAppointments");
    fetch(location.state.user._id, "getAllAcceptedAppointments");
  }, []);
  useEffect(() => {
    if (reset) {
      fetch(location.state.user._id, "getAllPendingAppointments");
      fetch(location.state.user._id, "getAllAcceptedAppointments");
      setreset(false);
    }
  }, [reset]);

  return (
    <div id="doctor-dash">
      <div className="container-fluid">
        <div className="row">
          <div id="side-nav" className="col-xl-2 col-lg-2 col-3 px-0 pt-2">
            <div className="nav d-flex flex-column align-items-center   px-0">
              <h1 className="mb-5">Curify</h1>
              <div className="navigate d-flex flex-column align-items-start justify-content-evenly ">
                <div className="navlink ps-xl-3 ps-lg-3 ps-1">
                  <h4>Doctor: {location.state.user.name}</h4>
                </div>
              </div>
            </div>
          </div>
          <div
            id="main-content"
            className=" py-4 col-xl-10 col-lg-10 col-9 d-flex flex-column align-items-center"
          >
            <h3>Book Appointment</h3>
            {Object.keys(appointments).map((key) => (
              <Userdisplay
                user={appointments[key]}
                reset={setreset}
                usertype="doctor"
              ></Userdisplay>
            ))}

            <h3>Appointments</h3>
            <table>
              <tr>
                <th>Patients Name</th>
                <th>Date</th>
              </tr>

              <>
                {Object.keys(booked).map((key) => (
                  <tr>
                    <td>{booked[key].patientName}</td>
                    <td>{booked[key].dateTime}</td>
                  </tr>
                ))}
              </>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDash;
