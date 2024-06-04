import axios from "axios";
import "../../assets/css/Home/CreateMeeting.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function CreateMeetingPage() {
  const url = import.meta.env.VITE_APP_SERVER_URL;
  const url_app = import.meta.env.VITE_APP_URL
  const user = sessionStorage.getItem("user_id");
  const accessToken = JSON.parse(sessionStorage.getItem("Auth_Token"));
  const navigate = useNavigate();
  const [meetingName, setMeetingName] = useState("");
  const [meeting_created, setMeetingCreated] = useState(false);
  const [meetingID, setMeetingId] = useState("");

  const containsSpecialCharacters = (value) => {

    const pattern = /[^a-zA-Z0-9\s]/g;
    return pattern.test(value);
  };
  const handleMeetingCreation = async () => {
    await axios({
      method: "post",
      url: `${url}/api/createmeeting`,
      data: { meetingName: meetingName, user_id: user },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        setMeetingId(response.data.meetingId);
        setMeetingName(response.data.meetingName);
        setMeetingCreated(true);
      })
      .catch((error) => {
        console.log(error)
      });
  };
  return (
    <div className="createmeeting-main-div">
      <div
        className="createmeeting-insider-div"
        data-aos="fade-up"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
      >
        <div className="meeting-image"></div>
        <div className="meeting-fields">
          <p>
            Let{"'"}s craft our virtual gathering with Meeting Hub, ensuring a
            seamless experience for all attendees.
          </p>
          {meeting_created ? (
            <>
              <span className="meeting-details">
                meeting name : {meetingName}
              </span>

              <span className="meeting-details">Code : {meetingID}</span>

              <span className="meeting-details">
                Link :{" "}
                <span
                  className="meeting-link"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(`${url_app}/Meet/${meetingID}`)
                      .then(function () {
                        document.getElementById("copied-link-div").style.display = "inline";
                        setTimeout(() => {
                          document.getElementById("copied-link-div").style.display = "none";
                        }, 2000)
                      })
                      .catch(function (error) {
                        console.log(error)
                      });
                  }}
                >
                  {url_app}/Meet/{meetingID}
                </span>
                <span id="copied-link-div">copied !</span>
              </span>

              <button
                onClick={() => {
                  navigate("/JoinMeeting");
                }}
              >
                Go to meeting
              </button>
              <br />
            </>
          ) : (
            <>
              <input
                type="text"
                value={meetingName}
                onChange={(e) => {
                  if (!containsSpecialCharacters(e.target.value)) {
                    setMeetingName(e.target.value);
                  }
                  else {
                    alert("Invalid")
                  }
                }}
                placeholder="Enter meeting name"
              />
              <br />
              <button onClick={handleMeetingCreation}>create</button>
              <br />
            </>
          )}

          <span className="create-meeting-text">
            Share the key to connect effortlessly – send the link or code to
            your desired attendees and gather for a smooth, secure meeting
            experience.
          </span>
        </div>
      </div>
    </div>
  );
}

export default CreateMeetingPage;
