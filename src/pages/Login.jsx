import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../styles/LoginStyle.scss";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  let navigate = useNavigate();

  const navreset = () => {
    navigate("/pass");
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

        <button type="submit" className="btn login-button">
          Login
        </button>
        <p onClick={navreset}>Forgot password reset it here</p>
      </form>
    </div>
  );
};
export default Login;
