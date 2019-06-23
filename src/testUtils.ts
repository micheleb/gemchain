// scenario in which adding a green gem to column 12 should result in
// clearing the board in 3 rounds.
// To test the scenario live, import this from App.tsx and remove
// "props." from the <Game ref={gameRef} initialScenario={...} />
// line in App's return statement).
export const initialScenario = [
  { row: 12, col: 0, color: "yellow" },
  { row: 11, col: 0, color: "blue" },
  { row: 10, col: 0, color: "green" },
  { row: 9, col: 0, color: "green" },
  { row: 8, col: 0, color: "blue" },
  { row: 7, col: 0, color: "blue" },
  { row: 6, col: 0, color: "yellow" },
  { row: 5, col: 0, color: "yellow" },
  { row: 12, col: 1, color: "yellow" },
  { row: 11, col: 1, color: "blue" },
  { row: 12, col: 2, color: "blue" },
  { row: 11, col: 2, color: "green" },
  { row: 10, col: 2, color: "green" },
  { row: 9, col: 2, color: "blue" },
  { row: 8, col: 2, color: "yellow" },
];
