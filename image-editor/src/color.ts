class Color {
  constructor(
    private _red: number, 
    private _green: number, 
    private _blue: number) {}

  public get red(): number {
    return this._red;
  }

  public get green(): number {
    return this._green;
  }

  public get blue(): number {
    return this._blue;
  }

  public set red(value: number) {
    this._red = value;
  }

  public set green(value: number) {
    this._green = value;
  }

  public set blue(value: number) {
    this._blue = value;
  }
}

module.exports = { Color };