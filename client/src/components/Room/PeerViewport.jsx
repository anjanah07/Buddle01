import React, { useEffect, useRef } from "react";

export const PeerVideo = ({ videoTrack }) => {
  const peerVideoTrack = useRef(null);

  useEffect(() => {
    peerVideoTrack.current.srcObject = videoTrack;
  }, []);
  return (
    <video ref={peerVideoTrack} autoPlay className="chessUserVideo__video" />
  );
};

export const PeerScreen = ({ screenTrack }) => {
  const peerScreenTrack = useRef(null);

  useEffect(() => {
    peerScreenTrack.current.srcObject = screenTrack;
  }, []);
  return (
    <div>
      <video ref={peerScreenTrack} height="400px" width="400px" autoPlay />
    </div>
  );
};

export const PeerAudio = ({ audioTrack }) => {
  const peerAudioTrack = useRef(null);

  useEffect(() => {
    console.log(audioTrack);
    peerAudioTrack.current.srcObject = audioTrack;
  }, []);
  return (
    <div>
      <audio ref={peerAudioTrack} autoPlay playsInline controls={false} />
    </div>
  );
};
