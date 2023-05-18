import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../styles/passwordStyle.scss";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Password = () => {
  let location = useLocation();
  let navigate = useNavigate();

  const navtodoc = (user) => {
    navigate("/doc", {
      state: {
        user: user,
      },
    });
  };

  const navtopat = (user) => {
    navigate("/pat", {
      state: {
        user: user,
      },
    });
  };

  const navtolab = (user) => {
    navigate("/lab", {
      state: {
        user: user,
      },
    });
  };
  const navtopharm = (user) => {
    navigate("/pharm", {
      state: {
        user: user,
      },
    });
  };
  const navtoadmin = (user) => {
    navigate("/register", {
      state: {
        user: user,
      },
    });
  };

  const changepass = async () => {
    let user;
    try {
      let type = location.state.type;
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      let password2 = document.getElementById("password2").value;
      console.log(type);
      const response = await axios.post(
        `http://localhost:5000/api/${type}/changePass`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            email: email,
            password: password,
            newpass: password2,
          },
        }
      );
      user = response.data;
      console.log(user);
    } catch (error) {
      console.error(error);
    } finally {
      if (location.state.type == "Doctors") {
        navtodoc(user);
      }
      if (location.state.type == "Patients") {
        navtopat(user);
      }
      if (location.state.type == "Labs") {
        navtolab(user);
      }
      if (location.state.type == "Pharmacies") {
        navtopharm(user);
      }
      if (location.state.type == "Admin") {
        navtoadmin(user);
      }
    }
  };

  useEffect(() => {
    console.log(location.state.type);
  }, []);
  return (
    <div id="password-page">
      <form className="d-flex flex-column align-items-center justify-content-evenly">
        <h1>Reset Password</h1>
        <div className="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            id="email"
            name="email"
          />
        </div>
        <div className="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            id="password"
            name="password"
          />
        </div>
        <div className="form-group">
          <label for="exampleInputPassword2">Enter New Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            id="password2"
            name="password2"
          />
        </div>

        <button type="button" className="btn login-button" onClick={changepass}>
          Reset
        </button>
      </form>
    </div>
  );
};
export default Password;
