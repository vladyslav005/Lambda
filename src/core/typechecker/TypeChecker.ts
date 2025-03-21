import LambdaCalcVisitor from "../antlr/LambdaCalcVisitor";
import {
  AdditionContext,
  ApplicationContext,
  BinaryCaseOfContext,
  BinaryVariantTypeContext,
  CaseOfContext,
  ComparisonContext,
  ExprContext,
  FixContext,
  FunctionTypeContext,
  GlobalFunctionDeclarationContext,
  GlobalVariableDeclarationContext,
  GreekTypeContext,
  IfElseContext,
  InjectionContext,
  LambdaAbstractionContext,
  LeftRightInjContext,
  ListConsContext,
  ListConstructorContext,
  ListContext,
  ListHeadContext,
  ListIsNilContext,
  ListNilContext,
  ListTailContext,
  ListTypeContext,
  LiteralContext,
  MultiplicationContext,
  ParenthesesContext,
  ParenTypeContext,
  PowerContext,
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
  WildCardContext
} from "../antlr/LambdaCalcParser";
import {ParserRuleContext, ParseTree} from "antlr4";
import {IndexError, SyntaxError, TypeError} from "../errorhandling/customErrors";
import {Context} from "../context/Context";
import {eliminateOutParentheses, getTokenLocation, parseTypeAndElimParentheses, tupleTypeToArray} from "../utils";
import hash from "object-hash";

// TODO : refactor: split file, split type checker class
// TODO : types priority
// TODO : showing aliases in tree ?
// TODO : flexible frame's size
// TODO : cover all errors for case

export class TypeChecker extends LambdaCalcVisitor<any> {
  private cache: Map<string, string>

  constructor() {
    super();
    this.initBuiltInFunctions()
    this.cache = new Map<string, string>();
  }

  private _aliasContext: Context = new Context();

  get aliasContext(): Context {
    return this._aliasContext;
  }

  private _globalContext: Context = new Context();

  get globalContext(): Context {
    return this._globalContext;
  }

  private _predefinedFunctionsContext: Context = new Context();

  get predefinedFunctionsContext(): Context {
    return this._predefinedFunctionsContext;
  }

  private _localContext: Context = new Context();

  get localContext(): Context {
    return this._localContext;
  }

  set localContext(value: Context) {
    this._localContext = value;
  }

  visit(tree: ParseTree): any {

    const hash = this.hashParserContext(tree);

    if (this.cache.has(hash)) {
      return this.cache.get(hash);
    }

    const type = super.visit(tree);
    this.cache.set(hash, type);

    return type;
  }

  hashParserContext(ctx: ParseTree): string {
    if (!(ctx instanceof ParserRuleContext)) {
      return "";
    }

    function serialize(node: ParserRuleContext): any {
      return {
        rule: node.constructor.name || "UnknownRule",
        text: node.getText().trim(),
        children: node.children?.map((child) =>
            child instanceof ParserRuleContext ? serialize(child) : child.getText()?.trim() || ""
        ) || [],
      };
    }

    return hash(serialize(ctx));
  }


  initBuiltInFunctions() {
    this._predefinedFunctionsContext.addVariable("iszero", "Nat->Bool", undefined)
    this._predefinedFunctionsContext.addVariable("pred", "Nat->Nat", undefined)
    this._predefinedFunctionsContext.addVariable("succ", "Nat->Nat", undefined)
  }

  clearLocalContext() {
    this._localContext = new Context();
  }

  clearContexts() {
    this._aliasContext = new Context();
    this._localContext = new Context();
    this._globalContext = new Context();
    // set built-in functions
    this.initBuiltInFunctions()
  }

  clearCache() {
    this.cache.clear();
  }

  visitExpr = (ctx: ExprContext): any => {
    console.log("Visiting an expression", ctx.getText());
    return this.visitChildren(ctx);
  };

  visitGlobalVariableDeclaration = (ctx: GlobalVariableDeclarationContext): string => {
    console.log("Visiting a global variable declaration", ctx.getText());

    let typeNode = ctx.type_();
    this.validateType(typeNode)

    let id: string = ctx.getChild(0).getText();

    this._globalContext.addVariable(
        id,
        this.visit(typeNode),
        getTokenLocation(ctx));

    return this.visitChildren(ctx);
  };

  visitGlobalFunctionDeclaration = (ctx: GlobalFunctionDeclarationContext): void => {
    let id: string = ctx.getChild(0).getText();

    const body = ctx.term();
    const bodyType = this.visit(body);
    if (this._globalContext.isVariableInContext(id)) {
      const varType = this.findType(id, ctx.getChild(0))
      const bodyType = this.findType('', body)
      if (bodyType !== varType) {
        throw new TypeError(`Cant assign term of type '${bodyType}' to variable of type '${varType}'`, getTokenLocation(ctx))
      }
    } else {

      const declaredType = this.findType('', ctx.getChild(4));

      if (bodyType !== declaredType)
        throw new TypeError(
            `Term ${body.getText()} is of type ${bodyType}, but declared type is ${declaredType}`,
            getTokenLocation(ctx)
        );

      this._globalContext.addVariable(id, bodyType, getTokenLocation(ctx), true, ctx);

      console.log("Visiting a global function declaration", ctx.getText() /*, id, declaredType*/);
    }
  };

  visitTypeAlias = (ctx: TypeAliasContext): void => {
    console.log("Visiting an alias", ctx.getText());
    const type = ctx.type_().getText()
    const alias = ctx.ID().getText();

    this.validateType(ctx.type_())
    const regex = new RegExp(`\\b(${alias})\\b`, "g");
    if (type.match(regex)) {
      throw new TypeError(`Recursive types are not supported: ${type}`,
          getTokenLocation(ctx));
    }

    this._aliasContext.addVariable(alias, type, getTokenLocation(ctx));
  };

  visitAddition = (ctx: AdditionContext): string => {
    const first = ctx.term(0);
    const second = ctx.term(1);

    const firstType = this.visit(first);
    const secondType = this.visit(second);

    if (firstType !== 'Nat')
      throw new TypeError(`Operands of arithmetic operations must have type 'Nat', but got '${firstType}'`,
          getTokenLocation(first));

    if (secondType !== 'Nat')
      throw new TypeError(`Operands of arithmetic operations must have type 'Nat', but got '${secondType}'`,
          getTokenLocation(second));

    return 'Nat'
  };

  visitMultiplication = (ctx: MultiplicationContext): string => {
    const first = ctx.term(0);
    const second = ctx.term(1);

    const firstType = this.visit(first);
    const secondType = this.visit(second);

    if (firstType !== 'Nat')
      throw new TypeError(`Operands of arithmetic operations must have type 'Nat', but got '${firstType}'`,
          getTokenLocation(first));

    if (secondType !== 'Nat')
      throw new TypeError(`Operands of arithmetic operations must have type 'Nat', but got '${secondType}'`,
          getTokenLocation(second));

    return 'Nat'
  };

  visitPower = (ctx: PowerContext): string => {
    const first = ctx.term(0);
    const second = ctx.term(1);

    const firstType = this.visit(first);
    const secondType = this.visit(second);

    if (firstType !== 'Nat')
      throw new TypeError(`Operands of arithmetic operations must have type 'Nat', but got '${firstType}'`,
          getTokenLocation(first));

    if (secondType !== 'Nat')
      throw new TypeError(`Operands of arithmetic operations must have type 'Nat', but got '${secondType}'`,
          getTokenLocation(second));

    return 'Nat'
  };

  visitComparison = (ctx: ComparisonContext): string => {
    const first = ctx.term(0);
    const second = ctx.term(1);

    const firstType = this.visit(first);
    const secondType = this.visit(second);

    if (firstType !== 'Nat')
      throw new TypeError(`Operands of comparison operations must have type 'Nat', but got '${firstType}'`,
          getTokenLocation(first));

    if (secondType !== 'Nat')
      throw new TypeError(`Operands of comparison operations must have type 'Nat', but got '${secondType}'`,
          getTokenLocation(second));

    return 'Bool'
  };

  /* IMPLEMENTS ABS RULE */
  visitLambdaAbstraction = (ctx: LambdaAbstractionContext): string => {
    console.log("Visiting lambda abstraction ", ctx.getText());
    const paramName = ctx.ID().getText();
    const paramTypeNode = ctx.type_();



    let parentCtx = ctx.parentCtx;
    while (parentCtx instanceof ParenthesesContext) {
      parentCtx = parentCtx.parentCtx;
      if (parentCtx === undefined)
        break;
    }


    let paramType: string = this.decodeAlias(this.visit(paramTypeNode));

    let body: ParseTree = ctx.term();
    body = eliminateOutParentheses(body);

    this._localContext.addVariable(paramName, paramType, undefined);

    let bodyType = this.visit(body); // defines type, that function's body returns

    this._localContext.deleteVariable(paramName);

    let bodyTypeNode = parseTypeAndElimParentheses(bodyType);

    if (bodyTypeNode instanceof FunctionTypeContext
    ) {
      // bodyType = '(' + bodyType + ')';
    }

    if (parseTypeAndElimParentheses(paramType) instanceof FunctionTypeContext
    ) {
      paramType = '(' + paramType + ')';
    }

    const absType = paramType + "->" + bodyType;


    return absType
  };

  visitWildCard = (ctx: WildCardContext) => {
    const paramTypeNode = ctx.type_();

    let parentCtx = ctx.parentCtx;
    while (parentCtx instanceof ParenthesesContext) {
      parentCtx = parentCtx.parentCtx;
      if (parentCtx === undefined)
        break;
    }

    let paramType: string = this.decodeAlias(this.visit(paramTypeNode));

    let body: ParseTree = ctx.term();
    body = eliminateOutParentheses(body);


    let bodyType = this.visit(body); // defines type, that function's body returns


    let bodyTypeNode = parseTypeAndElimParentheses(bodyType);

    if (bodyTypeNode instanceof FunctionTypeContext

    ) {
      // bodyType = '(' + bodyType + ')';
    }

    if (parseTypeAndElimParentheses(paramType) instanceof FunctionTypeContext
    ) {
      paramType = '(' + paramType + ')';
    }

    const absType = paramType + "->" + bodyType;

    return absType
  };



  /* IMPLEMENTS VAR RULE */
  visitVariable = (ctx: VariableContext): string => {
    console.log("Visiting variable", ctx.getText());

    const name: string = ctx.getText();
    let type = undefined;

    if (this._localContext.isVariableInContext(name)) {
      type = this._localContext.getType(name);
    } else if (this._globalContext.isVariableInContext(name)) {
      type = this._globalContext.getType(name);
    } else if (this._predefinedFunctionsContext.isVariableInContext(name)) {
      type = this._predefinedFunctionsContext.getType(name);
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
    const childCount = ctx.term_list().length;
    const termList = ctx.term_list();
    for (let i = 0; i < childCount; i++) {
      let childType = this.visit(termList[i]);
      if (i !== childCount - 1 && childType !== "Unit")
        throw new TypeError(`All terms in sequence, except for last, should have Unit type but got '${childType}'`,
            getTokenLocation(ctx))

      returnType = childType ? childType : returnType;
    }

    let declaredType = this.decodeAlias(ctx.type_().getText());

    const declaredTypeNode = parseTypeAndElimParentheses(declaredType);

    declaredType = this.visit(declaredTypeNode);

    if (declaredType !== returnType)
      throw new TypeError(
          `Term ${ctx.getText()} is of type ${returnType}, but declared type is ${declaredType}`,
          getTokenLocation(ctx))


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
        if (childTypeNode instanceof FunctionTypeContext || childTypeNode instanceof BinaryVariantTypeContext) {
          childType = '(' + childType + ')';
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
    let tupleType: string | undefined;

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

    return this.visit(variantTypeNode);
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

    return this.visit(variantTypeNode);
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
    let retType = ctx.getText();

    ctx.type__list().forEach(item => {
      retType = retType.replace(item.getText(), this.visit(item));
    })

    return retType;
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
      {name: 'inl', type: leftType},
      {name: 'inr', type: rightType},
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
    } else if (literal === "unit") {
      return "Unit"
    } else if (!/[a-zA-Z]/.test(literal) && !isNaN(parseInt(literal))) {
      return "Nat"
    }

    throw new TypeError(`Can't define type of : '${literal}'`, getTokenLocation(ctx));

  };

  visitIfElse = (ctx: IfElseContext): string => {
    console.log("Visiting a condition", ctx.getText());

    const termList = ctx.term_list();
    const ifTermType: string = this.visit(ctx.term(1));

    for (let i = 0; i < termList.length; i++) {
      const child = termList[i];
      const childType: string = this.visit(child);

      if (i % 2 !== 0 || i === termList.length - 1) {
        if (ifTermType !== childType)
          throw new TypeError(
              `All branches of if condition must return the same type, but got '${ifTermType}' and '${childType}'`,
              getTokenLocation(child));
      } else {
        if (childType !== "Bool")
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

    return ctx.type__list().map(c => this.visit(c)).join('+')
  };

  visitTupleType = (ctx: TupleTypeContext): any => {
    console.log("Visiting a tuple type", ctx.getText());

    return ctx.type__list().map(c => this.visit(c)).join('*')
  }

  visitListType = (ctx: ListTypeContext) => {
    return ctx.getText()
  }

  visitGreekType = (ctx: GreekTypeContext): any => {
    // console.log("Visiting a Greek type", ctx.getText());
    return ctx.getText();
  };

  visitFunctionType = (ctx: FunctionTypeContext): any => {
    let returnType = this.visit(ctx.type_(1));
    let argumentType = this.visit(ctx.type_(0));
    let returnTypeNode = parseTypeAndElimParentheses(returnType);
    let argumentTypeNode = parseTypeAndElimParentheses(argumentType);

    // if (returnTypeNode instanceof FunctionTypeContext) {
    //   returnType = '(' + returnType + ')';
    // }

    if (argumentTypeNode instanceof FunctionTypeContext) {
      argumentType = '(' + argumentType + ')';
    }

    return argumentType + '->' + returnType;
  };

  visitParenType = (ctx: ParenTypeContext): any => {
    let typeTextWithoutBrackets = this.visit(ctx.getChild(1));
    const childType: string = ctx.getChild(1).constructor.name;
    const parentType: string | undefined = ctx.parentCtx?.constructor.name;

    if (parentType === undefined)
      return typeTextWithoutBrackets

    const childTypePriority = this.getPriority(childType);
    const parentTypePriority = this.getPriority(parentType);

    if (childTypePriority < parentTypePriority && childTypePriority !== 0 && parentTypePriority !== 0)
      return '(' + typeTextWithoutBrackets + ')';

    return typeTextWithoutBrackets
  };

  getPriority = (type: string): number => {
    return TypesPriority[type as keyof typeof TypesPriority] ?? 0;
  };

  visitListNil = (ctx: ListNilContext): any => {
    console.log("Visiting a nil", ctx.getText());
    const elType = this.decodeAlias(ctx.type_().getText())

    return 'List ' + elType
  };

  visitListCons = (ctx: ListConsContext): any => {
    console.log("Visiting a cons cons", ctx.getText());

    const declaredElType = this.decodeAlias(ctx.type_().getText());

    return `(${declaredElType})->(List ${declaredElType})->(List ${declaredElType})`;
  };

  visitListConstructor = (ctx: ListConstructorContext) => {
    console.log("Visiting a cons cons", ctx.getText());

    const termList = ctx.term_list();

    let listType = this.findType('', termList[0]);
    for (let i = 2; i < termList.length; i++) {
      const elType = this.findType('', termList[0]);
      if (elType === undefined)
        throw new Error()

      if (listType !== elType) {
        throw new TypeError(`Can't construct list form elements of type '${listType}' and '${elType}' `,
            getTokenLocation(ctx));
      }
    }

    return 'List ' + listType;
  }

  visitListIsNil = (ctx: ListIsNilContext): any => {
    console.log("Visiting a isnil", ctx.getText());

    const declaredElType = this.decodeAlias(ctx.type_().getText());
    return `(List ${declaredElType})->Bool`;
  };

  visitListTail = (ctx: ListTailContext): any => {
    console.log("Visiting a tail", ctx.getText());

    const declaredElType = this.decodeAlias(ctx.type_().getText());

    return `List ${declaredElType}->${declaredElType}`;
  };

  visitListHead = (ctx: ListHeadContext): any => {
    console.log("Visiting a head", ctx.getText());
    const declaredElType = this.decodeAlias(ctx.type_().getText());

    return `List ${declaredElType}->${declaredElType}`;
  };

  visitList = (ctx: ListContext): any => {

    return this.visit(ctx.getChild(0))
  }


  visitFix = (ctx: FixContext) => {
    console.log("Visiting a fix", ctx.getText());
    const termNode = ctx.term();

    const termType = this.findType('', termNode);
    if (termType === undefined)
      throw new Error()

    const termTypeNode = parseTypeAndElimParentheses(termType);

    if (!(termTypeNode instanceof FunctionTypeContext)) {
      throw new TypeError(`Can't use fix with term of type '${termType}'`,
          getTokenLocation(ctx))
    }

    const termArgTypeNode = eliminateOutParentheses(termTypeNode.getChild(0));
    const termRetTypeNode = eliminateOutParentheses(termTypeNode.getChild(2));

    const termArgType = termArgTypeNode.getText();
    const termRetType = termRetTypeNode.getText();

    if (termRetType !== termArgType) {
      throw new TypeError(`Can't use fix with term of type '${termType}'`,
          getTokenLocation(ctx))
    }

    return termRetType;
  }

  validateType(ctx: TypeContext) {
    if ((ctx instanceof RecordTypeContext) || (ctx instanceof VariantTypeContext)) {
      const idList = ctx.ID_list().map(id => id.getText());
      const idSet = new Set(idList);
      if (idSet.size !== idList.length) {
        throw new TypeError(`Duplicate labels in type definition '${ctx.getText()}'`
            , getTokenLocation(ctx))
      }
    }
  }

  findType = (name: string, node: ParseTree): string | undefined => {
    let type: string | undefined;
    if (this._localContext.isVariableInContext(name)) {
      type = this._localContext.getType(name);
    } else if (this._globalContext.isVariableInContext(name)) {
      type = this._globalContext.getType(name);
    } else if (this._predefinedFunctionsContext.isVariableInContext(name)) {
      type = this._predefinedFunctionsContext.getType(name);
    } else {
      type = this.visit(node);
    }

    if (type) {
      type = this.decodeAlias(type);

      const typeNode = parseTypeAndElimParentheses(type);

      type = this.visit(typeNode);
    }
    return type;
  }
}


const TypesPriority = {
  FunctionTypeContext: 1,
  VariantTypeContext: 2,
  TupleTypeContext: 3,
}