import LambdaCalcVisitor from "../antlr/LambdaCalcVisitor";
import {
  ApplicationContext,
  BinaryCaseOfContext,
  BinaryVariantTypeContext,
  CaseOfContext,
  ExprContext,
  FunctionTypeContext,
  GlobalFunctionDeclarationContext,
  GlobalVariableDeclarationContext,
  GreekTypeContext,
  IfElseContext,
  InjectionContext,
  LambdaAbstractionContext,
  LeftRightInjContext,
  ListConsContext, ListHeadContext,
  ListIsNilContext,
  ListNilContext,
  ListTailContext,
  LiteralContext,
  ParenthesesContext,
  ParenTypeContext,
  RecordContext,
  RecordProjectionContext,
  RecordTypeContext,
  SequenceContext,
  TupleContext,
  TupleProjectionContext,
  TupleTypeContext,
  TypeAliasContext,
  TypeContext,
  VariableContext,
  VariantTypeContext,
  ListContext, ListTypeContext, WildCardContext
} from "../antlr/LambdaCalcParser";
import {ParseTree} from "antlr4";
import {IndexError, SyntaxError, TypeError} from "../errorhandling/customErrors";
import {Context} from "../context/Context";
import {eliminateOutParentheses, getTokenLocation, parseTypeAndElimParentheses, tupleTypeToArray} from "../utils";

// TODO : refactor: split file, split type checker class
// TODO : types priority
// TODO : showing aliases in tree ?
// TODO : flexible frame's size
// TODO : cover all errors for case

export class TypeChecker extends LambdaCalcVisitor<any> {
  private _globalContext: Context = new Context();
  private _localContext: Context = new Context();
  private _aliasContext: Context = new Context();

  constructor() {
    super();
    this.initBuiltInFunctions()
  }

  initBuiltInFunctions() {
    this.globalContext.addVariable("iszero", "Nat->Bool", undefined)
    this.globalContext.addVariable("pred", "Nat->Nat", undefined)
    this.globalContext.addVariable("succ", "Nat->Nat", undefined)
  }

  get globalContext(): Context {
    return this._globalContext;
  }

  set globalContext(value: Context) {
    this._globalContext = value;
  }

  get aliasContext(): Context {
    return this._aliasContext;
  }

  set aliasContext(value: Context) {
    this._aliasContext = value;
  }


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
    // set built-in functions
    this.initBuiltInFunctions()
  }

  clearAliasContext() {
    this._aliasContext = new Context();
  }

  visitExpr = (ctx: ExprContext): any => {
    console.log("Visiting an expression", ctx.getText());
    return this.visitChildren(ctx);
  };

  visitGlobalVariableDeclaration = (ctx: GlobalVariableDeclarationContext): string => {
    console.log("Visiting a global variable declaration", ctx.getText());

    let typeNode = ctx.getChild(2);
    let id: string = ctx.getChild(0).getText();

    this._globalContext.addVariable(
        id,
        this.visit(typeNode),
        getTokenLocation(ctx));

    return this.visitChildren(ctx);
  };

  visitGlobalFunctionDeclaration = (ctx: GlobalFunctionDeclarationContext): string => {
    let id: string = ctx.getChild(0).getText();

    const body = ctx.term();
    const bodyType = this.visit(body);

    if (!(body instanceof LambdaAbstractionContext || body instanceof InjectionContext || body instanceof  LeftRightInjContext)) {
      if (ctx.getChildCount() !== 6)
        throw new TypeError("Provide explicit type declaration", getTokenLocation(ctx))

      const declaredType = this.decodeAlias(ctx.getChild(4).getText());

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

  visitTypeAlias = (ctx: TypeAliasContext): void => {
    console.log("Visiting an alias", ctx.getText());

    this._aliasContext.addVariable(ctx.type_(0).getText(), ctx.type_(1).getText(), getTokenLocation(ctx));
  };

  /* IMPLEMENTS ABS RULE */
  visitLambdaAbstraction = (ctx: LambdaAbstractionContext): string => {
    console.log("Visiting lambda abstraction ", ctx.getText());
    const paramName = ctx.ID().getText();
    const paramTypeNode = ctx.type_(0);

    let declaredType = undefined;
    try {
      declaredType = this.visit(ctx.type_(1))
      declaredType = this.decodeAlias(declaredType);
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

    let paramType: string = this.decodeAlias(this.visit(paramTypeNode));

    let body: ParseTree = ctx.term();
    body = eliminateOutParentheses(body);

    this._localContext.addVariable(paramName, paramType, undefined);

    let bodyType = this.visit(body); // defines type, that function's body returns

    this._localContext.deleteVariable(paramName);

    let bodyTypeNode = parseTypeAndElimParentheses(bodyType);

    if (bodyTypeNode instanceof FunctionTypeContext ||
        bodyTypeNode instanceof TupleTypeContext ||
        bodyTypeNode instanceof RecordTypeContext ||
        bodyTypeNode instanceof ListTypeContext
    ) {
      bodyType = '(' + bodyType + ')';
    }

    if (parseTypeAndElimParentheses(paramType) instanceof FunctionTypeContext ||
        parseTypeAndElimParentheses(paramType) instanceof TupleTypeContext ||
        parseTypeAndElimParentheses(paramType) instanceof RecordTypeContext ||
        parseTypeAndElimParentheses(paramType) instanceof ListTypeContext
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

  visitWildCard = (ctx: WildCardContext) => {
    const paramTypeNode = ctx.type_(0);

    let declaredType = undefined;
    try {
      declaredType = this.visit(ctx.type_(1))
      declaredType = this.decodeAlias(declaredType);
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

    let paramType: string = this.decodeAlias(this.visit(paramTypeNode));

    let body: ParseTree = ctx.term();
    body = eliminateOutParentheses(body);


    let bodyType = this.visit(body); // defines type, that function's body returns


    let bodyTypeNode = parseTypeAndElimParentheses(bodyType);

    if (bodyTypeNode instanceof FunctionTypeContext ||
        bodyTypeNode instanceof TupleTypeContext ||
        bodyTypeNode instanceof RecordTypeContext ||
        bodyTypeNode instanceof ListTypeContext
    ) {
      bodyType = '(' + bodyType + ')';
    }

    if (parseTypeAndElimParentheses(paramType) instanceof FunctionTypeContext ||
        parseTypeAndElimParentheses(paramType) instanceof TupleTypeContext ||
        parseTypeAndElimParentheses(paramType) instanceof RecordTypeContext ||
        parseTypeAndElimParentheses(paramType) instanceof ListTypeContext
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
  visitVariable = (ctx: VariableContext): string => {
    console.log("Visiting variable", ctx.getText());

    const name: string = ctx.getText();
    let type;

    if (this._localContext.isVariableInContext((name))) {
      type = this._localContext.getType(name);
    } else if (this._globalContext.isVariableInContext((name))) {
      type = this._globalContext.getType(name);
    }

    if (!type)
      throw new TypeError(`Undefined variable : '${name}'`, getTokenLocation(ctx));

    type = this.decodeAlias(type);


    return type;
  };

  decodeAlias = (typeAlias: string): string => {
    const context = this._aliasContext.getAllElements()

    for (let i = 0; i < context.length; i++) {
      if (typeAlias.match(new RegExp(`\\b${context[i].name}\\b`, 'g')) !== null) {
        let aliasNode = parseTypeAndElimParentheses(context[i].type)
        console.log(`${typeAlias} ${context[i].name} {}`)
        if ((aliasNode instanceof FunctionTypeContext ||
                aliasNode instanceof TupleTypeContext ||
                aliasNode instanceof ListTypeContext ||
                aliasNode instanceof RecordTypeContext)
            && context[i].name !== typeAlias.replaceAll('List ', ''))
          typeAlias = typeAlias.replaceAll(new RegExp(`\\b${context[i].name}\\b`, 'g'), '(' + context[i].type + ')');
        else
          typeAlias = typeAlias.replaceAll(new RegExp(`\\b${context[i].name}\\b`, 'g'), context[i].type);

        i = -1;
      }
    }

    return typeAlias;
  };

  public encodeToAlias(typeAlias: string): string {

    const context = this._aliasContext.getAllElements()

    for (let i = 0; i < context.length; i++) {
      if (typeAlias.includes(`${context[i].type}`)) {

        let aliasNode = parseTypeAndElimParentheses(context[i].type)

        if ((aliasNode instanceof FunctionTypeContext ||
                aliasNode instanceof TupleTypeContext ||
                aliasNode instanceof ListTypeContext ||
                aliasNode instanceof RecordTypeContext)
            && context[i].name !== typeAlias.replaceAll('List ', ''))
          typeAlias = typeAlias.replaceAll(`(${context[i].type})`, context[i].name);

        typeAlias = typeAlias.replaceAll(`${context[i].type}`, context[i].name);

        i = -1;

      }
    }

    return typeAlias;
  }

  /* APP RULE */
  visitApplication = (ctx: ApplicationContext): string => {
    const funcName = ctx.getChild(0).getText();
    let func = ctx.getChild(0);
    const argumentName = ctx.getChild(1).getText();
    let argument = ctx.getChild(1);

    console.log("Visiting an application", ctx.getText(), ", left side:", funcName, ", right side: ", argumentName);

    func = eliminateOutParentheses(func);
    argument = eliminateOutParentheses(argument);

    let funcType: string | undefined;
    let argumentType: string | undefined;

    /* defining the type of term which is on the left side of application */
    funcType = this.findType(funcName, func)

    /* defining the type of term which is on the right side of application */
    argumentType = this.findType(argumentName, argument)


    if (funcType === undefined) {
      throw new Error(ctx.getText() + ": cannot define type of function");
    }

    if (argumentType === undefined) {
      throw new Error(ctx.getText() + ": cannot define type of argument");
    }

    let funcTypeTree = parseTypeAndElimParentheses(funcType);

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

  visitSequence = (ctx: SequenceContext) => {
    console.log("Visiting sequence", ctx.getText(), ctx.getChildCount());

    let returnType: string = '';
    for (let i = 0; i < ctx.getChildCount(); i++) {
      let childType = this.visit(ctx.getChild(i));
      returnType = childType ? childType : returnType;
    }

    return returnType;
  };

  /* TUPLE RULE */
  visitTuple = (ctx: TupleContext): string => {
    console.log(`Visiting a tuple term ${ctx.getText()} ${ctx.getChildCount()}`);
    let type: string = '';

    for (let i = 1; i < ctx.getChildCount() - 1; i++) {
      if (i % 2 !== 0) {
        let child = ctx.getChild(i);
        let childType = this.visit(child)
        let childTypeNode = parseTypeAndElimParentheses(childType);
        if (childTypeNode instanceof TupleTypeContext ||
            childTypeNode instanceof FunctionTypeContext ||
            childTypeNode instanceof ListTypeContext ||
            childTypeNode instanceof RecordTypeContext
        ) {
          childType = '(' + childType + ')'
        }
        type = type.concat(childType, '*');
      }
    }

    type = type.substring(0, type.lastIndexOf('*'));

    return type;

  }

  /* PROJECTION RULE */
  visitTupleProjection = (ctx: TupleProjectionContext): string => {
    const tupleName = ctx.getChild(0).getText();
    const tupleNode = ctx.getChild(0);
    let tupleType: string | undefined = undefined;

    const projectionIndex = parseInt(ctx.getChild(2).getText());

    tupleType = this.findType(tupleName, tupleNode);

    if (tupleType === undefined) {
      throw new Error("Unable to define type of tuple: " + tupleName);
    }

    if (!(parseTypeAndElimParentheses(tupleType) instanceof TupleTypeContext)) {
      throw new TypeError(
          `Tuple projection can't be used with term of type'${tupleType}'`,
          getTokenLocation(ctx));
    }

    const tupleTypeNode = parseTypeAndElimParentheses(tupleType);

    const tupleTypesArray: string[] = [];
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
  visitRecord = (ctx: RecordContext): string => {
    console.log(`Visiting a record ${ctx.getText()} ${ctx.getChildCount()}`);

    const childCount = ctx.getChildCount();

    const labelsSet = new Set<string>();

    let recordType: string = '';
    for (let i = 1; i < childCount; i += 4) {
      const labelNode = ctx.getChild(i);
      const valueNode = ctx.getChild(i + 2);

      let valueType = this.visit(valueNode)
      let valueTypeNode = parseTypeAndElimParentheses(valueType);

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
  visitRecordProjection = (ctx: RecordProjectionContext): string => {
    console.log("Visiting a record projection: " + ctx.getText());

    const recordName = ctx.getChild(0).getText();
    const recordNode = ctx.getChild(0);
    const label = ctx.ID().getText()

    let recordType: string | undefined;

    recordType = this.findType(recordName, recordNode);

    if (recordType === undefined)
      throw new Error(`Unable to find type of '${recordName}'`);

    const recordTypeNode = parseTypeAndElimParentheses(recordType);

    if (!(recordTypeNode instanceof RecordTypeContext)) {
      throw new TypeError(`Record projection can't be used with term of type '${recordType}'`,
          getTokenLocation(ctx))
    }

    for (let i = 1; i < recordTypeNode.getChildCount(); i += 4) {
      const labelNode = recordTypeNode.getChild(i);
      const typeNode = recordTypeNode.getChild(i + 2);

      if (labelNode.getText() === label) {
        return typeNode.getText();
      }
    }

    throw new IndexError(`Record '${recordName}' has not key '${label}'`,
        getTokenLocation(ctx))
  };

  visitLeftRightInj = (ctx: LeftRightInjContext) => {
    console.log("Visiting a lr inj", ctx.getText());

    const variantTypeNode = parseTypeAndElimParentheses(this.decodeAlias(ctx.type_().getText()));

    if (!(variantTypeNode instanceof BinaryVariantTypeContext))
      throw new TypeError(`Injection should have variant type but '${variantTypeNode.getText()}' declared`,
          getTokenLocation(ctx));

    const leftType = eliminateOutParentheses(variantTypeNode.getChild(0)).getText();
    const rightType = eliminateOutParentheses(variantTypeNode.getChild(2)).getText();

    const termNode = ctx.term();
    const termType = this.visit(termNode);

    const injType = ctx.getChild(0).getText();

    if (injType === "inl" && termType !== leftType) {
        throw new TypeError(
            `Term '${termNode.getText()}' should have type '${leftType}' to perform left injection with ${variantTypeNode.getText()}, but got ${termType}`,
            getTokenLocation(ctx));

    } else if (injType === "inr" && termType !== rightType) {
        throw new TypeError(
            `Term '${termNode.getText()}' should have type '${rightType}' to perform right injection with ${variantTypeNode.getText()}, but got ${termType}`,
            getTokenLocation(ctx));
    }

    return variantTypeNode.getText();
  };

  visitInjection = (ctx: InjectionContext): string => {
    console.log("Visiting injection ", ctx.getText());

    const variantTypeNode = parseTypeAndElimParentheses(this.decodeAlias(ctx.type_().getText()));

    if (!(variantTypeNode instanceof VariantTypeContext))
      throw new TypeError(`Injection should have variant type but '${variantTypeNode.getText()}' declared`,
          getTokenLocation(ctx));

    const label = ctx.ID().getText();

    const bodyNode = ctx.term();

    const bodyType = this.visit(bodyNode)

    let injectionDeclaredLabelType: string | undefined;

    for (let i = 1; i < variantTypeNode.getChildCount() - 1; i += 4) {
      let injLabel = variantTypeNode.getChild(i);
      if (injLabel.getText() === label) {
        injectionDeclaredLabelType = eliminateOutParentheses(variantTypeNode.getChild(i + 2)).getText()
      }
    }

    if (injectionDeclaredLabelType === undefined) {
      throw new TypeError(`Variant type '${variantTypeNode}' has no label ${label}`,
          getTokenLocation(ctx))
    } else if (injectionDeclaredLabelType !== bodyType) {
      throw new TypeError(`Label '${label}' has type '${injectionDeclaredLabelType}' but provided term has type: '${bodyType}'`,
          getTokenLocation(ctx))
    }

    return variantTypeNode.getText();
  };

  visitParentheses = (ctx: ParenthesesContext): string => {
    console.log("Visiting parentheses ", ctx.getText());
    return this.visit(ctx.getChild(1));
  };

  visitRecordType = (ctx: RecordTypeContext): string => {
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

  visitCaseOf = (ctx: CaseOfContext): string => {
    console.log("Visiting a case of ", ctx.getText());

    const varNode = ctx.term(0);
    const varName = varNode.getText();

    const variantType = this.findType(varName, varNode);

    if (variantType === undefined)
      throw new TypeError(`Cant define type of '${varName}'`, getTokenLocation(ctx));

    const variantTypeNode = parseTypeAndElimParentheses(variantType);
    if (!(variantTypeNode instanceof VariantTypeContext))
      throw new TypeError(`'${varName}' should have an variant type to be used in case of`, getTokenLocation(ctx));

    const variantLabels = this.extractLabels(variantTypeNode);
    const coveredLabels = new Set<string>();


    let caseType: string | undefined;

    for (let i = 4; i < ctx.getChildCount(); i += 8) {
      const labelNode = ctx.getChild(i);
      const label = labelNode.getText();

      if (coveredLabels.has(label))
        throw new TypeError(`Label '${label}' can be used only once in case of construction`, getTokenLocation(ctx))

      const variableNode = ctx.getChild(i + 2);
      const variable = variableNode.getText();
      const variableType = variantLabels
          .find(e => e.name === label)?.type;

      const term = ctx.getChild(i + 5);

      if (variableType === undefined)
        throw new TypeError(`Type '${variantType}' does not contain label '${label}'`, getTokenLocation(ctx))

      this.localContext.addVariable(variable, variableType, undefined)

      const termType = this.visit(term)

      this.localContext.deleteVariable(variable)

      if (caseType === undefined)
        caseType = termType

      if (caseType !== termType)
        throw new TypeError(`All cases should have the same type, but case '${label}' has type '${termType}', while other's type is '${caseType}'`,
            getTokenLocation(ctx))

      coveredLabels.add(labelNode.getText());
    }

    for (const el of variantLabels) {
      if (!coveredLabels.has(el.name)) {
        throw new TypeError(`Label '${el.name}' with '${el.type}', not covered in case of construction`,
            getTokenLocation(ctx));
      }
    }
    if (caseType === undefined)
      throw new Error();

    return caseType;
  };

  visitBinaryCaseOf = (ctx: BinaryCaseOfContext): string => {

    const varNode = ctx.term(0);
    const varName = varNode.getText();

    const variantType = this.findType(varName, varNode);

    if (variantType === undefined)
      throw new TypeError(`Cant define type of '${varName}'`, getTokenLocation(ctx));

    const variantTypeNode = parseTypeAndElimParentheses(variantType);
    if (!(variantTypeNode instanceof BinaryVariantTypeContext))
      throw new TypeError(`'${varName}' should have an binary variant type to be used in case of`, getTokenLocation(ctx));

    const leftType = variantTypeNode.getChild(0).getText();
    const rightType = variantTypeNode.getChild(2).getText();

    const variantLabels = [
        { name: 'inl', type: leftType },
        { name: 'inr', type: rightType },
    ];
    const coveredLabels = new Set<string>();

    let caseType: string | undefined;

    for (let i = 3; i < ctx.getChildCount(); i += 5) {
      const labelNode = ctx.getChild(i);
      const label = labelNode.getText();

      if (coveredLabels.has(label))
        throw new TypeError(`Label '${label}' can be used only once in case of construction`, getTokenLocation(ctx))


      const variableNode = ctx.getChild(i + 1);
      const variable = variableNode.getText();
      const variableType = variantLabels
          .find(e => e.name === label)?.type;

      const term = ctx.getChild(i + 3);
      if (variableType === undefined)
        throw new TypeError(`Type '${variantType}' does not contain label '${label}'`, getTokenLocation(ctx))

      this.localContext.addVariable(variable, variableType, undefined)

      const termType = this.visit(term)

      this.localContext.deleteVariable(variable)

      if (caseType === undefined)
        caseType = termType

      if (caseType !== termType)
        throw new TypeError(`All cases should have the same type, but case '${label}' has type '${termType}', while other's type is '${caseType}'`,
            getTokenLocation(ctx))

      coveredLabels.add(labelNode.getText());
    }

    for (const el of variantLabels) {
      if (!coveredLabels.has(el.name)) {
        throw new TypeError(`Label '${el.name}' with '${el.type}', not covered in case of construction`,
            getTokenLocation(ctx));
      }
    }

    if (caseType === undefined)
      throw new Error();

    return caseType;
  };

  visitLiteral = (ctx: LiteralContext): string => {
    console.log("Visiting a literal", ctx.getText());
    const literal = ctx.getText().toLowerCase();
    if (literal === "true" || literal === "false") {
      return "Bool"
    } else if (!/[a-zA-Z]/.test(literal) && !isNaN(parseInt(literal))) {
      return "Nat"
    }

    throw new TypeError(`Can't define type of : '${literal}'`, getTokenLocation(ctx));

  };

  visitIfElse = (ctx: IfElseContext): string => {
    console.log("Visiting a condition", ctx.getText());

    const termList = ctx.term_list();
    const ifTermType : string = this.visit(ctx.term(1));

    for (let i = 0; i < termList.length; i++) {
      const child = termList[i];
      const childType: string = this.visit(child);

      if (i % 2 !== 0 || i === termList.length - 1) {
        if (ifTermType !== childType)
          throw new TypeError(
              `All branches of if condition must return the same type, but got '${ifTermType}' and '${childType}'`,
              getTokenLocation(child));
      } else {
          if (childType !== "Bool" )
            throw new TypeError(`Contition mus have type 'Bool', but got '${childType}'`,
                getTokenLocation(child))
      }
    }

    return ifTermType
  };

  extractLabels = (typeNode: TypeContext) => {
    const variantLabels = new Array<{ name: string, type: string }>();
    for (let i = 1; i < typeNode.getChildCount() - 1; i += 4) {
      let lbl = typeNode.getChild(i);
      let type = typeNode.getChild(i + 2).getText()
      variantLabels.push({name: lbl.getText(), type: type});
    }

    return variantLabels;
  }

  visitVariantType = (ctx: VariantTypeContext): string => {
    console.log("Visiting a variant type", ctx.getText());


    return ctx.getText()
  };

  visitBinaryVariantType = (ctx: BinaryVariantTypeContext): string => {
    console.log("Visiting a variant type", ctx.getText());


    return ctx.getText()
  };

  visitTupleType = (ctx: TupleTypeContext): any => {
    console.log("Visiting a tuple type", ctx.getText());

    return ctx.getText();
  }

  visitListType = (ctx: ListTypeContext)=> {
    return ctx.getText()
  }

  visitGreekType = (ctx: GreekTypeContext): any => {
    // console.log("Visiting a Greek type", ctx.getText());
    return ctx.getText();
  };

  visitFunctionType = (ctx: FunctionTypeContext): any => {
    let returnType = ctx.getChild(2);
    let argumentType = ctx.getChild(0)

    let result: string;

    if (returnType instanceof FunctionTypeContext) {
      result = this.visit(argumentType) + '->(' + this.visit(returnType) + ')';
    } else {
      result = this.visit(argumentType) + '->' + this.visit(returnType)
    }

    return result;
  };

  visitParenType = (ctx: ParenTypeContext): any => {
    let typeTextWithoutBrackets = this.visit(ctx.getChild(1));
    return '(' + typeTextWithoutBrackets + ')';
  };

  visitListNil = (ctx: ListNilContext): any => {
    console.log("Visiting a nil", ctx.getText());
    const elType = this.decodeAlias(ctx.type_().getText())

    return 'List ' + elType
  };

  visitListCons = (ctx: ListConsContext): any => {
    console.log("Visiting a cons cons", ctx.getText());

    const declaredElType = this.decodeAlias(ctx.type_().getText());

    const list = ctx.term(1);
    const el = ctx.term(0);

    const listType: string = this.visit(list);
    const elType: string = this.visit(el);

    if (!(parseTypeAndElimParentheses(listType) instanceof ListTypeContext))
      throw new TypeError(`CONS can't be used with term of type '${listType}'`,
          getTokenLocation(ctx));

    if (declaredElType !== parseTypeAndElimParentheses(listType).getChild(1).getText())
      throw new TypeError(`List is of type '${listType}' but you have delared '[${declaredElType}]'`,
          getTokenLocation(ctx));

    if (elType !== declaredElType)
      throw new TypeError(`Can't add element of type '${elType}' to list of type '${listType}'`,
          getTokenLocation(ctx));

    return listType;
  };

  visitListIsNil = (ctx: ListIsNilContext): any => {
    console.log("Visiting a isnil", ctx.getText());

    const declaredElType = this.decodeAlias(ctx.type_().getText());

    const list = ctx.term();

    const listType: string = this.visit(list);
    const elType = parseTypeAndElimParentheses(listType).getChild(1).getText()

    if (!(parseTypeAndElimParentheses(listType) instanceof ListTypeContext))
      throw new TypeError(`ISNIL can't be used with term of type '${listType}'`,
          getTokenLocation(ctx));

    if (declaredElType !== parseTypeAndElimParentheses(listType).getChild(1).getText())
      throw new TypeError(`List is of type '${listType}' but you have delared '[${declaredElType}]'`,
          getTokenLocation(ctx));

    if (elType !== declaredElType)
      throw new TypeError(`Can't add element of type '${elType}' to list of type '${listType}'`,
          getTokenLocation(ctx));

    return "Bool";
  };

  visitListTail = (ctx: ListTailContext): any => {
    console.log("Visiting a tail", ctx.getText());

    const declaredElType = this.decodeAlias(ctx.type_().getText());

    const list = ctx.term();

    const listType: string = this.visit(list);
    const elType = parseTypeAndElimParentheses(listType).getChild(1).getText()

    if (!(parseTypeAndElimParentheses(listType) instanceof ListTypeContext))
      throw new TypeError(`TAIL can't be used with term of type '${listType}'`,
          getTokenLocation(ctx));

    if (declaredElType !== parseTypeAndElimParentheses(listType).getChild(1).getText())
      throw new TypeError(`List is of type '${listType}' but you have delared '[${declaredElType}]'`,
          getTokenLocation(ctx));

    if (elType !== declaredElType)
      throw new TypeError(`Can't add element of type '${elType}' to list of type '${listType}'`,
          getTokenLocation(ctx));

    return listType;

  };

  visitListHead = (ctx: ListHeadContext): any => {
    console.log("Visiting a head", ctx.getText());
    const declaredElType = this.decodeAlias(ctx.type_().getText());

    const list = ctx.term();

    const listType: string = this.visit(list);
    const elType = parseTypeAndElimParentheses(listType).getChild(1).getText()

    if (!(parseTypeAndElimParentheses(listType) instanceof ListTypeContext))
      throw new TypeError(`HEAD can't be used with term of type '${listType}'`,
          getTokenLocation(ctx));


    if (declaredElType !== elType)
      throw new TypeError(`List is of type '${elType}' but you have delared '${declaredElType}`,
          getTokenLocation(ctx));

    if (elType !== declaredElType)
      throw new TypeError(`Can't add element of type '${elType}' to list of type '${listType}'`,
          getTokenLocation(ctx));

    return elType;
  };

  visitList = (ctx : ListContext): any => {

    return this.visit(ctx.getChild(0))
  }

  findType = (name: string, node: ParseTree): string | undefined => {
    let type: string | undefined;
    if (this._localContext.isVariableInContext(name)) {
      type = this._localContext.getType(name);
    } else if (this._globalContext.isVariableInContext(name)) {
      type = this._globalContext.getType(name);
    } else {
      type = this.visit(node);
    }

    if (type) {
      type = this.decodeAlias(type);

      const typeNode = parseTypeAndElimParentheses(type);

      type = eliminateOutParentheses(typeNode).getText();
    }

    return type;
  }
}