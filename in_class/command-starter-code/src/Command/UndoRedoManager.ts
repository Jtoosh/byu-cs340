import { Command } from "./Command"


export class UndoRedoManager{
  private undoStack: Command[] = []
  private redoStack: Command[] = []

  public execute(command:Command){
    command.execute()
    if (command.canUndo){
      this.undoStack.push(command)
    }
  }

  public undo(){
    const commandToReverse = this.undoStack.pop()
    if (commandToReverse?.canUndo){
      commandToReverse.undo()
      this.redoStack.push(commandToReverse)
    }
  }

  public redo(){
    const commandToReapply = this.redoStack.pop()
    commandToReapply?.execute()
    if (commandToReapply !== undefined){
      this.undoStack.push(commandToReapply!)
    }
  }
    
}