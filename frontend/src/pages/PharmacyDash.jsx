import React from "react";
import "../styles/pharmacydashstyle.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../node_modules/bootstrap/js/dist/modal.js";
import { useNavigate } from "react-router-dom";

const PharmacyDash = () => {
  const navigate = useNavigate();
  const navtohome = () => {
    navigate("/");
  };
  const location = useLocation();
  const [patients, setpatients] = useState([]);
  const [medicine, setmedicine] = useState([]);

  const [reset, setreset] = useState(false);
  const fetchpatients = async () => {
    let temp;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/Admin/getAllPatients`,
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
      setpatients(temp);
    }
  };

  const fetchmedicines = async () => {
    let temp;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Pharmacies/getAllMedicine`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            PharmId: location.state.user._id,
          },
        }
      );
      temp = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      setmedicine(temp);
    }
  };
  const fetchprescription = async (patientId, type) => {
    let name;
    let quant;
    let id;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Pharmacies/getClientPrescription`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            patientId: patientId,
          },
        }
      );
      id = response.data.Prescription[0]._id;
      name = response.data.Prescription[0].Medicine;
      quant = response.data.Prescription[0].Quantity;

      //   console.log(temp);
    } catch (error) {
      console.error(error);
    } finally {
      if (type == "viewonly") {
        if ((name != undefined) & (quant != undefined)) {
          document.getElementById("precname").innerHTML = `${name}-${quant}`;
        } else {
          document.getElementById("precname").innerHTML =
            "No prescription added";
        }
      }
      if (type == "deliver") {
        delivermedicine(name, quant, id);
      }
    }
  };
  const addmedicine = async (Med, quantity) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Pharmacies/addMedicine`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            PharmId: location.state.user._id,
            Med: Med,
            quantity: quantity,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setreset(true);
    }
  };
  const delivermedicine = async (Med, quantity, PresId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Pharmacies/deliverMedicine`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            PharmId: location.state.user._id,
            Med: Med,
            quantity: quantity,
            PresId: PresId,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setreset(true);
    }
  };
  const medadder = () => {
    let quant = document.getElementById("quantity").value;
    let medname = document.getElementById("medname").value;
    console.log(medname, quant);
    if (quant != null && quant != undefined && quant != 0) {
      addmedicine(medname, quant);
    }
  };
  useEffect(() => {
    fetchpatients();
    fetchmedicines();
  }, []);
  useEffect(() => {
    if (reset) {
      fetchpatients();
      fetchmedicines();
      setreset(false);
    }
  }, [reset]);

  const dyntext = (id) => {
    fetchprescription(id, "viewonly");
  };
  const deliver = (id) => {
    fetchprescription(id, "deliver");
  };
  return (
    <div id="pharm-dash">
      <div className="container-fluid">
        <div className="row">
          <div id="side-nav" className="col-xl-2 col-lg-2 col-3 px-0 pt-2">
            <div className="nav d-flex flex-column align-items-center   px-0">
              <h1 className="mb-5" onClick={navtohome}>
                Curify
              </h1>
              <div className="navigate d-flex flex-column align-items-start justify-content-evenly ">
                <div className="navlink ps-xl-3 ps-lg-3 ps-1">
                  <h4> Dashboard </h4>
                </div>
              </div>
            </div>
          </div>
          <div
            id="main-content"
            className=" py-4 col-xl-10 col-lg-10 col-9 d-flex flex-column align-items-center justify-content-center"
          >
            <h3 className="mt-2">Patients</h3>
            {Object.keys(patients).map((key) => (
              <div className=" user-box d-flex flex-row align-items-center justify-content-between py-2">
                <h3 className="px-2">{patients[key].name}</h3>
                <div>
                  <button
                    type="button"
                    class="btn button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => dyntext(patients[key]._id)}
                  >
                    View prescription
                  </button>
                  <button
                    type="button"
                    class="btn button ms-3"
                    onClick={() => deliver(patients[key]._id)}
                  >
                    Deliver
                  </button>
                </div>
              </div>
            ))}

            <div
              class="modal "
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                      Prescription
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <h4 id="precname">Medicine name - Quantity</h4>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="mt-2">Medicines</h3>
            <button
              type="button"
              class="btn button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal2"
            >
              Add medicine
            </button>
            {Object.keys(medicine).map((key) => (
              <>
                {medicine[key] > 0 ? (
                  <div className=" user-box d-flex flex-row align-items-center justify-content-between py-2">
                    <h3 className="px-2">{key}</h3>
                    <h3 className="px-2">{medicine[key]}</h3>
                  </div>
                ) : null}
              </>
            ))}

            <div
              class="modal "
              id="exampleModal2"
              tabindex="-1"
              aria-labelledby="exampleModalLabel2"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel2">
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
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={medadder}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDash;
