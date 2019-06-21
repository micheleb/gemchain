import React, { useRef, useState } from "react";
import { Button, Col, Form, FormControlProps, Row } from "react-bootstrap";
import Game, { cols, GameRef } from "../Game/Game";
import "./App.css";

const colors = ["red", "blue", "green", "yellow", "purple"];

const App: React.FC = () => {
  const gameRef = useRef<GameRef>({ addGem: () => null });

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedCol, setSelectedCol] = useState("0");

  const onColorChange = (e: React.FormEvent<FormControlProps>) =>
    setSelectedColor(e.currentTarget.value as string);

  const onSelectionChange = (e: React.FormEvent<FormControlProps>) =>
    setSelectedCol(e.currentTarget.value as string);

  const addGem = () =>
    gameRef.current!.addGem({
      col: parseInt(selectedCol, 10),
      color: selectedColor,
      moving: true,
      row: 0,
    });

  return (
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
        <Col md={{ span: 6, offset: 3 }} className="GameContainer">
          <Game ref={gameRef} />
        </Col>
        <Col md={2}>
          <Form>
            <Form.Group>
              <Form.Label>Gem color</Form.Label>
              <Form.Control as="select" onChange={onColorChange} value={selectedColor}>
                {colors.map((color) => (
                  <option key={`opt-${color}`}>{color}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Add gem to column</Form.Label>
              <Form.Control as="select" onChange={onSelectionChange} value={selectedCol}>
                {cols.map((_, i) => (
                  <option key={`opt-${i}`}>{i}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="secondary" onClick={addGem}>
              Add
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default App;
