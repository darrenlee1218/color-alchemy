import React, { DragEvent } from "react";
import { TileProps } from "./Tile.types";
import "./Tile.css";

export function Tile({ color, close, draggable = false }: TileProps) {
  function onDrag(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", color.join(","));
  }
  return (
    <div
      draggable={draggable}
      onDragStart={onDrag}
      className="tile"
      style={{
        border: `2px solid ${close ? "red" : "#ccc"}`,
        cursor: draggable ? "grab" : "default",
        backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
      }}
      title={color.join(",")}
    />
  );
}
