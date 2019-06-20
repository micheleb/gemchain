import React from "react";
import { Col, Row } from "react-bootstrap";
import Game from "../Game/Game";
import "./App.css";

const App: React.FC = () => (
  <div className="App">
    <Row className="App-header">
      <Col md={12}>
        Gemchain{" "}
        <span role="img" aria-label="gem emoji">
          💎
        </span>
      </Col>
    </Row>
    <Row>
      <Col md={{ span: 10, offset: 1 }} className="GameContainer">
        <Game />
      </Col>
    </Row>
  </div>
);

export default App;
