import React from "react";
import "../styles/UserdisplayStyle.scss";
import axios from "axios";

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
              <button type="button" className="btn button me-2">
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
    </div>
  );
};

export default Userdisplay;
