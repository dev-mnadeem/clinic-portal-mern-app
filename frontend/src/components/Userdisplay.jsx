import React from "react";
import "../styles/UserdisplayStyle.scss";
import axios from "axios";
import "../../node_modules/bootstrap/js/dist/modal.js";

const Userdisplay = (props) => {
  const Delete = async () => {
    try {
      let type = props.type;
      let id = props.user._id;
      console.log(type, id);
      const response = await axios.post(
        `http://localhost:5000/api/Admin/del${type}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            userId: id,
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      props.reset(true);
    }
  };

  const Update = async (
    name,
    email,
    disease,
    specification,
    phone,
    password,
    address,
    age
  ) => {
    try {
      let type = props.type;

      const response = await axios.post(
        `http://localhost:5000/api/Admin/update${type}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            name: name,
            email: email,
            disease: disease,
            specification: specification,
            phone: phone,
            password: password,
            address: address,
            age: age,
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      props.reset(true);
    }
  };

  const getdata = () => {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    let disease;
    let specification;
    let phnum = document.getElementById("phnum").value;
    let password = document.getElementById("password").value;
    let address = document.getElementById("address").value;
    let age;

    if (props.type == "Patient") {
      disease = document.getElementById("disease").value;

      age = document.getElementById("age").value;
    }
    if (props.type == "Doctor" || props.type == "Lab") {
      specification = document.getElementById("specification").value;
    }
    Update(name, email, disease, specification, phnum, password, address, age);
  };
  const book = async () => {
    try {
      let id = props.user._id;
      console.log(id);

      const response = await axios.post(
        `http://localhost:5000/api/Doctors/acceptAppointments`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            AppID: id,
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      props.reset(true);
    }
  };

  const reject = async () => {
    try {
      let id = props.user._id;
      console.log(id);

      const response = await axios.post(
        `http://localhost:5000/api/Doctors/rejectAppointments`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            AppID: id,
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      props.reset(true);
    }
  };

  return (
    <div className="container">
      <div className=" user-box d-flex flex-row align-items-center justify-content-between mx-5 py-2">
        <h3 className="px-2">
          {props.usertype == "admin" ? props.user.name : null}
          {props.usertype == "doctor" ? props.user.patientName : null}
        </h3>

        <div className="d-flex flex-row align-items-center justify-content-evenly">
          {props.usertype == "admin" ? (
            <>
              <button
                type="button"
                className="btn button me-2"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal4"
              >
                Edit
              </button>

              <button type="button" className="btn button" onClick={Delete}>
                Delete
              </button>
            </>
          ) : null}
          {props.usertype == "doctor" ? (
            <>
              <button type="button" className="btn button me-2" onClick={book}>
                Book Apointment
              </button>

              <button type="button" className="btn button" onClick={reject}>
                Reject Appointment
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div
        class="modal "
        id="exampleModal4"
        tabindex="-1"
        aria-labelledby="exampleModalLabel4"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel4">
                Edit {props.type}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
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
                    {props.type == "Patient" ? (
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
                    {props.type == "Doctor" || props.type == "Lab" ? (
                      <>
                        <label for="specification">Enter Specification</label>
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
                    {props.type == "Patient" ? (
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
                  Submit
                </button>
              </form>
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
    </div>
  );
};

export default Userdisplay;
