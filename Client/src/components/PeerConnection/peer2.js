import io from "socket.io-client";
const url = import.meta.env.VITE_APP_SERVER_URL

var App_process = (function () {
  var peers_connection_ids = [];
  var peers_connection = [];
  var remote_vid_stream = [];
  var remote_aud_stream = [];
  var local_div

  var serverProcess;
  var my_connection_id;
  var mediaSenders = [];
  var isVideoOn = false;
  var isAudioOn = false;
  var isScreenShare = false;
  var localstream;
  var streamStoped;
  var video_And_Screen;

  async function _init(SDP_function, my_connid, stopedStream, videoAndScreen) {
    streamStoped = stopedStream;
    serverProcess = SDP_function;
    my_connection_id = my_connid;
    video_And_Screen = videoAndScreen;
    eventProcess();
    local_div = document.getElementById("localVidoPlayer");
  }

  function stopVideoTrack() {
    if (localstream) {
      let tracks = localstream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    localstream = null;
  }

  function eventProcess() {
    document.getElementById("vidoe_cam_on_off").onclick = async function () {
      if (isScreenShare) {
        isScreenShare = false;
      }
      if (isAudioOn && isVideoOn) {
        stopVideoTrack()
        localstream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        isVideoOn = false;
        document.getElementById("vidoe_cam_on_off").innerHTML =
          '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="video-slash" class="svg-inline--fa fa-video-slash " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-86.4-67.7 13.8 9.2c9.8 6.5 22.4 7.2 32.9 1.6s16.9-16.4 16.9-28.2V128c0-11.8-6.5-22.6-16.9-28.2s-23-5-32.9 1.6l-96 64L448 174.9V192 320v5.8l-32-25.1V128c0-35.3-28.7-64-64-64H113.9L38.8 5.1zM407 416.7L32.3 121.5c-.2 2.1-.3 4.3-.3 6.5V384c0 35.3 28.7 64 64 64H352c23.4 0 43.9-12.6 55-31.3z"></path></svg>';
      } else if (isVideoOn) {
        if (localstream) {
          stopVideoTrack()
        }
        document.getElementById("vidoe_cam_on_off").innerHTML =
          '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="video-slash" class="svg-inline--fa fa-video-slash " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-86.4-67.7 13.8 9.2c9.8 6.5 22.4 7.2 32.9 1.6s16.9-16.4 16.9-28.2V128c0-11.8-6.5-22.6-16.9-28.2s-23-5-32.9 1.6l-96 64L448 174.9V192 320v5.8l-32-25.1V128c0-35.3-28.7-64-64-64H113.9L38.8 5.1zM407 416.7L32.3 121.5c-.2 2.1-.3 4.3-.3 6.5V384c0 35.3 28.7 64 64 64H352c23.4 0 43.9-12.6 55-31.3z"></path></svg>';
        stopSharingStreams();
        return;
      } else if (isAudioOn) {
        localstream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        isVideoOn = true;
        document.getElementById("vidoe_cam_on_off").innerHTML =
          '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="video" class="svg-inline--fa fa-video " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"></path></svg>';
      } else {
        localstream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        isVideoOn = true;
        document.getElementById("vidoe_cam_on_off").innerHTML =
          '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="video" class="svg-inline--fa fa-video " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"></path></svg>';
      }
      document.getElementById("localVidoPlayer").srcObject = localstream;
      document.getElementById("localVidoPlayer").style.transform = "scaleX(-1)";
      updateMediaSenders(localstream, mediaSenders);
    };
    document.getElementById("mic_mute_unmute").onclick = async function () {
      if (isScreenShare) {
        isScreenShare = false;
      }
      if (isVideoOn && isAudioOn) {
        localstream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        isAudioOn = false;
        localstream.getTracks().forEach((track) => {
          if (track.kind == "audio") {
            track.stop();
          }
        });
        document.getElementById("mic_mute_unmute").innerHTML =
          '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="microphone-lines-slash" class="svg-inline--fa fa-microphone-lines-slash " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v24 16c0 21.2-5.1 41.1-14.2 58.7L416 300.8V256H358.9l-34.5-27c2.9-3.1 7-5 11.6-5h80V192H336c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V128H336c-8.8 0-16-7.2-16-16s7.2-16 16-16h80c0-53-43-96-96-96s-96 43-96 96v54.3L38.8 5.1zM358.2 378.2C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128v-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6v40c0 89.1 66.2 162.7 152 174.4V464H248c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H344V430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9z"></path></svg>';
      } else if (isAudioOn) {
        if (localstream) {
          let tracks = localstream.getTracks();
          tracks.forEach((track) => {
            if (track.kind == "audio") {
              track.stop();
            }
          });
        }
        document.getElementById("mic_mute_unmute").innerHTML =
          '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="microphone-lines-slash" class="svg-inline--fa fa-microphone-lines-slash " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v24 16c0 21.2-5.1 41.1-14.2 58.7L416 300.8V256H358.9l-34.5-27c2.9-3.1 7-5 11.6-5h80V192H336c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V128H336c-8.8 0-16-7.2-16-16s7.2-16 16-16h80c0-53-43-96-96-96s-96 43-96 96v54.3L38.8 5.1zM358.2 378.2C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128v-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6v40c0 89.1 66.2 162.7 152 174.4V464H248c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H344V430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9z"></path></svg>';
        stopSharingStreams();
        return;
      } else if (isVideoOn) {
        localstream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        isAudioOn = true;
        document.getElementById("mic_mute_unmute").innerHTML =
          '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="microphone" class="svg-inline--fa fa-microphone " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"></path></svg>';
      } else {
        localstream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        isAudioOn = true;
        document.getElementById("mic_mute_unmute").innerHTML =
          '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="microphone" class="svg-inline--fa fa-microphone " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"></path></svg>';
      }
      document.getElementById("localVidoPlayer").srcObject = localstream;
      updateMediaSenders(localstream, mediaSenders);
    };
    document.getElementById("screen_share_on_off").onclick = async function () {
      if (isScreenShare) {
        if (localstream) {
          let tracks = localstream.getTracks();
          tracks.forEach((track) => track.stop());
        }

        isScreenShare = false;
        stopSharingStreams();
        return;
      } else {
        var screenShareStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        if (screenShareStream) {
          isScreenShare = true;
          isAudioOn = false;
          isVideoOn = false;
          localstream = screenShareStream;
          document.getElementById("localVidoPlayer").style.transform = "scaleX(1)";
          document.getElementById("screen_share_on_off").innerHTML =
            '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="rectangle-xmark" class="svg-inline--fa fa-rectangle-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"></path></svg>';
          document.getElementById("vidoe_cam_on_off").innerHTML =
            '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="video-slash" class="svg-inline--fa fa-video-slash " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-86.4-67.7 13.8 9.2c9.8 6.5 22.4 7.2 32.9 1.6s16.9-16.4 16.9-28.2V128c0-11.8-6.5-22.6-16.9-28.2s-23-5-32.9 1.6l-96 64L448 174.9V192 320v5.8l-32-25.1V128c0-35.3-28.7-64-64-64H113.9L38.8 5.1zM407 416.7L32.3 121.5c-.2 2.1-.3 4.3-.3 6.5V384c0 35.3 28.7 64 64 64H352c23.4 0 43.9-12.6 55-31.3z"></path></svg>';
          document.getElementById("mic_mute_unmute").innerHTML =
            '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="microphone-lines-slash" class="svg-inline--fa fa-microphone-lines-slash " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v24 16c0 21.2-5.1 41.1-14.2 58.7L416 300.8V256H358.9l-34.5-27c2.9-3.1 7-5 11.6-5h80V192H336c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V128H336c-8.8 0-16-7.2-16-16s7.2-16 16-16h80c0-53-43-96-96-96s-96 43-96 96v54.3L38.8 5.1zM358.2 378.2C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128v-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6v40c0 89.1 66.2 162.7 152 174.4V464H248c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H344V430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9z"></path></svg>';
        }
      }
      document.getElementById("localVidoPlayer").srcObject = localstream;
      document.getElementById("localVidoPlayer").style.transform = "none";
      updateMediaSenders(localstream, mediaSenders);
    };
  }
  function stopSharingStreams() {
    localstream = null;
    isVideoOn = false;
    isAudioOn = false;
    isScreenShare = false;
    document.getElementById("localVidoPlayer").srcObject = null;
    document.getElementById("screen_share_on_off").innerHTML =
      '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="desktop" class="svg-inline--fa fa-desktop " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64H240l-10.7 32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H346.7L336 416H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM512 64V288H64V64H512z"></path></svg>';
    removeMediaSenders(mediaSenders);
  }

  function connection_status(connection) {
    if (
      connection &&
      (connection.connectionState == "new" ||
        connection.connectionState == "connecting" ||
        connection.connectionState == "connected")
    ) {
      return true;
    } else {
      return false;
    }
  }

  async function updateMediaSenders(localstream, rtp_senders) {
    if (isVideoOn || isScreenShare) {
      isVideoOn ? video_And_Screen(true) : video_And_Screen(false)
    }
    for (var con_id in peers_connection_ids) {
      if (connection_status(peers_connection[con_id])) {
        localstream.getTracks().forEach((track) => {
          rtp_senders[con_id] = peers_connection[con_id].addTrack(
            track,
            localstream
          );
        });
      }
    }
  }

  function removeMediaSenders(rtp_senders) {
    for (var con_id in peers_connection_ids) {
      if (rtp_senders[con_id] && connection_status(peers_connection[con_id])) {
        peers_connection[con_id].removeTrack(rtp_senders[con_id]);
        rtp_senders[con_id] = null;
      }
    }
    streamStoped();
  }

  var iceConfiguration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
      {
        urls: "stun:stun1.l.google.com:19302",
      },
    ],
  };

  async function setConnection(connid) {
    var connection = new RTCPeerConnection(iceConfiguration);

    connection.onnegotiationneeded = async function (event) {
      await setOffer(connid);
    };
    connection.onicecandidate = function (event) {
      if (event.candidate) {
        serverProcess(
          JSON.stringify({
            icecandidate: event.candidate,
          }),
          connid
        );
      }
    };

    connection.addEventListener("track", async (event) => {
      const [remoteStream] = event.streams;
      document.getElementById("v_" + connid).srcObject = remoteStream;
    });

    connection.add;

    peers_connection_ids[connid] = connid;
    peers_connection[connid] = connection;

    return connection;
  }

  async function setOffer(connid) {
    var connection = peers_connection[connid];
    var offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    serverProcess(
      JSON.stringify({
        offer: connection.localDescription,
      }),
      connid
    );
  }

  async function SDPProcess(message, from_connid) {
    message = JSON.parse(message);
    if (message.answer) {
      await peers_connection[from_connid].setRemoteDescription(
        new RTCSessionDescription(message.answer)
      );
    } else if (message.offer) {
      if (!peers_connection[from_connid]) {
        await setConnection(from_connid);
      }
      await peers_connection[from_connid].setRemoteDescription(
        new RTCSessionDescription(message.offer)
      );
      var answer = await peers_connection[from_connid].createAnswer();
      await peers_connection[from_connid].setLocalDescription(answer);
      serverProcess(
        JSON.stringify({
          answer: answer,
        }),
        from_connid
      );
    } else if (message.icecandidate) {
      if (!peers_connection[from_connid]) {
        await setConnection(from_connid);
      }
      try {
        await peers_connection[from_connid].addIceCandidate(
          message.icecandidate
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function closeConnectionCall(connid) {
    peers_connection_ids[connid] = null;
    if (peers_connection[connid]) {
      peers_connection[connid].close();
      peers_connection[connid] = null;
    }
    if (remote_aud_stream[connid]) {
      remote_aud_stream[connid].getTracks().forEach((t) => {
        if (t.stop) {
          t.stop();
        }
      });
      remote_aud_stream[connid] = null;
    }
    if (remote_vid_stream[connid]) {
      remote_vid_stream[connid].getTracks().forEach((t) => {
        if (t.stop) {
          t.stop();
        }
      });
      remote_vid_stream[connid] = null;
    }
  }

  return {
    setNewConnection: async function (connid) {
      await setConnection(connid);
    },
    init: async function (SDP_function, my_connid, stopedStream, videoAndScreen) {
      await _init(SDP_function, my_connid, stopedStream, videoAndScreen);
    },
    processClientFunc: async function (data, from_connid) {
      await SDPProcess(data, from_connid);
    },
    closeConnectionCall: async function (connid) {
      await closeConnectionCall(connid);
    },
  };
})();

export const My_app = (function () {
  var socket = null;
  var user_id = "";
  var meeting_id = "";
  var mainuser_id = "";

  function addUser(other_user_id, connId, userNum, other_user_main_id) {
    const other_Template = document.getElementById("other_Template");
    var newDivId = other_Template.cloneNode(true);
    newDivId.id = connId;
    newDivId.classList.add("other");
    const host = sessionStorage.getItem("Host_id");

    const textContent =
      `"${host}"` === other_user_main_id
        ? `host (${other_user_id} )`
        : other_user_id;
    newDivId.querySelector("h2").textContent = textContent;
    newDivId.querySelector("video").id = "v_" + connId;
    newDivId.querySelector("span").id = "h_" + connId;
    newDivId.style.display = "block";
    const users = document.getElementById("users");
    users.appendChild(newDivId);
    var div = document.createElement("div");
    div.id = `participant_${connId}`;
    div.style.margin = "10px";
    var span = document.createElement("span");
    span.textContent = other_user_id;
    div.appendChild(span);
    document.getElementById("participant_area").appendChild(div);

    document.getElementById("participant_count").innerHTML = `(${userNum})`;
  }

  function event_process_for_singnaling_server() {
    socket = io.connect(url);

    var SDP_function = function (data, to_connid) {
      socket.emit("SDPProcess", {
        message: data,
        to_connid: to_connid,
      });
    };

    var stopedStream = function () {
      socket.emit("streaming_is_stopped");
    };

    var videoAndScreen = function (data) {
      socket.emit("videoAndScreenShare", data)
    }

    socket.on("connect", () => {
      if (socket.connected) {
        App_process.init(SDP_function, socket.id, stopedStream, videoAndScreen);
        if (user_id !== "" && meeting_id !== "") {
          socket.emit("user_connect", {
            display_name: user_id,
            meetingid: meeting_id,
            mainuser_Id: mainuser_id,
          });
        }
      }
    });
    socket.on("streamIsStopped", (data) => {
      var element = document.getElementById("v_" + data.by);
      if (element) {
        element.srcObject = null;
      }
    });

    socket.on("inform_others_about_me", (data) => {
      addUser(
        data.other_user_id,
        data.connId,
        data.userNumber,
        data.mainuser_Id
      );
      App_process.setNewConnection(data.connId);
    });

    socket.on("inform_me_about_other_user", (other_users) => {
      var userNumber = other_users.length;
      var userNumb = userNumber + 1;
      if (other_users) {
        for (var i = 0; i < other_users.length; i++) {
          addUser(
            other_users[i].user_id,
            other_users[i].connectionId,
            userNumb,
            other_users[i].mainuser_Id
          );
          App_process.setNewConnection(other_users[i].connectionId);
        }
      }
    });

    socket.on("SDPProcess", async function (data) {
      await App_process.processClientFunc(data.message, data.from_connid);
    });

    socket.on("inform_another_about_disconnected_user", (data) => {
      document.getElementById(
        "participant_count"
      ).innerHTML = `(${data.uNumber})`;
      document.getElementById("participant_" + data.connId + "").remove();
      document.getElementById(data.connId).remove();
      App_process.closeConnectionCall(data.connId);
    });

    socket.on("showChatMessage", (data) => {
      var time = new Date();
      var ltime = time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      var div = document.createElement("div");
      div.className = "chats-div";
      var spansendby = document.createElement("span");
      spansendby.className = "chat-user-name";
      spansendby.innerHTML = data.from;
      var span2 = document.createElement("span");
      span2.className = "chat-time";
      span2.innerHTML = ltime;
      var lineBreak = document.createElement("br");
      var p = document.createElement("p");
      p.className = "chat-content";
      p.innerHTML = data.message;
      div.appendChild(spansendby);
      div.appendChild(span2);
      div.appendChild(lineBreak);
      div.appendChild(p);
      document.getElementById("messages").appendChild(div);

      if (
        document.getElementsByClassName("chatBox")[0].style.display === "none"
      ) {
        document.getElementById("raise-message-notify").style.display = "block";
      }
    });
    socket.on("hand_raise", (data) => {
      let user = document.getElementById("h_" + data.by);

      document.getElementById(
        "raise-hand-h2"
      ).innerHTML = `Someone, like ${data.name}, raised their hand ! <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="hand" class="svg-inline--fa fa-hand " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V336c0 1.5 0 3.1 .1 4.6L67.6 283c-16-15.2-41.3-14.6-56.6 1.4s-14.6 41.3 1.4 56.6L124.8 448c43.1 41.1 100.4 64 160 64H304c97.2 0 176-78.8 176-176V128c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V32z"></path></svg>`;
      document.getElementById("raise-hand-text").style.display = "flex";
      setTimeout(() => {
        document.getElementById("raise-hand-h2").innerHTML = ``;
        document.getElementById("raise-hand-text").style.display = "none";
      }, 5000);
      if (user.style.display === "block") {
        user.style.display = "none";
        document.getElementById("raise-hand-text").style.display = "none";
      } else {
        user.style.display = "block";
      }
    });

    socket.on("videoAndScreenShare", (data) => {
      if (data.video) {
        document.getElementById("v_" + data.by).style.transform = "scaleX(-1)"
      } else {
        document.getElementById("v_" + data.by).style.transform = "scaleX(1)"
      }
    })
  }

  function eventHandeling() {
    document.getElementById("chat_send").onclick = function () {
      var msgData = document.getElementById("chat_input").value;
      if (msgData) {
        socket.emit("sendMessage", msgData);
        document.getElementById("chat_input").value = "";

        var time = new Date();
        var ltime = time.toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        var div = document.createElement("div");
        div.className = "chats-div";
        var spansendby = document.createElement("span");
        spansendby.className = "chat-user-name";
        spansendby.innerHTML = user_id;
        var span2 = document.createElement("span");
        span2.className = "chat-time";
        span2.innerHTML = ltime;
        var lineBreak = document.createElement("br");
        var p = document.createElement("p");
        p.className = "chat-content";
        p.innerHTML = msgData;

        div.appendChild(spansendby);
        div.appendChild(span2);
        div.appendChild(lineBreak);
        div.appendChild(p);
        document.getElementById("messages").appendChild(div);
      }
    };

    document.getElementById("diconnect-user-meeting").onclick = function () {
      socket.disconnect();
    };
    document.getElementById("message-icon").onclick = function () {
      document.getElementById("raise-message-notify").style.display = "none";
      document.getElementById("insider-message-icon").innerHTML =
        '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="message" class="svg-inline--fa fa-message " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z"></path></svg>';
      document.getElementById("user-icon").innerHTML =
        '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="user" class="svg-inline--fa fa-user " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"></path></svg>';
    };
    document.getElementById("user-icon").onclick = function () {
      document.getElementById("user-icon").innerHTML =
        '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-large" class="svg-inline--fa fa-user-large " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 288A144 144 0 1 0 256 0a144 144 0 1 0 0 288zm-94.7 32C72.2 320 0 392.2 0 481.3c0 17 13.8 30.7 30.7 30.7H481.3c17 0 30.7-13.8 30.7-30.7C512 392.2 439.8 320 350.7 320H161.3z"></path></svg>';

      document.getElementById("insider-message-icon").innerHTML =
        '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="message" class="svg-inline--fa fa-message " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z"></path></svg>';
    };
    document.getElementById("raiseUserHand").onclick = function () {
      socket.emit("raise_hand");
    };
  }

  const init = (uid, mid, mainuser_Id) => {
    user_id = uid;
    meeting_id = mid;
    mainuser_id = mainuser_Id;
    document.getElementById("usertemplate").style.display = "block";
    document.getElementById("me").innerHTML = "You" + " (" + user_id + ")";
    document.title = user_id;
    event_process_for_singnaling_server();
    eventHandeling();
  };

  return {
    _init: function (uid, mid, mainuser_Id) {
      init(uid, mid, mainuser_Id);
    },
  };
})();
