import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/Home/MainMeetingPage.css";
import { My_app } from "../PeerConnection/peer2";

import {
  faHand,
  faMicrophoneAltSlash,
  faVideo,
  faVideoSlash,
  faMicrophone,
  faUserAlt,
  faWindowClose,
  faDesktop,
  faHandFist,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useLayoutEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faUser } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

function MainMeetingPage() {
  let { meetingID } = useParams();
  const user = sessionStorage.getItem("user_id") || "";
  const user_id = sessionStorage.getItem("user_id");
  const user_name = JSON.parse(sessionStorage.getItem("name"));
  const accessToken = JSON.parse(sessionStorage.getItem("Auth_Token"));
  const url = import.meta.env.VITE_APP_SERVER_URL;
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const [handcolor, setHandColor] = useState(false);
  const [participantsection, setParticipantSection] = useState(false);
  const [openMeet, setOpenMeet] = useState(false);
  const [main_screen, setMainScreen] = useState(true);
  const [screen_width, setScreenWidth] = useState(1200);



  const containsSpecialCharacters = (value) => {

    const pattern = /[^a-zA-Z0-9\s]/g;
    return pattern.test(value);
  };

  const handleJoinMeeting = async () => {
    if (!user) {
      navigate("/Auth")
    } else if (meetingID && !containsSpecialCharacters(meetingID)) {
      await axios({
        method: "post",
        url: `${url}/api/joinmeeting`,
        data: { meetingID: meetingID, user_id: user_id },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {

          if (response.status === 200) {
            sessionStorage.setItem("meetingName", response.data.name);
            sessionStorage.setItem("Host_id", response.data.create_by);
            setData(response.data.name);
            setOpenMeet(true);
            My_app._init(user_name, meetingID, user_id);
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            navigate("/Auth");
          } else {
            alert("Meeting not found");
            navigate("/JoinMeeting");
          }
        });
    } else {
      alert("meeting id required");
      navigate("/JoinMeeting");
    }
  };
  useLayoutEffect(() => {
    if (user) {
      handleJoinMeeting();
    } else {
      navigate('/Auth')
      location.reload()
    }
  }, []);

  useEffect(() => {
    if (openMeet) {
      setTimeout(() => {
        var boxes = document.querySelectorAll(".othersUser");
        boxes.forEach(function (box) {
          box.addEventListener("click", function (event) {
            event.stopPropagation();
            if (this.classList.contains("enlarged")) {
              boxes.forEach(function (otherBox) {
                otherBox.classList.remove("hidden");
              });
              this.classList.remove("enlarged");
            } else {
              this.classList.add("enlarged");
              boxes.forEach(function (otherBox) {
                if (otherBox !== box) {
                  otherBox.classList.add("hidden");
                }
              });
            }
          });
        });
      }, 1000);
    }
  }, [openMeet]);

  useEffect(() => {

  }, [])



  return (
    <>
      <div id="main" className="main-meeting-div" style={openMeet ? { display: "flex" } : { display: "none" }}>
        <div className="insider-meeting-main-div">
          <div className="meeting-name">
            <h3>Meeting Name : {data}</h3>
          </div>
          <div id="raise-hand-text">
            <span id="raise-hand-h2"></span>
          </div>
          <div className="main-screen-div">
            <div className="main-video-div" id="users" style={screen_width < 550 ? main_screen ? { display: "flex" } : { display: "none" } : {}}
            >

              <div id="usertemplate" className="othersUser">
                <h2 id="me" />
                <video autoPlay id="localVidoPlayer" muted />
              </div>
              <div id="other_Template" className="othersUser">
                <h2></h2>
                <video autoPlay />
                <span className="hand-raise">
                  <FontAwesomeIcon icon={faHand} />
                </span>
              </div>
            </div>
            <div className="main-participant-div text-center text-white " style={screen_width < 550 ? main_screen ? { display: "none" } : { display: "block" } : {}}>

              <div
                className="chatBox"
                style={
                  participantsection
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                <div className="message-box" id="messages">
                  <div className="today-date">
                    <p>All messages will be visible to everyone in the chat.</p>

                    <span style={{ fontWeight: "500", color: "#680909" }}>
                      {new Date().toDateString()}
                    </span>
                  </div>
                </div>
                <div className="message-input-div">
                  <input
                    id="chat_input"
                    className="message-input-field"
                    type="text"
                    placeholder="write here..."
                  />
                  <button id="chat_send">Send</button>
                </div>
              </div>
              <div
                id="chat_participant_area"
                style={
                  participantsection
                    ? { display: "none" }
                    : { display: "block" }
                }
              >
                <div id="chat_participant_area_header">
                  <h4>
                    Participants<span id="participant_count">(1)</span>
                  </h4>
                </div>

                <div id="participant_area">
                  <div style={{ margin: "10px" }}>
                    <span>You</span>
                  </div>
                </div>
              </div>{" "}
            </div>
          </div>
          <div className="meeting-controls">
            <div id="mic_mute_unmute" className="controls-icon-div">
              <FontAwesomeIcon icon={faMicrophoneAltSlash} />
            </div>
            <div id="vidoe_cam_on_off" className="controls-icon-div">
              <FontAwesomeIcon icon={faVideoSlash} />
            </div>
            <div id="screen_share_on_off" className="controls-icon-div">
              <FontAwesomeIcon icon={faDesktop} />
            </div>
            <div
              id="diconnect-user-meeting"
              onClick={() => {
                navigate("/");
              }}
              className="controls-icon-div"
            >
              <i
                className="fa fa-phone"
                style={{ transform: "rotate(135deg)" }}
              ></i>
            </div>
            <div className="controls-icon-div">
              <div
                id="raiseUserHand"
                onClick={() => {
                  setHandColor(!handcolor);
                }}
              >
                <FontAwesomeIcon
                  icon={faHand}
                  style={handcolor ? { color: "#00FF13" } : {}}
                />
              </div>
            </div>

            <div
              id="message-icon"
              onClick={() => {
                setScreenWidth(window.innerWidth)
                setMainScreen(!main_screen)
                setParticipantSection(true);
              }}
              className="controls-icon-div"
            >

              <div className="new-message" id="raise-message-notify"></div>
              <div id="insider-message-icon">
                <FontAwesomeIcon icon={faMessage} />
              </div>
            </div>
            <div
              id="user-icon"
              onClick={() => {
                setScreenWidth(window.innerWidth)
                setMainScreen(!main_screen)
                setParticipantSection(false);
              }}
              className="controls-icon-div"
            >
              <FontAwesomeIcon icon={faUser} />
            </div>
          </div>
        </div>
      </div>

      <div className="main-meeting-validation-div" style={openMeet ? { display: "none" } : { display: "flex" }}>
        <div className="loader"></div>
      </div>
    </>
  );
}

export default MainMeetingPage;
