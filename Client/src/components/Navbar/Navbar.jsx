import { useContext } from 'react';
import '../../assets/css/Navbar/Navbar.css'
import { Progress } from '../../App';
import { useNavigate } from 'react-router-dom';
function Navbar() {
  const navigate = useNavigate();
  const [progress, setProgress] = useContext(Progress);
  return (
    <div className="navbar-main-div">
      <div className="meeting-hub-heading">
        <button onClick={() => {
          setProgress(75);
          setTimeout(() => {
            setProgress(100);
            navigate("/");
          }, 600);
        }}>MeetingHub<i className='fa fa-video-camera' style={{ color: "#0a7800", fontSize: "13px" }}></i></button>
      </div>
      <div className='meeting-hub-date'>
        <span style={{ fontWeight: "500", color: "#680909" }}>{new Date().toDateString()}</span>
      </div>
    </div>
  )
}

export default Navbar
