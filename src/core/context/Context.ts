export class ContextElement  {

  public declarationLocation : number[] | undefined;

  constructor(name: string, type: string, declarationLocation: number[] | undefined ) {
    this._name = name;
    this._type = type;
    this.declarationLocation = declarationLocation;
  }

  private _name: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  private _type: string;

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }
}

export class Context {
  private types: Array<ContextElement> = new Array<ContextElement>();

  addVariable(name: string, type: string, location : number[] | undefined): void {
    this.types.push(new ContextElement(name, type, location));
  }

  /* returns type of first occurrence of the variable */
  getType(name: string): string {
    for (let i = this.types.length - 1; i >= 0; i--) {
      let element = this.types[i];
      if (element.name === name) {
        return element.type;
      }
    }

    throw new Error(`Variable '${name}' is not in context`);
  }

  getDeclarationLocation(name: string): number[] | undefined {
    for (let i = this.types.length - 1; i >= 0; i--) {
      let element = this.types[i];
      if (element.name === name) {
        return element.declarationLocation;
      }
    }
  }

  isVariableInContext(name: string): boolean {
    for (let i = this.types.length - 1; i >= 0; i--) {
      let element = this.types[i];
      if (element.name === name) {
        return true;
      }
    }

    return false;
  }

  /* deletes first occurrence of the variable, starts from the end */
  deleteVariable(name: string): ContextElement | null {
    for (let i = this.types.length - 1; i >= 0; i--) {
      let element = this.types[i];
      if (element.name === name) {
        this.types.splice(i, 1);
        return element;
      }
    }
    return null;
  }

  getAllElements() : ContextElement[] {
    return this.types;
  }

  isEmpty(): boolean {
    return this.types.length === 0;
  }


}
