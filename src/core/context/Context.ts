import {ParserRuleContext} from "antlr4";

export interface ContextElement {
  name: string;
  type: string;
  declarationLocation?: number[] | undefined;
  isExpandable?: boolean;
  declarationNode?: ParserRuleContext
  subtype?: string
}

export class Context {
  private types: Array<ContextElement> = new Array<ContextElement>();

  addVariable(
      name: string, type: string, location: number[] | undefined,
      isExpandable?: boolean, declarationNode?: ParserRuleContext, subtype?: string): void {

    this.types.push({
      name: name,
      type: type,
      declarationLocation: location,
      isExpandable: isExpandable,
      declarationNode: declarationNode,
      subtype: subtype
    })
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

  getAllElements(): ContextElement[] {
    return this.types;
  }

  getContextInfo(name: string): ContextElement | undefined {
    for (let i = this.types.length - 1; i >= 0; i--) {
      let element = this.types[i];
      if (element.name === name) {
        return element;
      }
    }
  }


  isEmpty(): boolean {
    return this.types.length === 0;
  }


}
