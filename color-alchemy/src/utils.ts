import { LocationType, Response, Target } from './types';

/**
 * Fetch game details from server
 * @param userId - optional user id
 * @returns Promise<Response>
 */
export const fetchColor = async (userId?: string) => {
  const response = userId
    ? await fetch('http://localhost:9876/init/user/' + userId)
    : await fetch('http://localhost:9876/init');
  const data = (await response.json()) as Response;
  if (userId) console.log('userId', userId);
  return data;
};

/**
 * Convert location object into string for key
 * @param location
 * @returns string
 */
export const locationToString = ({ x, y, side }: LocationType) => {

  if(!x && !y && x !== 0 && y !== 0)
    throw new Error('x and y are undefined')

  if (x || x === 0) {
    return `x-${side}-${x}`;
  }

  return `y-${side}-${y}`;
};

/**
 * Clone a color array
 * @param colorArray
 */
export const copyColorArray = <T>(colorArray: T) => JSON.parse(JSON.stringify(colorArray)) as T;

/**
 * Get the closest color to the target color
 * @param targetColor
 * @param colorArray
 * @returns number
  */
export const getColorCloseness = (targetColor: Target, testColor: Target) => {
  const closeness =
    (1 / 255) *
    (1 / Math.sqrt(3)) *
    Math.sqrt(
      Math.pow(targetColor[0] - testColor[0], 2) +
        Math.pow(targetColor[1] - testColor[1], 2) +
        Math.pow(targetColor[2] - testColor[2], 2),
    );
  const NUMBER_OF_DECIMALS = 2;
  return r(closeness * 100 * Math.pow(10, NUMBER_OF_DECIMALS)) / Math.pow(10, NUMBER_OF_DECIMALS);
};

/**
 * Round a number
 * @param number
 * @returns
 */
export const r = (number: number) => Math.round(number);
