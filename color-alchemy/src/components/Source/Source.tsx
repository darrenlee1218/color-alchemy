import React, { useRef, DragEvent } from "react";
import type { Target } from "../../types";
import { SourceProps } from "./Source.types";
import "./Source.css";

export  function Source({ color, location, clickable, onColorChange }: SourceProps) {
  const element = useRef<HTMLDivElement>(null);

  function onDrag(e: DragEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
    const color = e.dataTransfer?.getData("text/plain");
    onColorChange(location, color?.split(",").map((c) => parseInt(c)) as Target);
  }

  return (
    <div
      role={clickable ? "button" : "none"}
      onKeyUp={() => clickable && onColorChange(location)}
      onClick={() => clickable && onColorChange(location)}
      className="source"
      onDragOver={onDrag}
      onDragEnter={onDrag}
      onDrop={onDrop}
      ref={element}
      style={{
        cursor: clickable ? "pointer" : "no-drop",
        backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
      }}
      title={color.join(",")}
    />
  );
}
