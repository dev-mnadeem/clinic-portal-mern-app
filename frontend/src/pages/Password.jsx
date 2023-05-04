import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../styles/passwordStyle.scss";
import { useNavigate } from "react-router-dom";

const Password = () => {
  let navigate = useNavigate();
  const navtoregister = () => {
    navigate("/register");
  };
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
          <label for="exampleInputPassword2">Re-Enter Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            id="password2"
            name="password2"
          />
        </div>

        <button type="submit" className="btn login-button">
          Reset
        </button>
        <p onClick={navtoregister}>Create new User</p>
      </form>
    </div>
  );
};
export default Password;
