import { IDocument } from "../document/IDocument";
import { Command } from "./Command";


export class StartCommand implements Command {
  canUndo = true;
  previousText: string;
  document: IDocument

  public constructor(previousText: string, document: IDocument) {
    this.previousText = previousText;
    this.document = document;
  }

  execute(): void {
    this.document.clear();
  }

  undo(): void {
    this.document.insert(0, this.previousText)
  }
}
