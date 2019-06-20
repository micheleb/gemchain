import React from "react";
import "./Game.css";

const cols = Array(6).fill("");
const rows = Array(13).fill("");

const Game = () => {
  const getCol = (r: number, c: number) => (
    <span key={`${r}-${c}`} className="Cell">
      &nbsp;
    </span>
  );

  const getRow = (r: number) => (
    <div key={`row-${r}`} className="Row">
      {cols.map((_, c) => getCol(r, c))}
    </div>
  );

  return <div className="Game">{rows.map((_, r) => getRow(r))}</div>;
};

export default Game;
