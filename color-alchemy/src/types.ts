export type Response = {
  userId: string;
  width: number;
  height: number;
  maxMoves: number;
  target: Target;
};

export type ClosestColor = {
  color: Target;
  position: {
    x: number;
    y: number;
  };
  percentage: number;
};

export type ColorArray = Array<Array<Target>>;
export type Target = [number, number, number];
export type LocationType = { x?: number; y?: number; side: 'left' | 'right' | 'top' | 'bottom' };
export type SourceColorType = Record<string, Target>;
