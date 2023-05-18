import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../styles/RegisterStyle.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import Userdisplay from "../components/Userdisplay";

const Register = () => {
  const [All, setAll] = useState([]);
  const [reset, setreset] = useState(false);

  useEffect(() => {
    if (managePatient && reset) {
      fetch("getAllPatients");
      setreset(false);
    }
    if (manageDoctor && reset) {
      fetch("getAllDoctors");
      setreset(false);
    }
    if (managelab && reset) {
      fetch("getAllLabs");
      setreset(false);
    }
    if (managepharma && reset) {
      fetch("getAllPharmacies");
      setreset(false);
    }
  }, [reset]);

  const fetch = async (name) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/Admin/${name}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAll(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const add = async (
    name,
    email,
    type,
    disease,
    specification,
    phnum,
    password,
    address,
    age
  ) => {
    try {
      console.log("in");
      const response = await axios.post(
        `http://localhost:5000/api/Admin/${type}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            name: name,
            email: email,
            password: password,
            disease: disease,
            age: age,
            phone: phnum,
            address: address,
            specification: specification,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const getdata = () => {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let type;
    let disease;
    let specification;
    let phnum = document.getElementById("phnum").value;
    let password = document.getElementById("password").value;
    let address = document.getElementById("address").value;
    let age;
    if (pharmacy) {
      type = "addPharmacy";
    }
    if (patient) {
      disease = document.getElementById("disease").value;
      type = "addPatient";
      age = document.getElementById("age").value;
    }
    if (doctor || lab) {
      specification = document.getElementById("specification").value;
      if (doctor) {
        type = "addDoctor";
      }
      if (lab) {
        type = "addLab";
      }
    }

    add(
      name,
      email,
      type,
      disease,
      specification,
      phnum,
      password,
      address,
      age
    );
  };

  const [dash, setdash] = useState(true);
  const [patient, setpatient] = useState(false);
  const [doctor, setdoctor] = useState(false);
  const [lab, setlab] = useState(false);
  const [pharmacy, setpharmacy] = useState(false);
  const [managePatient, setmanagePatient] = useState(false);
  const [manageDoctor, setmanageDoctor] = useState(false);
  const [managelab, setmanagelab] = useState(false);
  const [managepharma, setmanagepharma] = useState(false);

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
    setmanagePatient(false);
    setmanageDoctor(false);
    setmanagelab(false);
    setmanagepharma(false);
  };
  const gotopatient = () => {
    fetch("getAllPatients");
    setmanagePatient(true);
    setmanageDoctor(false);
    setmanagelab(false);
    setmanagepharma(false);
    setdash(false);
    setpatient(false);
    setdoctor(false);
    setlab(false);
    setpharmacy(false);
  };

  const gotoDoctor = () => {
    setmanagePatient(false);
    setmanageDoctor(true);
    setmanagelab(false);
    setmanagepharma(false);
    setdash(false);
    setpatient(false);
    setdoctor(false);
    setlab(false);
    setpharmacy(false);
    fetch("getAllDoctors");
  };
  const gotolab = () => {
    fetch("getAllLabs");
    setmanagePatient(false);
    setmanageDoctor(false);
    setmanagelab(true);
    setmanagepharma(false);
    setdash(false);
    setpatient(false);
    setdoctor(false);
    setlab(false);
    setpharmacy(false);
  };
  const gotopharma = () => {
    fetch("getAllPharmacies");
    setmanagePatient(false);
    setmanageDoctor(false);
    setmanagelab(false);
    setmanagepharma(true);
    setdash(false);
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
                <div
                  className="navlink ps-xl-3 ps-lg-3 ps-1"
                  onClick={gotoDoctor}
                >
                  <p>Manage Doctors</p>
                </div>
                <div
                  className="navlink ps-xl-3 ps-lg-3 ps-1"
                  onClick={gotopharma}
                >
                  <p>Manage Pharmacy</p>
                </div>
                <div
                  className="navlink ps-xl-3 ps-lg-3 ps-1"
                  onClick={gotopatient}
                >
                  <p>Manage Patients</p>
                </div>
                <div className="navlink ps-xl-3 ps-lg-3 ps-1" onClick={gotolab}>
                  <p>Manage Laboratory</p>
                </div>
              </div>
            </div>
          </div>
          <div id="main-content" className="col-xl-10 col-lg-10 col-9">
            {managePatient || manageDoctor || managelab || managepharma ? (
              <div className="mt-5">
                {managePatient ? (
                  <>
                    {Object.keys(All).map((key) => (
                      <Userdisplay
                        user={All[key]}
                        type="Patient"
                        reset={setreset}
                        usertype="admin"
                      ></Userdisplay>
                    ))}
                  </>
                ) : null}

                {manageDoctor ? (
                  <>
                    {Object.keys(All).map((key) => (
                      <Userdisplay
                        user={All[key]}
                        type="Doctor"
                        reset={setreset}
                        usertype="admin"
                      ></Userdisplay>
                    ))}
                  </>
                ) : null}
                {managepharma ? (
                  <>
                    {Object.keys(All).map((key) => (
                      <Userdisplay
                        user={All[key]}
                        type="Pharmacy"
                        reset={setreset}
                        usertype="admin"
                      ></Userdisplay>
                    ))}
                  </>
                ) : null}

                {managelab ? (
                  <>
                    {Object.keys(All).map((key) => (
                      <Userdisplay
                        user={All[key]}
                        type="Lab"
                        reset={setreset}
                        usertype="admin"
                      ></Userdisplay>
                    ))}
                  </>
                ) : null}
              </div>
            ) : (
              <>
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
                        <form
                          className=" d-flex flex-column align-items-center"
                          onSubmit={getdata}
                        >
                          <div className="row register-side">
                            <div className="col-xl col-lg row  d-flex flex-column mx-xl-3 mx-lg-3">
                              <label for="name">Enter Name</label>
                              <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter name"
                                aria-label="name"
                                id="name"
                              />
                              <label for="email">Enter Email</label>
                              <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="for e.g abc@xyz.com"
                                aria-label="email"
                                id="email"
                              />
                              {patient ? (
                                <>
                                  <label for="disease">Enter Disease</label>
                                  <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Disease"
                                    aria-label="disease"
                                    id="disease"
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
                                    id="specification"
                                  />
                                </>
                              ) : null}

                              <label for="phnum">Enter Phone Number</label>
                              <input
                                type="tel"
                                className="form-control mb-3"
                                placeholder="XXXX-XXXXXXX"
                                aria-label="phnum"
                                id="phnum"
                              />
                            </div>
                            <div className="col-xl col-lg row  d-flex flex-column mx-xl-3 mx-lg-3">
                              <label for="password">Enter Password</label>
                              <input
                                type="password"
                                className="form-control mb-3"
                                placeholder="Password"
                                aria-label="password"
                                id="password"
                              />
                              <label for="address">Enter Address</label>
                              <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Address"
                                aria-label="address"
                                id="address"
                              />
                              {patient ? (
                                <>
                                  <label for="age">Enter Age</label>
                                  <input
                                    type="number"
                                    className="form-control mb-3"
                                    placeholder="Age"
                                    aria-label="age"
                                    id="age"
                                  />
                                </>
                              ) : null}
                            </div>
                          </div>
                          <button type="submit" className="btn add-button">
                            Add {patient ? "Patient" : null}
                            {doctor ? "Doctor" : null}
                            {lab ? "Lab" : null}
                            {pharmacy ? "Pahrmacy" : null}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
