import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../styles/LoginStyle.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Login = (props) => {
  let navigate = useNavigate();

  const navreset = () => {
    navigate("/pass", {
      state: {
        type: props.heading,
      },
    });
  };
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

  const signIn = async () => {
    let user;
    try {
      let type = props.heading;
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      console.log(type);
      const response = await axios.post(
        `http://localhost:5000/api/${type}/login`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            email: email,
            password: password,
          },
        }
      );
      user = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      if (props.heading == "Doctors") {
        if (user.length != 0) {
          navtodoc(user);
        }
      }
      if (props.heading == "Patients") {
        if (user.length != 0) {
          navtopat(user);
        }
      }
      if (props.heading == "Labs") {
        if (user.length != 0) {
          navtolab(user);
        }
      }
      if (props.heading == "Pharmacies") {
        if (user.length != 0) {
          navtopharm(user);
        }
      }
      if (props.heading == "Admin") {
        if (user.length != 0) {
          navtoadmin(user);
        }
      }
    }
  };
  return (
    <div id="login-page">
      <form className="d-flex flex-column align-items-center justify-content-evenly">
        <h1>{props.heading} Login</h1>
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
        <p onClick={navreset}>Forgot password reset it here</p>
        <button type="button" className="btn login-button" onClick={signIn}>
          Login
        </button>
      </form>
    </div>
  );
};
export default Login;
