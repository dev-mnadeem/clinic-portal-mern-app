import React from "react";
import "../styles/DoctorDashStyle.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import Userdisplay from "../components/Userdisplay";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/js/dist/modal.js";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DoctorDash = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navtohome = () => {
    navigate("/");
  };
  const [appointments, setappointments] = useState([]);
  const [booked, setbooked] = useState([]);
  const [reset, setreset] = useState(false);
  const [patient, setpatient] = useState();
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
        setbooked(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetch(location.state.user._id, "getAllPendingAppointments");
    fetch(location.state.user._id, "getAllAcceptedAppointments");
    console.log(appointments);
  }, []);
  useEffect(() => {
    if (reset) {
      fetch(location.state.user._id, "getAllPendingAppointments");
      fetch(location.state.user._id, "getAllAcceptedAppointments");
      setreset(false);
    }
  }, [reset]);

  const addprescription = async (Med, patientId, quantity) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Doctors/addPrescription`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            Med: Med,
            patientId: patientId,
            quantity: quantity,
            doctorId: location.state.user._id,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const addpresc = () => {
    const medname = document.getElementById("medname").value;
    const quantity = document.getElementById("quantity").value;
    addprescription(medname, patient, quantity);
  };

  return (
    <div id="doctor-dash">
      <div className="container-fluid">
        <div className="row">
          <div id="side-nav" className="col-xl-2 col-lg-2 col-3 px-0 pt-2">
            <div className="nav d-flex flex-column align-items-center   px-0">
              <h1 className="mb-5" onClick={navtohome}>
                Curify
              </h1>
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
            <h3>Confirm Appointment</h3>
            {appointments.length != 0 ? (
              <>
                {Object.keys(appointments).map((key) => (
                  <Userdisplay
                    user={appointments[key]}
                    reset={setreset}
                    usertype="doctor"
                  ></Userdisplay>
                ))}
              </>
            ) : (
              <h5 className="text-muted mt-2">No Appointments</h5>
            )}

            <h3>Appointments</h3>
            <table>
              <tr>
                <th>Patients Name</th>
                <th>Date</th>
                <th className="d-flex flex-row align-items-center justify-content-center">
                  Prescribe
                </th>
              </tr>

              <>
                {Object.keys(booked).map((key) => (
                  <tr>
                    <td>{booked[key].patientName}</td>
                    <td>{booked[key].dateTime}</td>
                    <td className="d-flex flex-row align-items-center justify-content-center">
                      <button
                        type="button"
                        class="btn button"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal3"
                        onClick={() => setpatient(booked[key].patientId)}
                      >
                        Add prescription
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            </table>
          </div>
        </div>
      </div>

      <div
        class="modal "
        id="exampleModal3"
        tabindex="-1"
        aria-labelledby="exampleModalLabel3"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel3">
                Medicine
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="medname" class="form-label">
                  Name
                </label>
                <input type="text" class="form-control" id="medname" />
              </div>
              <div class="mb-3">
                <label for="quantity" class="form-label">
                  Quantity
                </label>
                <input type="number" class="form-control" id="quantity" />
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary" onClick={addpresc}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDash;
