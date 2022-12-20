import type { Target, LocationType } from "../../types";

export type SourceProps = {
    color: Target;
    location: LocationType;
    clickable?: boolean;
    onColorChange: (location: LocationType, color?: Target) => void;
  };