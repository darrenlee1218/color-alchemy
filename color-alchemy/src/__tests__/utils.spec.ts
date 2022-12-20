import { LocationType } from './../types';
import { copyColorArray, getColorCloseness, locationToString, r } from '../utils';

describe('locationToString()', () => {
  it('should convert location object into string for key', () => {
    const locationY: LocationType = {
      y: 2,
      side: 'left',
    };

    const locationX: LocationType = {
      x: 1,
      side: 'top',
    };
    expect(locationToString(locationY)).toBe('y-left-2');
    expect(locationToString(locationX)).toBe('x-top-1');
  });

  it('should throw error if no location is provided', () => {
    const location: LocationType = {
      side: 'left',
    };
    expect(() => {
      locationToString(location);
    }).toThrowError('x and y are undefined');
  });
});

describe('copyColorArray()', () => {
  it('should clone a color array', () => {
    const colorArray = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    expect(copyColorArray(colorArray)).toEqual(colorArray);
  });
});

describe('getColorCloseness()', () => {
  it('should get the closest color to the target color', () => {
    expect(getColorCloseness([206, 188, 56], [0, 0, 0])).toBe(64.4);
    expect(getColorCloseness([206, 188, 56], [204, 0, 0])).toBe(44.42);
    expect(getColorCloseness([206, 188, 56], [211, 207, 0])).toBe(13.44);
    expect(getColorCloseness([0, 0, 0], [0, 0, 0])).toBe(0);
  });
});

describe('r()', () => {
  it('should round a number', () => {
    expect(r(1.234)).toBe(1);
    expect(r(1.2345)).toBe(1);
    expect(r(234.6)).toBe(235);
    expect(r(1)).toBe(1);
  });
});
