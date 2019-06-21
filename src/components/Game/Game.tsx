import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useInterval } from "../../effects";
import "./Game.css";

// as in some other rather similar game
const ROW_COUNT = 13;
const COL_COUNT = 6;

const REFRESH_TIME_MILLIS = 500;

// only used to keep track of indices, never filled with anything else
const rows = Array.from(Array(ROW_COUNT), (_, i) => i);
export const cols = Array.from(Array(COL_COUNT), (_, i) => i);

type CellProps = {
  row: number;
  col: number;
  color?: string;
  owner?: string;
  blinking?: boolean;
  touched?: boolean;
};

type Cells = { [cellId: string]: CellProps };

const cellId = (row: number, col: number) => `${row}-${col}`;

// only used for initialization, then we'll use the hook
const cellsProps: Cells = {};

for (const r of rows) {
  for (const c of cols) {
    cellsProps[cellId(r, c)] = { row: r, col: c };
  }
}

const Cell = React.memo((props: CellProps) => (
  <span className={`Cell ${(props.color && `bg-${props.color}`) || ""}`}>&nbsp;</span>
));

export type GameRef = {
  addGem: (newGem: CellProps) => any;
};

const Game = (props: {}, ref: React.Ref<any>) => {
  const [cells, setCells] = useState(cellsProps);

  useImperativeHandle(ref, () => ({
    addGem(newGem: CellProps) {
      setCells({ ...cells, [cellId(newGem.row, newGem.col)]: newGem });
    },
  }));

  useInterval(() => {
    for (const r of rows) {
      for (const c of cols) {
        const cell = cells[cellId(r, c)];
        const { row, col, color, touched } = cell;
        const cellBelow = cells[cellId(row + 1, col)];
        if (color && !touched && cellBelow && !cellBelow.color) {
          cell.color = undefined;
          cellBelow.color = color;
          cellBelow.touched = true;
        }
      }
    }

    Object.values(cells).forEach((c) => {
      c.touched = false;
    });

    setCells({ ...cells });
  }, REFRESH_TIME_MILLIS);

  const getRow = (r: number) => (
    <div key={`row-${r}`} className="Row">
      {cols.map((_, c) => (
        <Cell key={cellId(r, c)} {...cells[cellId(r, c)]} />
      ))}
    </div>
  );

  return <div className="Game">{rows.map((_, r) => getRow(r))}</div>;
};

export default forwardRef<GameRef, {}>(Game);
