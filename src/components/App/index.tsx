import React from "react";
import { Col, Row } from "react-bootstrap";
import Game from "../Game";
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
      <Col md={12}>
        <Game />
      </Col>
    </Row>
  </div>
);

export default App;
