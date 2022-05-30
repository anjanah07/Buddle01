import React from "react";
import GameContext from "./components/Game";
import Lobby from "./components/Lobby";

const App = ({ gameStarted, gameInfo, setGameStarted }) => {
  if (gameStarted) {
    return (
      <div className="App">
        <GameContext.Provider value={{ gameInfo, setGameInfo, setGameStarted }}>
          <ChessRoom />
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
