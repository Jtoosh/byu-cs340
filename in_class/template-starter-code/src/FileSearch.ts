import * as fs from "fs";
import { FileProcessor } from "./FileProcessor";

class FileSearch extends FileProcessor {
  private searchRegExp: RegExp;

  public static main(): void {
    let fileSearch: FileSearch;

    if (process.argv.length === 5) {
      fileSearch = new FileSearch(
        process.argv[2],
        process.argv[3],
        process.argv[4],
      );
    } else if (process.argv.length === 6 && process.argv[2].match("-r")) {
      fileSearch = new FileSearch(
        process.argv[3],
        process.argv[4],
        process.argv[5],
        true,
      );
    } else {
      this.usage();
      return;
    }

    fileSearch.run();
  }

  private static usage(): void {
    console.log(
      "USAGE: npx ts-node src/FileSearch.ts {-r} <dir> <file-pattern> <search-pattern>",
    );
  }
  private constructor(
    dirName: string,
    filePattern: string,
    searchPattern: string,
    recurse: boolean = false,
  ) {
    super(dirName, filePattern, recurse);
    this.searchRegExp = new RegExp(searchPattern);
  }

  private async run() {
    await super.traverseDirectory(this.dirName);
    console.log();
    console.log(`TOTAL MATCHES: ${super.totalCount}`);
  }

  protected lineAction(lines: string[]) {
    let count = 0;
    for (const line of lines) {
      if (this.searchRegExp.test(line)) {
        console.log(line);
        count++;
      }
    }
    return count;
  }
}

FileSearch.main();
