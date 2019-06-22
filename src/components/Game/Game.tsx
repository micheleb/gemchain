import classnames from "classnames";
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
  moving?: boolean;
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
  <span
    className={classnames("Cell", {
      [`bg-${props.color}`]: props.color !== undefined,
      blinking: props.blinking,
    })}
  >
    &nbsp;
  </span>
));

export type GameRef = {
  addGem: (newGem: CellProps) => any;
};

enum NeighbourDirection {
  W,
  SW,
  S,
  SE,
}

const neighbourKey: { [dir in NeighbourDirection]: (c: CellProps) => string } = {
  [NeighbourDirection.W]: (c) => cellId(c.row, c.col + 1),
  [NeighbourDirection.SW]: (c) => cellId(c.row - 1, c.col + 1),
  [NeighbourDirection.S]: (c) => cellId(c.row - 1, c.col),
  [NeighbourDirection.SE]: (c) => cellId(c.row - 1, c.col - 1),
};

const Game = (props: {}, ref: React.Ref<any>) => {
  const [cells, setCells] = useState(cellsProps);

  useImperativeHandle(ref, () => ({
    addGem(newGem: CellProps) {
      setCells({ ...cells, [cellId(newGem.row, newGem.col)]: newGem });
    },
  }));

  const resetTraversal = () =>
    Object.values(cells).forEach((c) => {
      c.touched = false;
    });

  const resetMoving = () =>
    Object.values(cells).forEach((c) => {
      c.moving = false;
    });

  const cleanupStep = () => {
    const blinking = Object.values(cells).filter((c) => c.blinking);

    if (blinking) {
      blinking.forEach((c) => {
        c.blinking = false;
        c.color = undefined;
      });
    }

    return blinking.length;
  };

  const gravityStep = () => {
    for (const r of rows) {
      for (const c of cols) {
        const cell = cells[cellId(r, c)];
        const { row, col, color, touched } = cell;
        const cellBelow = cells[cellId(row + 1, col)];
        if (color && !touched && cellBelow && !cellBelow.color) {
          cell.color = undefined;
          cellBelow.color = color;
          cellBelow.touched = true;
          cellBelow.moving = true;
        }
      }
    }
    resetTraversal();
  };

  const checkConnected = (
    cell: CellProps,
    othersInPath: CellProps[],
    allPaths: CellProps[][],
    dir?: NeighbourDirection
  ) => {
    const { color } = cell;
    if (cell.moving) {
      // wait for next round
      return;
    }

    const updatedPath = [...othersInPath, cell];

    const checkDirections =
      dir !== undefined
        ? [dir]
        : [
            NeighbourDirection.W,
            NeighbourDirection.SW,
            NeighbourDirection.S,
            NeighbourDirection.SE,
          ];

    checkDirections.forEach((d) => {
      const k = neighbourKey[d](cell);
      const c = cells[k];
      if (c && !c.moving && c.color === color) {
        checkConnected(c, [...updatedPath], allPaths, d);
      } else if (updatedPath.length >= 3) {
        allPaths.push([...updatedPath]);
      } else {
        cell.touched = false;
      }
    });
  };

  const check3orMore = () => {
    const allPaths: CellProps[][] = [];

    for (let r = ROW_COUNT - 1; r >= 0; r--) {
      for (const c of cols) {
        const cell = cells[cellId(r, c)];
        if (cell && cell.color) {
          checkConnected(cell, [], allPaths);
        }
      }
    }

    const matches = allPaths.filter((p) => p.length >= 3);

    if (matches.length) {
      // tslint:disable-next-line:no-console
      matches.forEach((p) =>
        p.forEach((c) => {
          c.blinking = true;
        })
      );
    }

    resetTraversal();
  };

  useInterval(() => {
    if (cleanupStep()) {
      // skip this round
    } else {
      gravityStep();
      check3orMore();
      resetMoving();
      setCells({ ...cells });
    }
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
