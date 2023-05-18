import React from "react";
import "../styles/patientstyle.scss";

const Patientdash = () => {
  return (
    <div id="patient-dash">
      <div className="container-fluid">
        <div className="row">
          <div id="side-nav" className="col-xl-2 col-lg-2 col-3 px-0 pt-2">
            <div className="nav d-flex flex-column align-items-center   px-0">
              <h1 className="mb-5">Curify</h1>
              <div className="navigate d-flex flex-column align-items-start justify-content-evenly ">
                <div className="navlink ps-xl-3 ps-lg-3 ps-1">
                  <p>Dashoboard </p>
                </div>
                <div className="navlink ps-xl-3 ps-lg-3 ps-1">
                  <p>Book Appointment </p>
                </div>
              </div>
            </div>
          </div>
          <div
            id="main-content"
            className=" py-4 col-xl-10 col-lg-10 col-9 d-flex flex-column align-items-center"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Patientdash;
