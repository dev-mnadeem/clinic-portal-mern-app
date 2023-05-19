import React from "react";
import "../styles/patientstyle.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Patientdash = () => {
  const navigate = useNavigate();
  const navtohome = () => {
    navigate("/");
  };
  const [booked, setbooked] = useState([]);
  const [prescription, setprescription] = useState([]);
  const [dash, setdash] = useState(true);
  const [doctors, setdoctors] = useState([]);
  const [reports, setreports] = useState([]);
  const location = useLocation();
  const fetch = async (id, type) => {
    let temp;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Patients/${type}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            userID: id,
          },
        }
      );
      temp = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      if (type == "getAllAppointments") {
        setbooked(temp);
      }
      if (type == "myPrescription") {
        setprescription(temp.Prescription);
      }
    }
  };

  const getdocs = async () => {
    let temp;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/Admin/getAllDoctors`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      temp = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      setdoctors(temp);
    }
  };

  const getreports = async () => {
    let temp;
    console.log(location.state.user._id);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Patients/getMyReport`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            patientId: location.state.user._id,
          },
        }
      );
      temp = response.data;
      console.log(temp);
    } catch (error) {
      console.error(error);
    } finally {
      setreports(temp);
    }
  };

  useEffect(() => {
    fetch(location.state.user._id, "getAllAppointments");
    fetch(location.state.user._id, "myPrescription");
    getreports();
    getdocs();
  }, []);

  const gotodash = () => {
    setdash(true);
  };
  const gotobook = () => {
    setdash(false);
  };

  const appoint = async (patientId, doctorId, reason, datetime) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Patients/addAppointment`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            patientId: patientId,
            doctorId: doctorId,
            reason: reason,
            datetime: datetime,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const makeappointment = (e) => {
    let patientId = location.state.user._id;
    let doctorId = document.getElementById("doctor").value;
    let reason = document.getElementById("reason").value;
    let datetime = document.getElementById("date").value;
    appoint(patientId, doctorId, reason, datetime);
    gotodash();
  };

  return (
    <div id="patient-dash">
      <div className="container-fluid">
        <div className="row">
          <div id="side-nav" className="col-xl-2 col-lg-2 col-3 px-0 pt-2">
            <div className="nav d-flex flex-column align-items-center   px-0">
              <h1 className="mb-5" onClick={navtohome}>
                Curify
              </h1>
              <div className="navigate d-flex flex-column align-items-start justify-content-evenly ">
                <div
                  className="navlink ps-xl-3 ps-lg-3 ps-1"
                  onClick={gotodash}
                >
                  <p>Dashboard </p>
                </div>
                <div
                  className="navlink ps-xl-3 ps-lg-3 ps-1"
                  onClick={gotobook}
                >
                  <p>Book Appointment </p>
                </div>
              </div>
            </div>
          </div>
          <div
            id="main-content"
            className=" py-4 col-xl-10 col-lg-10 col-9 d-flex flex-column align-items-center justify-content-center"
          >
            {dash ? (
              <>
                <h3>Appointments</h3>
                <table>
                  <tr>
                    <th>Doctor's Name</th>
                    <th>Date</th>
                  </tr>

                  <>
                    {Object.keys(booked).map((key) => (
                      <tr>
                        <td>{booked[key].doctorName}</td>
                        <td>{booked[key].dateTime}</td>
                      </tr>
                    ))}
                  </>
                </table>
                <hr />
                <h3 className="mt-2">Prescriptions</h3>
                <div className=" user-head d-flex flex-row align-items-center justify-content-between py-2">
                  <h3 className="px-2">Prescribed By</h3>

                  <h3 className="px-2">Name</h3>
                </div>
                {Object.keys(prescription).map((key) => (
                  <div className=" user-box d-flex flex-row align-items-center justify-content-between py-2">
                    <h3 className="px-2">{prescription[key].doctorName}</h3>

                    <h3 className="px-2">{prescription[key].Medicine}</h3>
                  </div>
                ))}
                <h3 className="mt-2">Reports</h3>
                <div className=" user-head d-flex flex-row align-items-center justify-content-between py-2">
                  <h3 className="px-2">Patient Name</h3>

                  <h3 className="px-2">Remarks</h3>
                </div>
                {Object.keys(reports).map((key) => (
                  <div className=" user-box d-flex flex-row align-items-center justify-content-between py-2">
                    <h3 className="px-2">{reports[key].patientName}</h3>

                    <h3 className="px-2">{reports[key].LabRemarks}</h3>
                  </div>
                ))}
              </>
            ) : (
              <form className=" d-flex flex-column align-items-center">
                <div className="row register-side">
                  <div className="col-xl col-lg row  d-flex flex-column mx-xl-3 mx-lg-3">
                    <label for="reason">Reason</label>
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Enter Reason"
                      aria-label="reason"
                      id="reason"
                    />
                    <label for="date">Select Date</label>
                    <input
                      type="date"
                      className="form-control mb-3"
                      placeholder="for e.g abc@xyz.com"
                      aria-label="date"
                      id="date"
                    />

                    <label for="Doctor">Choose Doctor</label>
                    <select class="form-select" aria-label="doctor" id="doctor">
                      <option selected>Choose Doctor</option>

                      {Object.keys(doctors).map((key) => (
                        <option value={doctors[key]._id}>
                          {doctors[key].name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn button mt-3"
                  onClick={makeappointment}
                >
                  Book Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patientdash;
