import React from "react";
import { Col, Row } from "react-bootstrap";
import "./Game.css";

const cols = Array(12).fill("");
const rows = Array(20).fill("");

const Game = () => {
  const getCol = (r: number, c: number) => (
    <Col key={`${r}-${c}`} md={1} className="Cell">
      &nbsp;
    </Col>
  );

  const getRow = (r: number) => (
    <Row key={`row-${r}`} className="no-gutters">
      {cols.map((_, c) => getCol(r, c))}
    </Row>
  );

  return <div className="Game">{rows.map((_, r) => getRow(r))}</div>;
};

export default Game;
