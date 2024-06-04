import axios from "axios";
import "../../assets/css/Auth/Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Signup() {
  const url = import.meta.env.VITE_APP_SERVER_URL;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    setWaiting(true)
    e.preventDefault();
    axios({
      method: "post",
      url: `${url}/api/signup`,
      data: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        name: name,
      },
    })
      .then((res) => {
        if (res.status === 201) {
          setWaiting(false)
          navigate("/Auth")
        }
      })
      .catch((error) => {
        setWaiting(false)
        setError(error?.response?.data?.message)
        setTimeout(() => {
          setError("");
        }, 3000)
      });
  };
  return (
    <div className="Signup-page-main-div">
      {error && <div className="Error">{error}</div>}
      <div
        className="signup-page-insider-div"
        data-aos="fade-in"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
      >
        <div className="signup-text">
          <span>
            Sign up and create a meeting, or join an existing meeting. If you{" "}
            {"don't"} have an account, please sign up to get started.
          </span>
        </div>
        <form onSubmit={handleSignup}>
          <div className="form-div">
            <label>Email</label>
            <br />
            <input required
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="form-div">
            <label>Name</label>
            <br />
            <input required
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="form-div">
            <label>Password</label>
            <br />
            <input required
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="form-div">
            <label>Confirm Password</label>
            <br />
            <input required
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
          <div className="form-button-div">
            <button type="submit" disabled={waiting}>{waiting ? "please wait..." : "Signup"}</button>
          </div>
          <div className="existing-account-or-new">
            <span>
              Already have an account{" "}
              <button
                onClick={() => {
                  navigate("/Auth");
                }}
              >
                Sign in
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
