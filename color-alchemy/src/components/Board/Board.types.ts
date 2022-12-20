import { ColorArray, SourceColorType, ClosestColor, LocationType, Target } from "../../types";

export type BoardProps = {
    colorArray: ColorArray;
    sourceColor: SourceColorType;
    sourceClickable: boolean;
    closeColor: ClosestColor;
    onColorChange: (location: LocationType, color?: Target) => void;
  };