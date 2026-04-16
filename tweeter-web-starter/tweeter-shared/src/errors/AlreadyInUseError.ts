export class AlreadyInUseError extends Error{
  constructor(message: string) {
    super(message);
    this.name = "AlreadyInUseError"
  }
  
}