
export class SyntaxError extends Error {
  public startLine: number;
  public endLine: number;

  public startColumn: number;
  public endColumn: number;

  constructor(msg: string, startLine: number, endLine: number,  startColumn: number, endColumn: number) {
    super(msg);
    Object.setPrototypeOf(this, SyntaxError.prototype);

    this.startLine = startLine;
    this.startColumn = startColumn;

    this.endLine = endLine;
    this.endColumn = endColumn;
  }
}


export class TypeError extends Error {

  public startLine: number;
  public endLine: number;

  public startColumn: number;
  public endColumn: number;

  constructor(msg: string, startLine: number, endLine: number,  startColumn: number, endColumn: number) {
    super(msg);
    Object.setPrototypeOf(this, SyntaxError.prototype);

    this.startLine = startLine;
    this.startColumn = startColumn;

    this.endLine = endLine;
    this.endColumn = endColumn;

  }
}