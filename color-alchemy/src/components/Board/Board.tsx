import React from "react";
import {Source} from "../Source";
import {Tile} from "../Tile";
import { BoardProps } from "./Board.types";

export default function Board({ colorArray, sourceColor, closeColor, sourceClickable, onColorChange }: BoardProps) {
  return (
    <div style={{ width: "fit-content", paddingTop: "1rem" }}>
      {/* top row of horizontal sources */}
      {colorArray[0].map((color, i) => (
        <Source
          clickable={sourceClickable}
          onColorChange={onColorChange}
          key={i}
          color={sourceColor[`x-top-${i}`] || [0, 0, 0]}
          location={{ x: i, side: "top" }}
        />
      ))}
      {colorArray.map((row, i) => (
        //  row
        <div key={i}>
          {/* a source that will make the vertical sources on the left side */}
          <Source
            clickable={sourceClickable}
            onColorChange={onColorChange}
            color={sourceColor[`y-left-${i}`] || [0, 0, 0]}
            location={{ y: i, side: "left" }}
          />
          {/* tile row to display color */}
          {row.map((color, j) => {
            return (
              <Tile
                close={i === closeColor.position.y && j === closeColor.position.x ? true : false}
                draggable={!sourceClickable}
                key={`${i}${j}`}
                color={color}
              />
            );
          })}
          {/* a source that will make the vertical sources on the right side */}
          <Source
            clickable={sourceClickable}
            onColorChange={onColorChange}
            color={sourceColor[`y-right-${i}`] || [0, 0, 0]}
            location={{ y: i, side: "right" }}
          />
        </div>
      ))}
      {/* bottom row of horizontal sources */}
      {colorArray[0].map((color, i) => (
        <Source
          clickable={sourceClickable}
          onColorChange={onColorChange}
          key={`2${i}`}
          color={sourceColor[`x-bottom-${i}`] || [0, 0, 0]}
          location={{ x: i, side: "bottom" }}
        />
      ))}
    </div>
  );
}
