import React, { useCallback, useEffect, useRef, useState } from "react";

const GridCheckOrder = () => {
  const [grid, setGrid] = useState(
    Array.from({ length: 3 }, () => new Array(3).fill(false))
  );

  const queue = useRef([]);
  const timerId = useRef([]);

  const handleClick = useCallback(
    (rowIn, colIn, flag) => {
      if (timerId.current.length > 0 && flag) {
        return;
      }

      if (grid[rowIn][colIn] && flag) {
        return;
      }

      setGrid((prev) => {
        const copyGrid = JSON.parse(JSON.stringify(prev));
        copyGrid[rowIn][colIn] = flag;
        if (flag) {
          const index = queue.current.findIndex(
            ([r, c]) => r === rowIn && c === colIn
          );
          if (index === -1) {
            queue.current.push([rowIn, colIn]);
          }
        }
        return copyGrid;
      });
    },
    [grid]
  );

  useEffect(() => {
    if (queue.current.length === 9) {
      //   queue.current.reverse();
      queue.current.forEach(([rowIn, colIn], idx) => {
        const timer = setTimeout(() => {
          handleClick(rowIn, colIn, false);
        }, 1000 * (idx + 1));
        timerId.current.push(timer);
      });
      queue.current = [];
    }
  }, [grid, handleClick]);

  useEffect(() => {
    return () => {
      timerId.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(3, 1fr)`,
        gap: "5px",
        width: "12rem",
      }}
    >
      {grid.map((row, rowIn) => {
        return row.map((col, colIn) => {
          return (
            <div
              key={`${rowIn}-${colIn}`}
              style={{
                height: "50px",
                width: "50px",
                border: "1px solid black",
                backgroundColor: col ? "green" : "",
              }}
              onClick={() => handleClick(rowIn, colIn, true)}
            ></div>
          );
        });
      })}
    </div>
  );
};

export default GridCheckOrder;
