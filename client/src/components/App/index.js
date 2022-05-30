import React, { useState, useContext, useEffect } from "react";
import { v1 as uuid } from "uuid";
import Board from "../Board";
import Lobby from "../Lobby";
import { SocketContext } from "../Socket";
import GameContext from "../Game";
import "./App.css";
import ChessRoom from "../ChessRoom/ChessRoom";
const App = () => {
  const socket = useContext(SocketContext);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameInfo, setGameInfo] = useState({
    id: "",
    playerColor: "black",
    board: "start",
  });

  useEffect(() => {
    if (localStorage.getItem("userId") === null) {
      //Generate new user id if none found in local storage
      localStorage.setItem("userId", uuid());
    }

    socket.on("startGame", (game) => {
      const userId = localStorage.getItem("userId");
      console.log(game);
      setGameInfo({
        id: game.id,
        playerColor: game.players[userId],
        board: game.board,
      });
      setGameStarted(true);
    });

    socket.on("endGame", () => {
      console.log("game ended");
      setGameStarted(false);
      setGameInfo({
        id: "",
        playerColor: "black",
        board: "start",
      });
    });
  }, []);

  if (gameStarted) {
    return (
      <div className="App">
        <GameContext.Provider value={{ gameInfo, setGameInfo, setGameStarted }}>
          <ChessRoom gameInfo={gameInfo} />
        </GameContext.Provider>
      </div>
    );
  } else {
    return (
      <div className="App">
        <GameContext.Provider value={{ gameInfo, setGameInfo }}>
          <Lobby />
          <p className="made-by">
            Made by{" "}
            <a href="https://github.com/anjanaaaaaaaa" target="_blank">
              Anjana Haridas
            </a>
          </p>
        </GameContext.Provider>
      </div>
    );
  }
};

export default App;
