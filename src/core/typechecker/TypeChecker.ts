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
  ParenTypeContext, TupleContext, TupleProjectionContext, TupleTypeContext,
  TypeContext,
  VariableContext
} from "../antlr/LambdaCalcParser";
import {CharStream, CommonTokenStream, Parser, ParserRuleContext, ParseTree} from "antlr4";
import LambdaCalcLexer from "../antlr/LambdaCalcLexer";
import {IndexError, SyntaxError, TypeError} from "../errorhandling/customErrors";
import {Context} from "../context/Context";
import {eliminateOutParentheses, getTokenLocation, parseType} from "../utils";

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

    if (parseType(bodyType) instanceof FunctionTypeContext) {
      bodyType = '(' + bodyType + ')';
    }

    if (parseType(paramType) instanceof FunctionTypeContext) {
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

  /* IMPLEMENTS TUPLE RULE */
  visitTuple = (ctx: TupleContext): any => {
    console.log(`Visiting a tuple term ${ctx.getText()} ${ctx.getChildCount()}`);
    let type : string = '';

    for (let i = 1; i < ctx.getChildCount() - 1; i++) {
      if ( i % 2 !== 0) {
        let child = ctx.getChild(i);
        console.log(type);
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
    this.tupleTypeToArray(tupleTypeNode, tupleTypesArray);

    if (projectionIndex - 1 > tupleTypesArray.length - 1) {
      throw new IndexError(
          `Index '${projectionIndex}' is out range for tuple '${tupleName}' of type '${tupleType}'`,
          getTokenLocation(ctx))
    }

    const result = tupleTypesArray[projectionIndex - 1];
    console.log(`Visiting an tuple proj term ${ctx.getText()}`);

    return result;
  }

  // TODO : may cause errors ?
  public tupleTypeToArray(ctx: TypeContext, output: string[]): any {
    const left =  ctx.getChild(0);
    const right = ctx.getChild(2);

    output.push(eliminateOutParentheses(left).getText());

    if (right instanceof ParenTypeContext || right instanceof GreekTypeContext) {
      output.push(eliminateOutParentheses(right).getText());
    } else if (right instanceof TypeContext) {
      this.tupleTypeToArray(right, output);
    }
  }

  visitParentheses = (ctx: ParenthesesContext): any => {
    console.log("Visiting parentheses ", ctx.getText());
    return this.visitChildren(ctx);
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