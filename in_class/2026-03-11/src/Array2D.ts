import * as fs from "fs";

interface Array2D {
  set(row: number, col: number, value: number): void;

  get(row: number, col: number): number;
}

class Matrix implements Array2D {
  array: number[][];

  constructor(row?: number, col?: number, fileName?: string) {
    if (fileName !== undefined) {
      this.array = this.load(fileName);
    } else if (row !== undefined && col !== undefined) {
      this.array = new Array(row);
      for (let i = 0; i < row; i++) {
        this.array[i] = new Array(col).fill(0);
      }
    } else {
      this.array = [];
      throw Error("No array specified");
    }
  }

  save(fileName: string) {
    const JsonArray = JSON.stringify(this.array);
    fs.writeFileSync(fileName, JsonArray);
  }

  load(fileName: string): number[][] {
    return JSON.parse(fs.readFileSync(fileName, "utf-8"));
  }

  get(row: number, col: number): number {
    return this.array[row]?.[col] ?? 0;
  }

  set(row: number, col: number, value: number): void {
    if (this.array[row] === undefined) {
      throw new Error(`Row ${row} is out of bounds`);
    }
    this.array[row][col] = value;
  }
}

class MatrixProxy implements Array2D{
    matrix: Matrix | null = null
    fileName: string

    constructor(fileName:string){
        this.fileName = fileName
    }
    set(row: number, col: number, value: number): void {
        if (this.matrix === null){
            this.matrix = this.load(this.fileName)
        }
        this.matrix.set(row, col, value)
    }
    get(row: number, col: number): number {
        if (this.matrix === null){
            this.matrix = this.load(this.fileName)
        }
        return this.matrix.get(row, col)
    }

    load(fileName:string){
        return new Matrix(0,0,fileName)
    }

    save(fileName:string){
       if (this.matrix === null){
            this.matrix = this.load(this.fileName)
        } 
        this.matrix.save(fileName)
    }

    
}

function main() {
  const array = new MatrixProxy("5x5_Matrix")
  array.set(0, 0, 1);
  array.set(1, 1, 2);
  array.set(2, 2, 3);
  array.set(3, 3, 4);
  array.set(4, 4, 5);
  array.save("5x5_matrix_new");
}

main();
