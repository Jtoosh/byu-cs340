import { IDocument } from "../document/IDocument";
import { Command } from "./Command";


export class InsertCommand implements Command {
  canUndo = true;

  private insertIndex: number;
  private sequenceToInput: string;
  private document: IDocument;

  public constructor(index: number, sequence: string, document: IDocument) {
    this.insertIndex = index;
    this.sequenceToInput = sequence;
    this.document = document;
  }

  execute(): void {
    this.document.sequence;
    this.document.insert(this.insertIndex, this.sequenceToInput);
  }
  undo(): void {
    this.document.insert(this.insertIndex, "")
  }
}
