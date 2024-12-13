import LambdaCalcVisitor from "../antlr/LambdaCalcVisitor";
import LambdaCalcParser, {
  ApplicationContext,
  ExprContext,
  FunctionTypeContext,
  GlobalFunctionDeclarationContext,
  GlobalVariableDeclarationContext,
  GreekTypeContext,
  LambdaAbstractionContext,
  ParenthesesContext,
  ParenTypeContext,
  RecordContext,
  RecordProjectionContext,
  RecordTypeContext, SequenceContext,
  TupleContext,
  TupleProjectionContext,
  TupleTypeContext,
  TypeContext,
  VariableContext
} from "../antlr/LambdaCalcParser";
import {CharStream, CommonTokenStream, Parser, ParserRuleContext, ParseTree} from "antlr4";
import LambdaCalcLexer from "../antlr/LambdaCalcLexer";
import {IndexError, SyntaxError, TypeError} from "../errorhandling/customErrors";
import {Context} from "../context/Context";
import {eliminateOutParentheses, getTokenLocation, parseType, tupleTypeToArray} from "../utils";

// TODO : refactor: split file, split type checker class
// TODO : types priority


export class TypeChecker extends LambdaCalcVisitor<any> {

  private _globalContext: Context = new Context();

  get globalContext(): Context {
    return this._globalContext;
  }

  set globalContext(value: Context) {
    this._globalContext = value;
  }

  private _localContext: Context = new Context();

  get localContext(): Context {
    return this._localContext;
  }

  set localContext(value: Context) {
    this._localContext = value;
  }

  clearLocalContext() {
    this._localContext = new Context();
  }

  clearGlobalContext() {
    this._globalContext = new Context();
  }

  visitExpr = (ctx: ExprContext): any => {
    console.log("Visiting an expression", ctx.getText());
    return this.visitChildren(ctx);
  };

  visitGlobalVariableDeclaration = (ctx: GlobalVariableDeclarationContext): any => {
    console.log("Visiting a global variable declaration", ctx.getText());

    let typeNode = ctx.getChild(2);
    let id: string = ctx.getChild(0).getText();

    this._globalContext.addVariable(
        id,
        this.visit(typeNode),
        getTokenLocation(ctx));

    return this.visitChildren(ctx);
  };

  visitGlobalFunctionDeclaration = (ctx: GlobalFunctionDeclarationContext): any => {
    let id: string = ctx.getChild(0).getText();

    const body = ctx.term();
    const bodyType = this.visit(body);

    if ( !(body instanceof LambdaAbstractionContext)  ) {
      if (ctx.getChildCount() !== 6)
        throw new TypeError("Provide explicit type declaration", getTokenLocation(ctx))

      const declaredType = ctx.getChild(4).getText();

      if (bodyType !== declaredType)
        throw new TypeError(
            `term ${body.getText()} is of type ${bodyType}, but declared type is ${declaredType}`,
            getTokenLocation(ctx)
            );

    }

    this._globalContext.addVariable(id, bodyType, getTokenLocation(ctx), true, ctx);

    console.log("Visiting a global function declaration", ctx.getText() /*, id, declaredType*/);

    return this.visitChildren(ctx);
  };

  /* IMPLEMENTS ABS RULE */
  visitLambdaAbstraction = (ctx: LambdaAbstractionContext): any => {
    console.log("Visiting lambda abstraction ", ctx.getText());
    const paramName = ctx.ID().getText();
    const paramTypeNode = ctx.type_(0);

    let declaredType = undefined;
    try {
      declaredType = this.visit(ctx.type_(1));
    } catch (e) {

    }

    let parentCtx = ctx.parentCtx;
    while (parentCtx instanceof ParenthesesContext) {
      parentCtx = parentCtx.parentCtx;
      if (parentCtx === undefined)
        break;
    }

    if (!declaredType && ctx.parentCtx && !(parentCtx instanceof LambdaAbstractionContext)) {
      throw new SyntaxError(`Provide explicit type declaration for term ${ctx.getText()}`,
          getTokenLocation(ctx)
      )
    }

    let paramType: string;

    paramType = this.visit(paramTypeNode)

    let body: ParseTree = ctx.term();

    this._localContext.addVariable(paramName, paramType, undefined);

    body = eliminateOutParentheses(body);

    let bodyType = this.visit(body); // defines type, that function's body returns

    this._localContext.deleteVariable(paramName);

    if (parseType(bodyType) instanceof FunctionTypeContext ||
      parseType(bodyType) instanceof TupleTypeContext
    ) {
      bodyType = '(' + bodyType + ')';
    }

    if (parseType(paramType) instanceof FunctionTypeContext ||
        parseType(paramType) instanceof TupleTypeContext
    ) {
      paramType = '(' + paramType + ')';
    }

    const absType = paramType + "->" + bodyType;

    if (declaredType && absType !== declaredType) {
      throw new TypeError(
          `Abstraction '${ctx.getText()}' has type '${absType}', that doesn't match declared type '${declaredType}'`,
          getTokenLocation(ctx)
      );
    }

    return absType
  };

  /* IMPLEMENTS VAR RULE */
  visitVariable = (ctx: VariableContext): any => {
    console.log("Visiting variable", ctx.getText());

    const name: string = ctx.getText();

    if (this._localContext.isVariableInContext((name))) {
      return this._localContext.getType(name);
    } else if (this._globalContext.isVariableInContext((name))) {
      return this._globalContext.getType(name);
    }

    throw new TypeError(`Undefined variable : '${name}'`, getTokenLocation(ctx));
  };

  /* IMPLEMENTS APP RULE */
  visitApplication = (ctx: ApplicationContext): any => {
    const funcName = ctx.getChild(0).getText();
    let func = ctx.getChild(0);
    const argumentName = ctx.getChild(1).getText();
    let argument = ctx.getChild(1);

    console.log("Visiting an application", ctx.getText(), ", left side:", funcName, ", right side: ", argumentName);

    func = eliminateOutParentheses(func);
    argument = eliminateOutParentheses(argument);

    let funcType: string | undefined ;
    let argumentType: string | undefined ;

    /* defining the type of term which is on the left side of application */
    if (this._localContext.isVariableInContext(funcName)) {
      funcType = this._localContext.getType(funcName);
    } else if (this._globalContext.isVariableInContext(funcName)) {
      funcType = this._globalContext.getType(funcName);
    } else {
      funcType = this.visit(func);
    }

    /* defining the type of term which is on the right side of application */
    if (this._localContext.isVariableInContext(argumentName)) {
      argumentType = this._localContext.getType(argumentName);
    } else if (this._globalContext.isVariableInContext(argumentName)) {
      argumentType = this._globalContext.getType(argumentName);
    } else {
      argumentType = this.visit(argument);
    }

    if (funcType === undefined) {
      throw new Error(ctx.getText() + ": cannot define type of function");
    }

    if (argumentType === undefined) {
      throw new Error(ctx.getText() + ": cannot define type of argument");
    }

    let funcTypeTree = parseType(funcType);

    if (!(funcTypeTree instanceof FunctionTypeContext)) {
      throw new TypeError(
          `'${funcName}' : has type '${funcType}', that is not a function type, cant use application there`,
         getTokenLocation(ctx)
      );
    }

    /* separate input and return types */
    const funcReturnTypeNode = funcTypeTree.getChild(2);
    const argumentExpectedTypeNode = funcTypeTree.getChild(0);
    let argumentExpectedType: string = eliminateOutParentheses(argumentExpectedTypeNode).getText();
    let funcReturnType: string = eliminateOutParentheses(funcReturnTypeNode).getText();

    /* checking type of argument */
    if (argumentType !== argumentExpectedType) {
      throw new TypeError(
          `Types mismatch: term '${funcName}' expects argument of type '${argumentExpectedType}', but given argument '${argumentName}' is of type '${argumentType}'`,
          getTokenLocation(ctx)
      );
    }

    return funcReturnType;
  };

  visitSequence =  (ctx: SequenceContext) => {
    console.log("Visiting sequence", ctx.getText(), ctx.getChildCount());

    let returnType: string = '';
    for (let i = 0; i < ctx.getChildCount(); i++) {
      let childType = this.visit(ctx.getChild(i));
      returnType = childType ? childType : returnType;
    }

    return returnType;
  };




  /* IMPLEMENTS TUPLE RULE */
  visitTuple = (ctx: TupleContext): any => {
    console.log(`Visiting a tuple term ${ctx.getText()} ${ctx.getChildCount()}`);
    let type : string = '';

    for (let i = 1; i < ctx.getChildCount() - 1; i++) {
      if ( i % 2 !== 0) {
        let child = ctx.getChild(i);
        let childType = this.visit(child)
        let childTypeNode = parseType(childType);
        if ( childTypeNode instanceof TupleTypeContext ||
            childTypeNode instanceof FunctionTypeContext ) {
          childType = '(' + childType + ')'
        }
        type = type.concat(childType, '*');
      }
    }

    type = type.substring(0, type.lastIndexOf('*'));

    return type;

  }

  /* IMPLEMENTS PROJECTION RULE */
  visitTupleProjection = (ctx: TupleProjectionContext): any => {
    const tupleName = ctx.getChild(0).getText();
    const tupleNode = ctx.getChild(0);
    let tupleType : string | undefined = undefined;

    const projectionIndex = parseInt(ctx.getChild(2).getText());

    if (this._localContext.isVariableInContext(tupleName)) {
      tupleType = this._localContext.getType(tupleName);
    } else if (this._globalContext.isVariableInContext(tupleName)) {
      tupleType = this._globalContext.getType(tupleName);
    } else {
      tupleType = this.visit(tupleNode);
    }

    if (tupleType === undefined) {
      throw new Error("Unable to define type of tuple: " + tupleName);
    }

    const tupleTypeNode = parseType(tupleType);

    const tupleTypesArray : string[] = [];
    tupleTypeToArray(tupleTypeNode, tupleTypesArray);

    if (projectionIndex - 1 > tupleTypesArray.length - 1) {
      throw new IndexError(
          `Index '${projectionIndex}' is out range for tuple '${tupleName}' of type '${tupleType}'`,
          getTokenLocation(ctx))
    }

    const result = tupleTypesArray[projectionIndex - 1];
    console.log(`Visiting an tuple proj term ${ctx.getText()}`);

    return result;
  }

  /* RECORDS RULE */
  visitRecord = (ctx: RecordContext): any => {
    console.log(`Visiting a record ${ctx.getText()} ${ctx.getChildCount()}`);

    const childCount = ctx.getChildCount();

    const labelsSet = new Set<string>();

    let recordType : string = '';
    for (let i = 1; i < childCount; i += 4) {
      const labelNode = ctx.getChild(i);
      const valueNode = ctx.getChild(i+2);

      let valueType = this.visit(valueNode)
      let valueTypeNode = parseType(valueType);

      if (labelsSet.has(labelNode.getText())) {
        throw new SyntaxError(`Duplicate key '${labelNode.getText()}' in record`,
          getTokenLocation(ctx))
      }

      labelsSet.add(labelNode.getText());
      recordType += `${labelNode.getText()}:${valueType},`
    }

    recordType = '<' + recordType.substring(0, recordType.lastIndexOf(',')) + '>';

    return recordType;
  };

  /* RECORD PROJ RULE */
  visitRecordProjection = (ctx: RecordProjectionContext): any => {
    console.log("Visiting a record projection: " + ctx.getText());

    const recordName = ctx.getChild(0).getText();
    const recordNode = ctx.getChild(0);
    const label = ctx.ID().getText()

    let recordType : string | undefined;

    if (this._localContext.isVariableInContext(recordName)) {
      recordType = this._localContext.getType(recordName);
    } else if (this._globalContext.isVariableInContext(recordName)) {
      recordType = this._globalContext.getType(recordName);
    } else {
      recordType = this.visit(recordNode);
    }

    if (recordType === undefined) {
      throw new Error(`Unable to find type of '${recordName}'`);
    }

    const recordTypeNode = parseType(recordType);

    for (let i = 1; i < recordTypeNode.getChildCount(); i += 4) {
      const labelNode = recordTypeNode.getChild(i);
      const typeNode = recordTypeNode.getChild(i+2);

      if (labelNode.getText() === label) {
        return typeNode.getText();
      }
    }

    throw new IndexError(`Record '${recordName}' has not key '${label}'`,
        getTokenLocation(ctx))
  };


  visitParentheses = (ctx: ParenthesesContext): any => {
    console.log("Visiting parentheses ", ctx.getText());

    // return this.visitChildren(ctx);
    return this.visit(ctx.getChild(1));
  };

  visitRecordType = (ctx: RecordTypeContext): any => {
    console.log("Visiting a record type", ctx.getText());
    const labelsSet = new Set<string>();
    for (let i = 1; i < ctx.getChildCount(); i += 4) {
      const labelNode = ctx.getChild(i);
      if (labelsSet.has(labelNode.getText())) {
        throw new SyntaxError(`Duplicate key '${labelNode.getText()}' in record`,
            getTokenLocation(ctx))
      }
      labelsSet.add(labelNode.getText());
    }

    return ctx.getText();
  };

  visitTupleType = (ctx: TupleTypeContext): any => {
    console.log("Visiting a tuple type", ctx.getText());

    return ctx.getText();
  }

  visitGreekType = (ctx: GreekTypeContext): any => {
    // console.log("Visiting a Greek type", ctx.getText());
    return ctx.getText();
  };

  visitFunctionType = (ctx: FunctionTypeContext): any => {
    let returnType = ctx.getChild(2);
    let argumentType = ctx.getChild(0)
    // console.log("Visiting a function type", argumentType.getText(), '|', returnType.getText());

    let result: string;

    if (returnType instanceof FunctionTypeContext) {
      result = this.visit(argumentType) + '->' + '(' + this.visit(returnType) + ')';
    } else {
      result = this.visit(argumentType) + '->' + this.visit(returnType)
    }

    return result;
  };

  visitParenType = (ctx: ParenTypeContext): any => {
    let typeTextWithoutBrackets = this.visit(ctx.getChild(1));
    return '(' + typeTextWithoutBrackets + ')';
  };

}