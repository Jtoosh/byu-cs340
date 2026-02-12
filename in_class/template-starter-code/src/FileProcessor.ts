import * as fs from "fs";
import * as path from "path";

export abstract class FileProcessor {
  private _dirName: string;
  private _fileRegExp: RegExp;
  private _recurse: boolean;

  private _totalCount: number = 0;

  protected constructor(
    dirName: string,
    filePattern: string,
    recurse: boolean = false,
  ) {
    this._dirName = dirName;
    this._fileRegExp = new RegExp(filePattern);
    this._recurse = recurse;
  }

  // Getters
  protected get dirName() {
    return this._dirName;
  }

  protected get fileRegExp() {
    return this._fileRegExp;
  }

  protected get recurse() {
    return this._recurse;
  }

  protected get totalCount() {
    return this._totalCount;
  }

  protected set totalCount(newValue: number) {
    this._totalCount = newValue;
  }

  protected async traverseDirectory(filePath: string) {
    if (!this.isDirectory(filePath)) {
      this.nonDirectory(filePath);
      return;
    }

    if (!this.isReadable(filePath)) {
      this.unreadableDirectory(filePath);
      return;
    }

    const files = fs.readdirSync(filePath);

    for (let file of files) {
      const fullPath = path.join(filePath, file);
      if (this.isFile(fullPath)) {
        if (this.isReadable(fullPath)) {
          await this.traverseFile(fullPath);
        } else {
          this.unreadableFile(fullPath);
        }
      }
    }

    if (this.recurse) {
      for (let file of files) {
        const fullPath = path.join(filePath, file);
        if (this.isDirectory(fullPath)) {
          await this.traverseDirectory(fullPath);
        }
      }
    }
  }

  protected async traverseFile(filePath: string) {
    if (this.fileRegExp.test(filePath)) {
      try {
        const fileContent: string = await fs.promises.readFile(
          filePath,
          "utf-8",
        );

        const lines: string[] = fileContent.split(/\r?\n/);

        const fileCount = this.lineAction(lines);
        this._totalCount += fileCount;
        console.log(`${fileCount} ${filePath} `);
      } catch (error) {
        console.log(`File ${filePath} is unreadable`);
      }
    }
  }

  protected abstract lineAction(lines: string[]): number;

  protected isDirectory(path: string): boolean {
    try {
      return fs.statSync(path).isDirectory();
    } catch (error) {
      return false;
    }
  }

  protected isFile(path: string): boolean {
    try {
      return fs.statSync(path).isFile();
    } catch (error) {
      return false;
    }
  }

  protected isReadable(path: string): boolean {
    try {
      fs.accessSync(path, fs.constants.R_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  protected nonDirectory(dirName: string): void {
    console.log(`${dirName} is not a directory`);
  }

  protected unreadableDirectory(dirName: string): void {
    console.log(`Directory ${dirName} is unreadable`);
  }

  protected unreadableFile(fileName: string): void {
    console.log(`File ${fileName} is unreadable`);
  }
}
