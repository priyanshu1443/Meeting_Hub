import "../../assets/css/Auth/Login.css";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_APP_SERVER_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [count, setCount] = useState(3);
  const [waiting, setWaiting] = useState(false);

  const handlelogin = (e) => {
    setWaiting(true)
    e.preventDefault();
    axios({
      method: "post",
      url: `${url}/api/login`,
      data: { email: email, password: password },
    })
      .then((res) => {
        console.log(res)
        sessionStorage.setItem(
          "Auth_Token",
          JSON.stringify(res.data.data.token)
        );
        sessionStorage.setItem(
          "user_id",
          JSON.stringify(res.data.data.user_id)
        );
        sessionStorage.setItem("name", JSON.stringify(res.data.data.name));
        setWaiting(false)
        navigate("/");
      })
      .catch((error) => {
        console.log(error)
        setWaiting(false)
        setError(error?.response?.data?.message);
        let new_count = 3;
        const intervalId = setInterval(() => {
          new_count = new_count - 1;
          if (count > -1) {
            setCount(new_count);
          }
        }, 1000);
        setTimeout(() => {
          clearInterval(intervalId);
          setCount(3);
          setError("");
        }, 3000);
      });
  };

  const sendData = async (decode) => {
    await axios({
      method: "post",
      url: `${url}/api/googleLogin`,
      data: { email: decode.email, picture: decode.picture, name: decode.name },
      withCredentials: true,
    })
      .then((res) => {
        sessionStorage.setItem(
          "Auth_Token",
          JSON.stringify(res.data.data.token)
        );
        sessionStorage.setItem(
          "user_id",
          JSON.stringify(res.data.data.user_id)
        );
        sessionStorage.setItem("name", JSON.stringify(res.data.data.name));
        navigate("/");
      })
      .catch((error) => {
        setError(error.response.data.message);
        let new_count = 3;
        const intervalId = setInterval(() => {
          new_count = new_count - 1;
          if (count > -1) {
            setCount(new_count);
          }
        }, 1000);
        setTimeout(() => {
          clearInterval(intervalId);
          setCount(3);
          setError("");
        }, 3000);
      });
  };
  return (
    <div className="login-page-main-div">
      {error && (
        <div className="Error">
          {error}
        </div>
      )}
      <div
        className="login-page-insider-div"
        data-aos="fade-in"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
      >
        <div className="login-text">
          <span>
            Sign in to host or join a meeting. New users, please register to
            get started.
          </span>
        </div>
        <form onSubmit={handlelogin} className="login-form">
          <div className="form-div">
            <label>Email</label>
            <br />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
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
          <div className="form-button-div">
            <button type="submit" disabled={waiting}>{waiting ? "please wait..." : "Sign in"}</button>
          </div>

          <div className="google-button-div">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(credentialResponse?.credential);
                sendData(decoded);
              }}
              onError={() => {
                setError("Login Failed");
                let new_count = 3;
                const intervalId = setInterval(() => {
                  new_count = new_count - 1;
                  if (count > -1) {
                    setCount(new_count);
                  }
                }, 1000);
                setTimeout(() => {
                  clearInterval(intervalId);
                  setCount(3);
                  setError("");
                }, 3000);
              }}
            />
          </div>
          <div className="existing-account-or-new">
            <span>
              {"don't"} have an account{" "}
              <button
                onClick={() => {
                  navigate("/Signup");
                }}
              >
                Signup
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
