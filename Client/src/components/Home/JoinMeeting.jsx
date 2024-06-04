import "../../assets/css/Home/JoinMeeting.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function JoinMeeting() {
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState("");

  const containsSpecialCharacters = (value) => {
    const pattern = /[^a-zA-Z0-9\s]/g;
    return pattern.test(value);
  };

  const handleJoinMeeting = () => {
    const trimmedMeetingId = meetingId.trim();
    if (trimmedMeetingId) {
      navigate(`/Meet/${trimmedMeetingId}`);
    } else {
      alert("Meeting ID is required");
    }
  };

  return (
    <div className="joinmeeting-main-div">
      <div
        className="joinmeeting-insider-div"
        data-aos="fade-up"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
      >
        <div className="join-meeting-image"></div>
        <div className="join-meeting-fields">
          <p>
            Please enter the provided code to access the Meeting Hub and join
            our session promptly.
          </p>

          <input
            type="text"
            value={meetingId}
            onChange={(e) => {
              if (!containsSpecialCharacters(e.target.value)) {
                setMeetingId(e.target.value);
              } else {
                alert("Invalid");
              }
            }}
            placeholder="Enter Code"
          />
          <br />
          <button onClick={handleJoinMeeting}>Join Now</button>
        </div>
      </div>
    </div>
  );
}

export default JoinMeeting;
