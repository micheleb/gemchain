import classnames from "classnames";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useInterval } from "../../effects";
import "./Game.css";

// as in some other rather similar game
export const ROW_COUNT = 13;
export const COL_COUNT = 6;

const REFRESH_TIME_MILLIS = 500;
const SPEED_UP_TIME_MILLIS = 40;

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

// used to quickly setup a scenario when debugging
const setCell = (row: number, col: number, color: string) => {
  cellsProps[`${row}-${col}`] = { row, col, color };
};

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

export type GameProps = {
  initialScenario?: CellProps[];
};

enum NeighbourDirection {
  E,
  NE,
  N,
  NW,
}

const neighbourKey: { [dir in NeighbourDirection]: (c: CellProps) => string } = {
  [NeighbourDirection.E]: (c) => cellId(c.row, c.col + 1),
  [NeighbourDirection.NE]: (c) => cellId(c.row - 1, c.col + 1),
  [NeighbourDirection.N]: (c) => cellId(c.row - 1, c.col),
  [NeighbourDirection.NW]: (c) => cellId(c.row - 1, c.col - 1),
};

export const Game = (props: GameProps, ref: React.Ref<any>) => {
  if (props.initialScenario) {
    props.initialScenario.forEach((p) => setCell(p.row, p.col, p.color!));
  }
  const [cells, setCells] = useState(cellsProps);
  const [speedGravityUp, setSpeedGravityUp] = useState(false);

  useImperativeHandle(ref, () => ({
    addGem(newGem: CellProps) {
      setCells({ ...cells, [cellId(newGem.row, newGem.col)]: newGem });
    },
  }));

  const resetMoving = () =>
    Object.values(cells).forEach((c) => {
      c.moving = false;
    });

  const destroyGems = () => {
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
    for (let r = ROW_COUNT - 1; r >= 0; r--) {
      for (const c of cols) {
        const cell = cells[cellId(r, c)];
        const { row, col, color } = cell;
        const cellBelow = cells[cellId(row + 1, col)];
        if (color && cellBelow && !cellBelow.color) {
          cell.color = undefined;
          cellBelow.color = color;
          cellBelow.moving = true;
        }
      }
    }
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
            NeighbourDirection.E,
            NeighbourDirection.NE,
            NeighbourDirection.N,
            NeighbourDirection.NW,
          ];

    checkDirections.forEach((d) => {
      const k = neighbourKey[d](cell);
      const c = cells[k];
      if (c && !c.moving && c.color === color) {
        checkConnected(c, [...updatedPath], allPaths, d);
      } else if (updatedPath.length >= 3) {
        allPaths.push([...updatedPath]);
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
  };

  useInterval(
    () => {
      if (speedGravityUp) {
        gravityStep();
        if (!Object.values(cells).filter((c) => c.moving).length) {
          setSpeedGravityUp(false);
        }
        resetMoving();
        setCells({ ...cells });
      } else {
        if (destroyGems()) {
          setSpeedGravityUp(true);
        } else {
          gravityStep();
          check3orMore();
          resetMoving();
          setCells({ ...cells });
        }
      }
    },
    speedGravityUp ? SPEED_UP_TIME_MILLIS : REFRESH_TIME_MILLIS
  );

  const getRow = (r: number) => (
    <div key={`row-${r}`} className="Row">
      {cols.map((_, c) => (
        <Cell key={cellId(r, c)} {...cells[cellId(r, c)]} />
      ))}
    </div>
  );

  return (
    <div className="Game" data-testid="Game">
      {rows.map((_, r) => getRow(r))}
    </div>
  );
};

export default forwardRef<GameRef, GameProps>(Game);
