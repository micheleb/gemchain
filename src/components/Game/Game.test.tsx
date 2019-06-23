import { cleanup, render } from "@testing-library/react";
import React from "react";
import { initialScenario } from "../../testUtils";
import App from "../App/App";
import { COL_COUNT, ROW_COUNT } from "../Game/Game";

afterEach(cleanup);

const getGameAndCheckCells = (getByTestId: (id: string) => HTMLElement) => {
  const Game = getByTestId("Game");
  expect(Game.querySelectorAll("div")).toHaveLength(ROW_COUNT);
  expect(Game.querySelectorAll("span")).toHaveLength(COL_COUNT * ROW_COUNT);
  return Game;
};

it("renders an empty board", () => {
  const { getByTestId } = render(<App />);
  getGameAndCheckCells(getByTestId);
});

it("renders a board with an initial scenario set", () => {
  const { getByTestId } = render(<App initialScenario={initialScenario} />);
  getGameAndCheckCells(getByTestId);
  // TODO check if cells have been set
});

it("updates cells on render", () => {
  const { getByTestId, rerender } = render(<App initialScenario={initialScenario} />);
  getGameAndCheckCells(getByTestId);

  rerender(<App initialScenario={initialScenario} />);
  // TODO check if cells get updated
});
