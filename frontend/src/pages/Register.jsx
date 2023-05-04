import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../styles/RegisterStyle.scss";
import { useState } from "react";

const Register = () => {
  const [dash, setdash] = useState(true);
  const [patient, setpatient] = useState(false);
  const [doctor, setdoctor] = useState(false);
  const [lab, setlab] = useState(false);
  const [pharmacy, setpharmacy] = useState(false);

  const addpatient = () => {
    setpatient(true);
    setdash(false);
  };
  const adddoc = () => {
    setdoctor(true);
    setdash(false);
  };
  const addlab = () => {
    setlab(true);
    setdash(false);
  };
  const addpharma = () => {
    setpharmacy(true);
    setdash(false);
  };
  const gotodash = () => {
    setdash(true);
    setpatient(false);
    setdoctor(false);
    setlab(false);
    setpharmacy(false);
  };

  return (
    <div id="register">
      <div className="container-fluid">
        <div className="row">
          <div id="side-nav" className="col-xl-2 col-lg-2 col-3 px-0 pt-2">
            <div className="nav d-flex flex-column align-items-center justify-content-between px-0">
              <h1>Curify</h1>
              <div className="navigate d-flex flex-column align-items-start justify-content-evenly ">
                <div
                  className="navlink ps-xl-3 ps-lg-3 ps-1"
                  onClick={gotodash}
                >
                  <p>Dashboard</p>
                </div>
                <div className="navlink ps-xl-3 ps-lg-3 ps-1">
                  <p>Manage Doctors</p>
                </div>
                <div className="navlink ps-xl-3 ps-lg-3 ps-1">
                  <p>Manage Pharmacy</p>
                </div>
                <div className="navlink ps-xl-3 ps-lg-3 ps-1">
                  <p>Manage Patients</p>
                </div>
                <div className="navlink ps-xl-3 ps-lg-3 ps-1">
                  <p>Manage Laboratory</p>
                </div>
              </div>
            </div>
          </div>
          <div id="main-content" className="col-xl-10 col-lg-10 col-9">
            {dash ? (
              <div className=" user-contain d-flex flex-column flex-xl-row flex-lg-row align-items-center justify-content-evenly">
                <div
                  className="circle-contain d-flex flex-column align-items-center justify-content-evenly"
                  onClick={addpatient}
                >
                  <div className="circle patient"></div>
                  <h3>Add Patient</h3>
                </div>
                <div
                  className="circle-contain d-flex flex-column align-items-center justify-content-evenly"
                  onClick={adddoc}
                >
                  <div className="circle doctor"></div>
                  <h3>Add Doctor</h3>
                </div>
                <div
                  className="circle-contain d-flex flex-column align-items-center justify-content-evenly"
                  onClick={addpharma}
                >
                  <div className="circle pharmacy"></div>
                  <h3>Add Pharmacy</h3>
                </div>
                <div className="circle-contain d-flex flex-column align-items-center justify-content-evenly">
                  <div className="circle lab" onClick={addlab}></div>
                  <h3>Add Laboratory</h3>
                </div>
              </div>
            ) : (
              <div className="container-fluid">
                <div className="row registry">
                  <div className="col-lg-3 col-xl-3 row user-side d-flex flex-column align-items-center justify-content-center">
                    <div className="circle2-contain d-flex flex-column align-items-center justify-content-evenly my-lg-0 my-xl-0 my-3">
                      <div className="circle2 patient"></div>
                      {patient ? <h3>Add Patient</h3> : null}
                      {doctor ? <h3>Add Doctor</h3> : null}
                      {lab ? <h3>Add Laboratory</h3> : null}
                      {pharmacy ? <h3>Add Pharmacy</h3> : null}
                    </div>
                  </div>

                  <div className="col-xl-9 col-lg-9 col-12 d-flex flex-column align-items-center justify-content-center">
                    <form className=" d-flex flex-column align-items-center">
                      <div className="row register-side">
                        <div className="col-xl col-lg row  d-flex flex-column mx-xl-3 mx-lg-3">
                          <label for="name">Enter Name</label>
                          <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Enter name"
                            aria-label="name"
                          />
                          <label for="email">Enter Email</label>
                          <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="for e.g abc@xyz.com"
                            aria-label="email"
                          />
                          {patient ? (
                            <>
                              <label for="disease">Enter Disease</label>
                              <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Disease"
                                aria-label="disease"
                              />
                            </>
                          ) : null}
                          {doctor || lab ? (
                            <>
                              <label for="specification">
                                Enter Specification
                              </label>
                              <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Specification"
                                aria-label="specification"
                              />
                            </>
                          ) : null}

                          <label for="phnum">Enter Phone Number</label>
                          <input
                            type="tel"
                            className="form-control mb-3"
                            placeholder="XXXX-XXXXXXX"
                            aria-label="phnum"
                          />
                        </div>
                        <div className="col-xl col-lg row  d-flex flex-column mx-xl-3 mx-lg-3">
                          <label for="id">Enter ID</label>
                          <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="ID"
                            aria-label="id"
                          />
                          <label for="password">Enter Password</label>
                          <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Password"
                            aria-label="password"
                          />
                          <label for="address">Enter Address</label>
                          <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Address"
                            aria-label="address"
                          />
                          {patient ? (
                            <>
                              <label for="age">Enter Age</label>
                              <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Age"
                                aria-label="age"
                              />
                            </>
                          ) : null}
                        </div>
                      </div>
                      <button type="submit" className="btn add-button">
                        Add {patient ? "Patient" : null}
                        {doctor ? "Doctor" : null}
                        {lab ? "Laboratory" : null}
                        {pharmacy ? "Pharmacy" : null}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
