const {Color} = require('./color');

type Color = typeof Color;

class Image {
  private _pixels: Color[][] = [];

  constructor(public width: number, public height: number) {
    this._pixels = new Color[width][height];
  }
}