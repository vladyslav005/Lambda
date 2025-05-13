export class ErrorWithLocation extends Error {
  public startLine: number;
  public endLine: number;

  public startColumn: number;
  public endColumn: number;

  constructor(msg: string, location: number[]) {
    super(msg);
    Object.setPrototypeOf(this, SyntaxError.prototype);

    this.startLine = location[0];
    this.startColumn = location[1];

    this.endLine = location[2];
    this.endColumn = location[3];
  }
}


export class SyntaxError extends ErrorWithLocation {

}

export class TypeError extends ErrorWithLocation {
  constructor(msg: string, location: number[]) {
    super("Type error: " + msg, location);
  }
}

export class IndexError extends ErrorWithLocation {

}
