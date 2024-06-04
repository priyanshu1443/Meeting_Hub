import { useNavigate } from "react-router-dom";
import "../../assets/css/Home/HomePage.css";
import { useContext,} from "react";
import { Progress } from "../../App";
// import image from "../../assets/img/Meeting.gif";

function HomePage() {
  const navigate = useNavigate();
  const user  = sessionStorage.getItem("user_id") || "";
  const [progress, setProgress] = useContext(Progress);

  return (
    <>
      <div className="home-main-div">
        <div
          className="home-insider-main-div"
          data-aos="fade-right"
          data-aos-duration="8000"
          data-aos-easing="ease-in-out"
        >
          <div className="Welcome-heading">
            <span>
              Welcome to our Meeting Hub! Let{"'"}s streamline our discussions
              and productivity by scheduling a meeting right here.
            </span>
          </div>
          <div className="create-meeting-div">
            <button
              onClick={() => {
                setProgress(75);
                setTimeout(() => {
                  setProgress(100);
                  user ? navigate("/CreateMeeting") : navigate("/Auth");
                }, 600);
              }}
            >
              Create Meeting
            </button>
            <button
              onClick={() => {
                setProgress(75);
                setTimeout(() => {
                  setProgress(100);
                  user ? navigate("/JoinMeeting") : navigate("/Auth");
                }, 600);
              }}
            >
              Join Meeting
            </button>
            <p data-aos-duration="8000" data-aos-easing="ease-in-out">
              Unlock seamless, secure video conferencing accessible from any
              device, ensuring effortless collaboration for all.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
