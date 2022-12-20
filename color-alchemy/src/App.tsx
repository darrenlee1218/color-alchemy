import React, { useEffect, useState } from "react";
import "./App.css";
import { ClosestColor, ColorArray, LocationType, Response, SourceColorType, Target } from "./types";
import { Tile } from "./components/Tile";
import Board from "./components/Board/Board";
import { copyColorArray, fetchColor, getColorCloseness, locationToString, r } from "./utils";

function App() {
  const [details, setDetails] = useState<Response>();
  const [colorArray, setColorArray] = useState<ColorArray>([]);
  const [yLeftColorCollection, setYLeftColorCollection] = useState<ColorArray>();
  const [yRightColorCollection, setYRightColorCollection] = useState<ColorArray>();
  const [xTopColorCollection, setXTopColorCollection] = useState<ColorArray>();
  const [xBottomColorCollection, setXBottomColorCollection] = useState<ColorArray>();
  const [sourceColor, setSourceColor] = useState<SourceColorType>({});
  const [movesLeft, setMovesLeft] = useState<number>(0);
  const [isRestarting, setIsRestarting] = useState(false); // to avoid multiple api call

  const [closeColor, setCloseColor] = useState<ClosestColor>({
    color: [0, 0, 0],
    position: { x: 0, y: 0 },
    percentage: 100,
  });
  let isApiCallDirty = false; // to avoid multiple api call
  const [isGameDirty, setIsGameDirty] = useState(false); // to detect if user has played at least one move on the game

  // set all color collection to default (black)
  const initiateColorArray = () => {
    const _colorArray: ColorArray = [];
    const defaultColor: Target = [0, 0, 0]; // black / rgb(0, 0, 0)
    setIsGameDirty(false);

    if (details) {
      for (let i = 0; i < details?.height; i++) {
        _colorArray.push([]);
        for (let j = 0; j < details?.width; j++) {
          _colorArray[i].push(defaultColor);
        }
      }
    }

    // set all at the same time to avoid multiple re-render
    setTimeout(() => {
      setMovesLeft(details?.maxMoves || 0);
      setColorArray(_colorArray);
      setXTopColorCollection(copyColorArray(_colorArray));
      setXBottomColorCollection(copyColorArray(_colorArray));
      setYLeftColorCollection(copyColorArray(_colorArray));
      setYRightColorCollection(copyColorArray(_colorArray));
      setSourceColor({});
    }, 100);
  };

  const computeColorShades = (location: LocationType, color?: Target) => {
    const locationString = locationToString(location);
    let _color = color || ([0, 0, 0] as Target);

    // on first click set source color to red / rgb(255, 0, 0)
    if (details && details?.maxMoves - movesLeft === 0) {
      _color = [255, 0, 0];
    } else if (details && details?.maxMoves - movesLeft === 1) {
      // on second click set source color to green / rgb(0, 255, 0)
      _color = [0, 255, 0];
    } else if (details && details?.maxMoves - movesLeft === 2) {
      // on third click set source color to blue / rgb(0, 0, 255)
      _color = [0, 0, 255];
    }

    setSourceColor({ ...sourceColor, [locationString]: _color });

    // if one of the color collection is not set, return
    if (
      !colorArray ||
      !yLeftColorCollection ||
      !yRightColorCollection ||
      !xTopColorCollection ||
      !xBottomColorCollection
    )
      return;

    const { x, y, side } = location;
    const height = colorArray.length;
    const width = colorArray[0].length;

    // if the source location is on horizontal, then compute horizontal color mix
    if (x || x === 0) {
      // top horizontal computation
      if (side === "top") {
        const _clonedTopColorCollection = copyColorArray(xTopColorCollection);

        for (let row = height; row > 0; row--) {
          const red = ((height + 1 - row) / (height + 1)) * _color[0];
          const green = ((height + 1 - row) / (height + 1)) * _color[1];
          const blue = ((height + 1 - row) / (height + 1)) * _color[2];

          _clonedTopColorCollection[row - 1][x] = [r(red), r(green), r(blue)];
        }

        setXTopColorCollection(_clonedTopColorCollection);
      }
      // bottom horizontal computation
      if (side === "bottom") {
        const _clonedBottomColorCollection = copyColorArray(xBottomColorCollection);

        for (let row = 0; row < height; row++) {
          const red = ((row + 1) / (height + 1)) * _color[0];
          const green = ((row + 1) / (height + 1)) * _color[1];
          const blue = ((row + 1) / (height + 1)) * _color[2];

          _clonedBottomColorCollection[row][x] = [r(red), r(green), r(blue)];
        }

        setXBottomColorCollection(_clonedBottomColorCollection);
      }
    }

    // if the source location is on vertical, then compute vertical color mix
    if (y || y === 0) {
      // left vertical computation
      if (side === "left") {
        const _clonedLeftColorCollection = copyColorArray(yLeftColorCollection);

        for (let col = 0; col < width; col++) {
          const red = ((width + 1 - col) / (width + 1)) * _color[0];
          const green = ((width + 1 - col) / (width + 1)) * _color[1];
          const blue = ((width + 1 - col) / (width + 1)) * _color[2];

          _clonedLeftColorCollection[y][col - 1] = [r(red), r(green), r(blue)];
        }

        setYLeftColorCollection(_clonedLeftColorCollection);
      }
      // right vertical computation
      if (side === "right") {
        const _clonedRightColorCollection = copyColorArray(yRightColorCollection);

        for (let col = 0; col < width; col++) {
          const red = ((col + 1) / (width + 1)) * _color[0];
          const green = ((col + 1) / (width + 1)) * _color[1];
          const blue = ((col + 1) / (width + 1)) * _color[2];

          _clonedRightColorCollection[y][col] = [r(red), r(green), r(blue)];
        }

        setYRightColorCollection(_clonedRightColorCollection);
      }
    }

    setMovesLeft(movesLeft - 1);
  };

  // judge if the game is won or lost
  const judge = async () => {
    if (isRestarting) return;

    let judged = false;

    if (isGameDirty && closeColor.percentage < 10 && confirm("Success: Do you want to play again?")) {
      judged = true;
    } else if (isGameDirty && movesLeft < 1 && confirm("Failed: Do you want to play again?")) {
      judged = true;
    }

    setIsGameDirty(true);

    if (judged) {
      setIsRestarting(true);
      setTimeout(async () => {
        const data = await fetchColor(details?.userId);
        setDetails(data);
        setIsRestarting(false);
      }, 100); // wait for 100ms before fetching new game details, to avoid the game details being fetched before the react proper render
    }
  };

  // fetch game details on initial render
  useEffect(() => {
    async function fetchData() {
      isApiCallDirty = true;
      const data = await fetchColor();
      setDetails(data);
    }
    if (isApiCallDirty) return;
    fetchData();
  }, []);

  // initiate color array on details change ( after game is won or lost)
  useEffect(() => {
    initiateColorArray();
  }, [details]);

  // compute the color mix from four different color collections, whenever any of the color collection changes
  useEffect(() => {
    // make sure all the color collections are set
    if (
      !colorArray ||
      !yLeftColorCollection ||
      !yRightColorCollection ||
      !xTopColorCollection ||
      !xBottomColorCollection
    )
      return;

    // make sure all the color collections are not empty
    if (
      !colorArray[0] ||
      !yLeftColorCollection[0] ||
      !yRightColorCollection[0] ||
      !xTopColorCollection[0] ||
      !xBottomColorCollection[0]
    )
      return;

    const height = colorArray.length;
    const width = colorArray[0].length;
    const _clonedColorArray = copyColorArray(colorArray);
    let _clonedClosestColor = {
      color: [0, 0, 0],
      position: { x: 0, y: 0 },
      percentage: 100,
    } as ClosestColor;

    // loop through rows of the color collections
    for (let row = 0; row < height; row++) {
      // loop through columns of the color collections
      for (let col = 0; col < width; col++) {
        const red =
          xTopColorCollection[row][col][0] +
          xBottomColorCollection[row][col][0] +
          yLeftColorCollection[row][col][0] +
          yRightColorCollection[row][col][0];
        const green =
          xTopColorCollection[row][col][1] +
          xBottomColorCollection[row][col][1] +
          yLeftColorCollection[row][col][1] +
          yRightColorCollection[row][col][1];
        const blue =
          xTopColorCollection[row][col][2] +
          xBottomColorCollection[row][col][2] +
          yLeftColorCollection[row][col][2] +
          yRightColorCollection[row][col][2];

        const F = 255 / Math.max(red, green, blue, 255); // normalization factor

        const result = [r(red * F), r(green * F), r(blue * F)] as Target;
        _clonedColorArray[row][col] = result;

        if (details) {
          const closenessPercentage = getColorCloseness(details?.target, result);

          // if the closeness color percentage is less than what we have, then update the closest color
          if (closenessPercentage < _clonedClosestColor.percentage)
            _clonedClosestColor = {
              color: result,
              percentage: closenessPercentage,
              position: { x: col, y: row },
            };
        }
      }
    }

    setTimeout(() => {
      setColorArray(_clonedColorArray);
      setCloseColor(_clonedClosestColor);
    }, 100);
  }, [xBottomColorCollection, xTopColorCollection, yLeftColorCollection, yRightColorCollection]);

  // judge if the game is won or lost, whenever the closest color percentage changes
  useEffect(() => {
    judge();
  }, [closeColor.percentage, movesLeft]);

  return (
    <div className="App">
      <h2 style={{ textAlign: "left" }}>RGBA Alchemy</h2>
      <div className="info-row">User Id: {details?.userId}</div>
      <div className="info-row">MovesLeft: {movesLeft}</div>
      <div className="info-row">Target Color: {details && <Tile color={details?.target} />} </div>
      <div className="info-row">
        Closest Color: {details && <Tile color={closeColor.color} />} <span> Δ= {closeColor.percentage}%</span>{" "}
      </div>

      <div>
        {colorArray.length > 0 && (
          <Board
            sourceColor={sourceColor}
            closeColor={closeColor}
            colorArray={colorArray}
            sourceClickable={details ? details?.maxMoves - movesLeft < 3 : true}
            onColorChange={computeColorShades}
          />
        )}
      </div>
    </div>
  );
}

export default App;
