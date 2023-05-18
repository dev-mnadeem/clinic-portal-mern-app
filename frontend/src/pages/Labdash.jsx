import React from "react";
import "../styles/Labdashstyle.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Labdash = () => {
  const navigate = useNavigate();
  const navtohome = () => {
    navigate("/");
  };
  const location = useLocation();
  const [labs, setlabs] = useState([]);
  const [patients, setpatients] = useState([]);
  const [dash, setdash] = useState(true);
  const [reset, setresest] = useState(false);
  const fetch = async () => {
    let temp;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/Labs/getAllReportsLab`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            LabId: location.state.user._id,
          },
        }
      );
      temp = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      setlabs(temp);
    }
  };

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
  useEffect(() => {
    fetch();
    fetchpatients();
  }, []);
  useEffect(() => {
    if (reset) {
      fetch();
      fetchpatients();
      setresest(false);
    }
  }, [reset]);

  const [id, setid] = useState();
  const addreport = (pat) => {
    setdash(false);
    setid(pat._id);
  };

  const getdata = () => {
    let Type = document.getElementById("type").value;

    addrep(Type);
  };

  const addrep = async (Type) => {
    try {
      let temp2 = location.state.user._id;

      const response = await axios.post(
        `http://localhost:5000/api/Labs/addReports`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            LabId: temp2,
            patientId: id,
            Type: Type,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setdash(true);
      setresest(true);
    }
  };

  return (
    <div id="lab-dash">
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
                  onClick={() => setdash(true)}
                >
                  <h4> Dashboard </h4>
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
                {" "}
                <h3>Reports</h3>
                {Object.keys(labs).map((key) => (
                  <div className=" user-box d-flex flex-row align-items-center justify-content-between py-2">
                    <h3 className="px-2">{labs[key].Type}</h3>

                    <h3 className="px-2">{labs[key].progress}</h3>
                  </div>
                ))}
                <h3 className="mt-2">Patients</h3>
                {Object.keys(patients).map((key) => (
                  <div className=" user-box d-flex flex-row align-items-center justify-content-between py-2">
                    <h3 className="px-2">{patients[key].name}</h3>

                    <button
                      type="button"
                      className="btn button mt-3"
                      onClick={() => addreport(patients[key])}
                    >
                      Add report
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <form className=" d-flex flex-column align-items-center">
                <div className="row register-side">
                  <div className="col-xl col-lg row  d-flex flex-column mx-xl-3 mx-lg-3">
                    <label for="type">Type</label>
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Enter Type"
                      aria-label="type"
                      id="type"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn button mt-3"
                  onClick={getdata}
                >
                  Add Report
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labdash;
