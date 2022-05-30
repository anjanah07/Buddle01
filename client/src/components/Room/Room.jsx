import React from "react";

//client sdk import
import HuddleClient, { emitter, HuddleTypes } from "huddle01-client";

//react imports
import { useEffect, useState, useRef } from "react";

//helper imports
import { getTrack } from "../../utils/helpers";
import { PeerVideo, PeerAudio, PeerScreen } from "./PeerViewport";
import Avatar from "../ChessRoom/Avatar";

function Room({ roomId }) {
  //to allow for recordings
  const isBot = localStorage.getItem("bot_password") === "huddle01";
  //initialising states
  const [huddle, setHuddle] = useState(null);
  const [roomState, setRoomState] = useState("");
  const [micState, setMicState] = useState(false);
  const [webcamState, setWebcamState] = useState(false);
  const [recordingState, setRecordingState] = useState(false);
  const [screenshareState, setScreenshareState] = useState(false);
  const [streamingState, setStreamingState] = useState(false);
  const [peers, setPeers] = useState([]);
  const [consumerStreams, setConsumerStreams] = useState({
    video: [],
    audio: [],
    screen: [],
  });

  const meVideoElem = useRef(null);
  const meScreenElem = useRef(null);
  const joinRoomBtn = useRef(null);

  const config = {
    apiKey: "i4pzqbpxza8vpijQMwZsP1H7nZZEH0TN3vR4NdNS",
    roomId: roomId,
    peerId: "Rick" + Math.floor(Math.random() * 4000),
    displayName: "Rick Sanchez",
    window,
    isBot,
  };

  //initialize the app
  useEffect(() => {
    console.log(`?roomId=${config.roomId}`);

    const myHuddleClient = new HuddleClient(config);
    setHuddle(myHuddleClient);
  }, []);

  //recording config
  useEffect(() => {
    //joinRoomBtn here can be whatever button/function used that calls `huddle.join()`
    huddle && isBot && joinRoomBtn.current.click();
  }, [huddle, isBot]);

  const setupEventListeners = async () => {
    emitter.on("roomState", (state) => {
      switch (state) {
        case "connected":
          //do whatever
          break;
        case "failed":
          //do whatever
          break;
        case "disconnected":
          //do whatever
          break;
        default:
          setRoomState(state);
          break;
      }
      setRoomState(state);
    });

    emitter.on("error", (error) => {
      alert(error);
      //do whatever
    });

    emitter.on("addPeer", (peer) => {
      console.log("new peer =>", peer);
      setPeers((_peers) => [..._peers, peer]);
    });

    emitter.on("addProducer", (producer) => {
      console.log("new prod", producer);
      switch (producer.type) {
        case "webcam":
          const videoStream = producer.track;
          if (typeof videoStream == "object") {
            try {
              if (videoStream !== null) {
                meVideoElem.current.srcObject = getTrack(videoStream);
              }
            } catch (error) {
              console.error(error);
            }
          }
          break;
        case "mic":
          //do whatever
          break;
        case "screen":
          const screenStream = producer.track;
          if (typeof screenStream == "object") {
            try {
              if (screenStream !== null) {
                meScreenElem.current.srcObject = getTrack(screenStream);
              }
            } catch (error) {
              console.error(error);
            }
          }
          break;

        default:
          break;
      }
    });

    emitter.on("removeProducer", (producer) => {
      console.log("remove ", producer);
      switch (producer.type) {
        case "webcam":
          try {
            meVideoElem.current.srcObject = null;
          } catch (error) {
            console.error(error);
          }
          break;
        case "mic":
          //do whatever
          break;
        case "screen":
          try {
            meScreenElem.current.srcObject = null;
          } catch (error) {
            console.error(error);
          }
          break;

        default:
          break;
      }
    });

    emitter.on("addConsumer", (consumer) => {
      switch (consumer.type) {
        case "webcam": {
          const videoStream = consumer.track;
          setConsumerStreams((prevState) => ({
            ...prevState,
            video: [...prevState.video, videoStream],
          }));

          break;
        }

        case "screen": {
          const screenStream = consumer.track;
          setConsumerStreams((prevState) => ({
            ...prevState,
            screen: [...prevState.screen, screenStream],
          }));
          break;
        }

        case "mic": {
          const audioStream = consumer.track;
          setConsumerStreams((prevState) => ({
            ...prevState,
            audio: [...prevState.audio, audioStream],
          }));

          break;
        }

        default:
          break;
      }
    });

    emitter.on("removeConsumer", (consumer) => {
      switch (consumer.type) {
        case "screen":
          setConsumerStreams((prevState) => {
            return {
              ...prevState,
              screen: prevState.screen.filter(
                (_consumer) => _consumer.id !== consumer._id
              ),
            };
          });
          break;
        case "webcam":
          setConsumerStreams((prevState) => {
            return {
              ...prevState,
              video: prevState.video.filter(
                (_consumer) => _consumer.id !== consumer._id
              ),
            };
          });
          break;
        case "mic":
          setConsumerStreams((prevState) => {
            return {
              ...prevState,
              audio: prevState.audio.filter(
                (_consumer) => _consumer.id !== consumer._id
              ),
            };
          });
          break;

        default:
          break;
      }
    });
  };

  const joinRoom = async () => {
    if (!huddle) return;
    try {
      setupEventListeners();
      await huddle.join();
    } catch (error) {
      alert(error);
    }
  };

  const leaveRoom = async () => {
    if (!huddle) return;
    try {
      await huddle.close();
      setRoomState("");
    } catch (error) {
      alert(error);
    }
  };

  //TODO: add pauseWebcam() and resumeWebcam()
  const enableWebcam = async () => {
    if (!huddle) return;
    try {
      await huddle.enableWebcam();
      setWebcamState(true);
    } catch (error) {
      setWebcamState(false);
      alert(error);
    }
  };

  const disableWebcam = async () => {
    if (!huddle) return;
    try {
      await huddle.disableWebcam();
      setWebcamState(false);
    } catch (error) {
      alert(error);
    }
  };

  const startScreenshare = async () => {
    if (!huddle) return;
    try {
      await huddle.enableShare();
      setScreenshareState(true);
    } catch (error) {
      alert(error);
      setScreenshareState(false);
    }
  };

  const stopScreenshare = async () => {
    if (!huddle) return;
    try {
      await huddle.disableShare();
      setScreenshareState(false);
    } catch (error) {
      alert(error);
    }
  };

  //TODO: add muteMic() and unmuteMic()
  const enableMic = async () => {
    if (!huddle) return;
    try {
      huddle.enableMic();
      setMicState(true);
    } catch (error) {
      setMicState(false);
      alert(error);
    }
  };

  const disableMic = async () => {
    if (!huddle) return;
    try {
      huddle.disableMic();
      setMicState(false);
    } catch (error) {
      alert(error);
      setMicState(true);
    }
  };

  const startRecording = async () => {
    if (!huddle) return;
    try {
      const status = await huddle.startRecording();
      if (status) {
        console.log("recording successfully initiated");
        setRecordingState(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    if (!huddle) return;
    try {
      const status = await huddle.stopRecording();
      if (status) {
        console.log("recording successfully stopped");
        setRecordingState(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const startStreaming = async () => {
    if (!huddle) return;
    try {
      const status = await huddle.startStreaming();
      if (status) {
        console.log("Streaming successfully started");
        setStreamingState(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const stopStreaming = async () => {
    if (!huddle) return;
    try {
      const status = await huddle.stopStreaming();
      if (status) {
        console.log("Streaming successfully stopped");
        setStreamingState(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    joinRoom();
  }, [huddle]);

  return (
    <div className="chessUserVideoCol">
      <div className="chessUserVideoRow">
        <div className="chessUserVideo">
          <Avatar />

          <video className="chessUserVideo__video" autoPlay ref={meVideoElem} />
          {/* <video height="400px" width="400px" autoPlay ref={meScreenElem} /> */}
        </div>

        <div className="chessUserVideo">
          <Avatar />

          {consumerStreams.video.map((stream, idx) => {
            return <PeerVideo key={idx} videoTrack={getTrack(stream)} />;
          })}
          {consumerStreams.screen.map((stream, idx) => {
            return <PeerScreen key={idx} screenTrack={getTrack(stream)} />;
          })}
          {consumerStreams.audio.map((stream, idx) => {
            return <PeerAudio key={idx} audioTrack={getTrack(stream)} />;
          })}
        </div>
      </div>
      <div className="btn-grp">
        {/* <button
          ref={joinRoomBtn}
          id="join-btn"
          onClick={roomState === "connected" ? leaveRoom : joinRoom}
        >
          {roomState === "connected" ? "Leave Room" : "Join Room"}
        </button> */}

        {roomState === "connected" ? (
          <>
            <button onClick={webcamState ? disableWebcam : enableWebcam}>
              {webcamState ? "Disable Webcam" : "Enable Webcam"}
            </button>
            <button onClick={micState ? disableMic : enableMic}>
              {micState ? "Disable Mic" : "Enable Mic"}
            </button>
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
}

export default Room;
