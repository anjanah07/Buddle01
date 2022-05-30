import React from "react";
import Board from "../Board";
import Room from "../Room/Room";
import Avatar from "./Avatar";

// styles
import "./ChessRoom.css";

const ChessRoom = ({ gameInfo }) => {
  return (
    <div className="chessGrid">
      <div>
        <Board />
        <p className="made-by">
          Made by{" "}
          <a href="https://github.com/anjanaaaaaaaa" target="_blank">
            Anjana Haridas
          </a>
        </p>
      </div>

      <Room roomId={`buddle01-${gameInfo.id}`} />
      {/* <div className="chessUserVideoCol">
        <div className="chessUserVideoRow">
          <div className="chessUserVideo">
            <Avatar />
          </div>
          <div className="chessUserVideo">
            <Avatar />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ChessRoom;
