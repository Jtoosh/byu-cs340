import process = require('node:process');
import Color = require('./color');

class Image {
  private _pixels: Color[][] = [] as Color[][];

  constructor(public width: number, public height: number) {
    this._pixels = Array.from({ length: width }, () =>
      Array.from({ length: height }, () => new Color(0, 0, 0))
    );
  }

  public getPixel(x:number, y:number): Color {
    if (this._pixels[x] === undefined || this._pixels[x][y] === undefined) {
      throw new RangeError(`Pixel coordinates out of bounds: (${x}, ${y})`);
    }
    return this._pixels[x][y];
  }

  public setPixel(x:number, y:number, color: Color): void {
    if (this._pixels[x] === undefined || this._pixels[x][y] === undefined) {
      throw new RangeError(`Pixel coordinates out of bounds: (${x}, ${y})`);
    }
    this._pixels[x][y].red = color.red;
    this._pixels[x][y].green = color.green;
    this._pixels[x][y].blue = color.blue;
  }

  public getHeight(): number {
    return this._pixels[0]!.length;
  }

  public getWidth(): number {
    return this._pixels.length;
  }
}

export = Image;