import LambdaCalcVisitor from "../antlr/LambdaCalcVisitor";
import {
  AdditionContext,
  ApplicationContext,
  BinaryCaseOfContext,
  CaseOfContext,
  ComparisonContext,
  ExprContext,
  FixContext,
  GlobalFunctionDeclarationContext,
  GlobalVariableDeclarationContext,
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
  LiteralContext,
  MultiplicationContext,
  ParenthesesContext,
  PowerContext,
  RecordContext,
  RecordProjectionContext,
  SequenceContext,
  TupleContext,
  TupleProjectionContext,
  TypeAliasContext,
  VariableContext,
  WildCardContext
} from "../antlr/LambdaCalcParser";
import {TypeChecker} from "../typechecker/TypeChecker";
import {ParserRuleContext, ParseTree} from "antlr4";
import {Context, ContextElement} from "../context/Context";
import {eliminateOutParentheses, getTokenLocation, parseTypeAndElimParentheses, tupleTypeToArray} from "../utils";
import {TypeError} from "../errorhandling/customErrors";

export interface ProofNode {
  type: string;
  wrappedConclusion: string;
  wrappedConclusionWithAlias: string;
  unwrappedConclusion: string;
  unwrappedConclusionWithAlias: string;
  rule: string;
  tokenLocation: number[],
  declarationLocation?: number[];
  premises?: ProofNode[];
  expandedPremises?: ProofNode[];
  ctxExtension: CtxStackElement
  root: boolean;
  isExpandable: boolean;
  isExpanded?: boolean;
  isGammaUnwrapped?: boolean;
  aliasesPresent?: boolean; // only for root node
  aliasCtx?: Context;
  globalCtx?: Context;
  nodeNumber?: number;
}

export class TreeGenerator extends LambdaCalcVisitor<any> {

  private typeChecker: TypeChecker = new TypeChecker();

  private localContext: Context;

  private contextExtension: string;
  private contextExtensionWithAlies: string;

  private empty: ProofNode = {
    type: '',
    wrappedConclusion: '',
    wrappedConclusionWithAlias: '',
    unwrappedConclusion: '',
    unwrappedConclusionWithAlias: '',
    rule: '',
    tokenLocation: [0, 0, 0, 0],
    root: false,
    ctxExtension: {
      number: 0,
      wrapped:'',
      wrappedWithAlias: '',
      unwrapped:'',
      unwrappedWithAlias: '',
      declaration:'',
      isTaken:false
    },
    isExpandable: false,
  };
  private _proofTree: ProofNode | undefined;

  constructor() {
    super();
    this._proofTree = undefined;
    this.localContext = new Context();
    this.contextExtension = "";
    this.contextExtensionWithAlies = "";
  }

  public generateTree(AST: ParseTree): ProofNode | undefined {
    this.localContext = new Context()

    this.visit(AST);

    if (this._proofTree !== undefined) {
      this._proofTree.root = true;
      this._proofTree.aliasesPresent = !this.typeChecker.aliasContext.isEmpty()
      this._proofTree.globalCtx = this.typeChecker.globalContext;
      this._proofTree.aliasCtx = this.typeChecker.aliasContext;

      return this._proofTree;
    }

    const result = this._proofTree;

    this._proofTree = undefined;
    this.typeChecker.clearContexts()
    this.typeChecker.clearCache();
    this.contextExtension = "";
    this.contextExtensionWithAlies = "";

    return result;
  }

  visitGlobalVariableDeclaration = (ctx: GlobalVariableDeclarationContext): void => {
    this.typeChecker.visit(ctx)
  };

  visitGlobalFunctionDeclaration = (ctx: GlobalFunctionDeclarationContext): void => {
    this.typeChecker.visit(ctx)
  };

  visitTypeAlias = (ctx: TypeAliasContext): void => {
    this.typeChecker.visit(ctx)
  };

  visitExpr = (ctx: ExprContext): any => {
    ctx.globalDecl_list().map(d => this.typeChecker.visit(d));
    this._proofTree = this.visit(ctx.terms());
  };

  visitAddition = (ctx: AdditionContext): ProofNode => {
    const ctxExtension = this.takeExtensionCtx()

    const premises: ProofNode[] = ctx.term_list().map(t => this.visit(t));
    const type = 'Nat'
    const cncns = this.generateConclusionStr(premises, ` ${ctx.getChild(1).getText()} `)
    const unwrappedConclusion = cncns.conclusion;
    const unwrappedConclusionWithAlias = cncns.conclusionWithAlias;
    const ruleName = `T-${ctx.getChild(1).getText() === '+' ? 'add' : 'sub'}`

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias: `$ \\vdash ${unwrappedConclusionWithAlias} : ${type}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: ruleName,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises,
      ctxExtension: ctxExtension,

    } as ProofNode;
  };

  visitMultiplication = (ctx: MultiplicationContext): ProofNode => {
    const ctxExtension = this.takeExtensionCtx()

    const premises: ProofNode[] = ctx.term_list().map(t => this.visit(t));
    const type = 'Nat'
    const cncns = this.generateConclusionStr(premises, `§`)
    const unwrappedConclusion = cncns.conclusion;
    const unwrappedConclusionWithAlias = cncns.conclusionWithAlias;
    const ruleName = `T-mult`

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias: `$ \\vdash ${unwrappedConclusionWithAlias} : ${type}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: ruleName,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises,
      ctxExtension: ctxExtension,
    } as ProofNode;
  };

  visitPower = (ctx: PowerContext): ProofNode => {
    const ctxExtension = this.takeExtensionCtx()

    const premises: ProofNode[] = ctx.term_list().map(t => this.visit(t));
    const type = 'Nat'
    const cncns = this.generateConclusionStr(premises, `${ctx.getChild(1).getText()}`)
    const unwrappedConclusion = cncns.conclusion;
    const unwrappedConclusionWithAlias = cncns.conclusionWithAlias;
    const ruleName = `T-pow`

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias: `$ \\vdash ${unwrappedConclusionWithAlias} : ${type}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: ruleName,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises,
      ctxExtension: ctxExtension,
    } as ProofNode;
  };

  visitComparison = (ctx: ComparisonContext): ProofNode => {
    const ctxExtension = this.takeExtensionCtx()

    const premises: ProofNode[] = ctx.term_list().map(t => this.visit(t));
    const type = 'Bool'

    const operator = ctx.getChild(1).getText();
    let texOperator = ctx.getChild(1).getText();

    switch (operator) {
      case '>': {
        texOperator = "~";
        break;
      }
      case '<': {
        texOperator = "`";
        break;
      }
      case '>=': {
        texOperator = "\\geq";
        break;
      }
      case '<=': {
        texOperator = "\\leq";
        break;
      }
      case '==': {
        texOperator = "=";
        break;
      }
    }

    const cncns = this.generateConclusionStr(premises, `${texOperator}`)
    const unwrappedConclusion = cncns.conclusion;
    const unwrappedConclusionWithAlias = cncns.conclusionWithAlias;
    const ruleName = `T-comp`

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias: `$ \\vdash ${unwrappedConclusionWithAlias} : ${type}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: ruleName,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises,
      ctxExtension: ctxExtension,
    } as ProofNode;
  };

  visitLambdaAbstraction = (ctx: LambdaAbstractionContext): ProofNode => {
    const ctxExtension = this.takeExtensionCtx()

    console.log("T-abs: " + ctx.getText())

    this.localContext.addVariable(ctx.ID().getText(),
        this.typeChecker.decodeAlias(this.typeChecker.visit(ctx.type_())), undefined)
    this.typeChecker.localContext = this.localContext;
    this.updateContextExtension(true)

    const type = this.typeChecker.visit(ctx);
    const typeWithAlias = this.typeChecker.encodeToAlias(type)
    const body = ctx.term();

    const argumentType = ctx.type_().getText()
    const argumentTypeWithAlias = this.typeChecker.encodeToAlias(argumentType)

    const premises = [this.visit(body)]

    const cncs = this.generateConclusionStr(premises);
    const unwrappedConclusion = `λ ${ctx.ID().getText()}:${argumentType}.${cncs.conclusion}`;
    const unwrappedConclusionWithAlias = `λ ${ctx.ID().getText()}:${argumentTypeWithAlias}.${cncs.conclusionWithAlias}`;

    this.localContext.deleteVariable(ctx.ID().getText())
    this.typeChecker.clearLocalContext();
    this.updateContextExtension(false);

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: "(T-abs)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false,
      ctxExtension: ctxExtension,
    } as ProofNode;
  };


  visitWildCard = (ctx: WildCardContext) => {
    console.log("T-abs: " + ctx.getText())
    const ctxExtension = this.takeExtensionCtx()


    const type = this.typeChecker.visit(ctx);
    const typeWithAlias = this.typeChecker.encodeToAlias(type)
    const body = ctx.term();

    const argumentType = ctx.type_().getText()
    const argumentTypeWithAlias = this.typeChecker.encodeToAlias(argumentType)

    const premises = [this.visit(body)]

    const cncs = this.generateConclusionStr(premises);
    const unwrappedConclusion = `λ _:${argumentType}.${cncs.conclusion}`;
    const unwrappedConclusionWithAlias = `λ _:${argumentTypeWithAlias}.${cncs.conclusionWithAlias}`;

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: "(T-wildcard)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false,
      ctxExtension: ctxExtension,
    } as ProofNode;
  };


  visitVariable = (ctx: VariableContext): ProofNode => {
    console.log("Var: " + ctx.getText())
    const ctxExtension = this.takeExtensionCtx()

    const type = (this.typeChecker.visit(ctx));
    const typeWithAlias = this.typeChecker.encodeToAlias(type);

    let ctxInfo = this.getContextInfo(ctx.getText())
    const varName = ctx.getText()

    return !this.typeChecker.predefinedFunctionsContext.isVariableInContext(ctx.getText()) ? {
          type: type,
          wrappedConclusion: `$ \\vdash ${ctx.getText()} : ${(type)}`,
          wrappedConclusionWithAlias: `$ \\vdash ${ctx.getText()} : ${(typeWithAlias)}`,
          unwrappedConclusion: varName,
          unwrappedConclusionWithAlias: varName,
          rule: "(T-var)",
          root: false,
          context: ctx,
          tokenLocation: getTokenLocation(ctx),
          declarationLocation: ctxInfo.declarationLocation,
          isExpandable: ctxInfo.isExpandable,
          expandedPremises: ctxInfo.declarationNode ? [
            this.visit(ctxInfo.declarationNode.getChild(2))
          ] : undefined,
          ctxExtension: ctxExtension,
          premises: [
            {
              type: type,
              wrappedConclusion: `$ \\vdash ${ctx.getText()} : ${type}\\in$`,
              wrappedConclusionWithAlias: `$ \\vdash ${ctx.getText()} : ${typeWithAlias}\\in$`,
              unwrappedConclusion: varName,
              unwrappedConclusionWithAlias: varName,
              rule: "",
              root: false,
              tokenLocation: getTokenLocation(ctx),
              declarationLocation: ctxInfo.declarationLocation,
              isExpandable: ctxInfo.isExpandable,
              ctxExtension: this.takeExtensionCtx(),
            }
          ],
        } as ProofNode :
        {
          type: type,
          wrappedConclusion: `${ctx.getText()} : ${(type)}`,
          wrappedConclusionWithAlias: `${ctx.getText()} : ${(typeWithAlias)}`,
          unwrappedConclusion: varName,
          unwrappedConclusionWithAlias: varName,
          rule: `(T-${ctx.getText()})`,
          root: false,
          context: ctx,
          tokenLocation: getTokenLocation(ctx),
          declarationLocation: ctxInfo.declarationLocation,
          isExpandable: ctxInfo.isExpandable,
          expandedPremises: ctxInfo.declarationNode ? [
            this.visit(ctxInfo.declarationNode.getChild(2))
          ] : undefined,
          premises: [
            {
              type: type,
              wrappedConclusion: `\\Gamma \\vdash ${ctx.getText()} : ${type}\\in \\Gamma`,
              wrappedConclusionWithAlias: `\\Gamma \\vdash ${ctx.getText()} : ${typeWithAlias}\\in \\Gamma`,
              unwrappedConclusion: varName,
              unwrappedConclusionWithAlias: varName,
              rule: "",
              root: false,
              tokenLocation: getTokenLocation(ctx),
              declarationLocation: ctxInfo.declarationLocation,
              isExpandable: ctxInfo.isExpandable,
              ctxExtension: this.takeExtensionCtx(),
            }
          ],          ctxExtension: ctxExtension,
        } as ProofNode;
  };

  visitApplication = (ctx: ApplicationContext): ProofNode => {
    console.log("App: " + ctx.getText())

    const ctxExtension = this.takeExtensionCtx()
    const type = this.typeChecker.visit(ctx);
    const typeWithAlias = this.typeChecker.encodeToAlias(type);

    const func = ctx.term(0)

    if (func instanceof ListContext)
      return this.visit(func);

    if (func instanceof ApplicationContext && func.term(0) instanceof ListContext)
      return this.visit(func.term(0));

    const premises = this.visitChildren(ctx)

    const cncs = this.generateConclusionStr(premises)

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${cncs.conclusion} : ${type}`,
      wrappedConclusionWithAlias: `$ \\vdash ${cncs.conclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: cncs.conclusion,
      unwrappedConclusionWithAlias: cncs.conclusionWithAlias,
      rule: "(T-app)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises,
      ctxExtension: ctxExtension,
    } as ProofNode;
  };

  visitSequence = (ctx: SequenceContext): ProofNode => {
    console.log("Seq " + ctx.getText())
    const ctxExtension = this.takeExtensionCtx()

    this.typeChecker.visit(ctx);

    if (ctx.term_list().length === 1)
      return this.visit(ctx.term_list()[0])
    else {
      const type = this.typeChecker.visit(ctx);
      const typeWithAlias = this.typeChecker.encodeToAlias(type);

      const premises =  ctx.term_list().map(t => this.visit(t))
      const cncs = this.generateConclusionStr(premises, "; ")

      return {
        type: type,
        wrappedConclusion: `$ \\vdash ${cncs.conclusion} : ${type}`,
        wrappedConclusionWithAlias:
            `$ \\vdash ${cncs.conclusionWithAlias} : ${typeWithAlias}`,
        rule: "(T-seq)",
        unwrappedConclusion: cncs.conclusion,
        unwrappedConclusionWithAlias: cncs.conclusionWithAlias,
        context: ctx,
        tokenLocation: getTokenLocation(ctx),
        root: false,
        premises: premises,
        isExpandable: false,
        ctxExtension: ctxExtension,
      } as ProofNode;
    }
  }

  visitTuple = (ctx: TupleContext): ProofNode => {
    const ctxExtension = this.takeExtensionCtx()

    const type = this.typeChecker.visit(ctx);
    const typeWithAlias = this.typeChecker.encodeToAlias(type);
    const tupleTypesArray: string[] = []
    const tupleTypeNode = parseTypeAndElimParentheses(type)
    tupleTypeToArray(tupleTypeNode, tupleTypesArray)

    const nodeList = []
    const premises: ProofNode[] = []

    for (let i = 0; i < ctx.getChildCount(); i++) {
      if (i % 2 !== 0) {
        nodeList.push(ctx.getChild(i));
        premises.push(this.visit(ctx.getChild(i)));
      }
    }

    const cncs = this.generateConclusionStr(premises, ", ")

    const result = {
      type: type,
      wrappedConclusion: `$ \\vdash \\langle ${cncs.conclusion} \\rangle : ${type}`,
      wrappedConclusionWithAlias:
          `$ \\vdash \\langle ${cncs.conclusionWithAlias} \\rangle : ${typeWithAlias}`,
      unwrappedConclusion: `\\langle ${cncs.conclusion} \\rangle`,
      unwrappedConclusionWithAlias: `\\langle ${cncs.conclusionWithAlias} \\rangle`,
      rule: "(T-tuple)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false,
      ctxExtension: ctxExtension,
    } as ProofNode;

    console.log("Tuple: " + ctx.getText())

    return result;
  }

  visitTupleProjection = (ctx: TupleProjectionContext): ProofNode => {
    const ctxExtension = this.takeExtensionCtx()

    const tuple = ctx.getChild(0);
    const tupleType = this.typeChecker.visit(tuple);
    const tupleTypeWithAlias = this.typeChecker.encodeToAlias(tupleType);

    const tupleProjType = this.typeChecker.visit(ctx);
    const tupleProjTypeWithAlias = this.typeChecker.encodeToAlias(tupleProjType);

    return {
      type: tupleProjType,
      wrappedConclusion: `$ \\vdash ${ctx.getText()} : ${tupleProjType}`,
      wrappedConclusionWithAlias: `$ \\vdash ${ctx.getText()} : ${tupleProjTypeWithAlias}`,
      unwrappedConclusion: ctx.getText(),
      unwrappedConclusionWithAlias: ctx.getText(),

      rule: "(T-proj)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(tuple.getText()),
      root: false,
      isExpandable: false,
      ctxExtension: ctxExtension,
      premises:
          [
            {
              type: tupleType,
              wrappedConclusion: `$ \\vdash  ${tuple.getText()} : ${tupleType}`,
              wrappedConclusionWithAlias: `$ \\vdash  ${tuple.getText()} : ${tupleTypeWithAlias}`,
              unwrappedConclusion: ctx.getText(),
              unwrappedConclusionWithAlias: ctx.getText(),
              rule: "",
              root: false,
              tokenLocation: getTokenLocation(ctx),
              declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(tuple.getText()),
              isExpandable: false,
              ctxExtension: this.takeExtensionCtx(),
            }
          ],
    } as ProofNode;
  }

  visitRecord = (ctx: RecordContext): ProofNode => {
    const ctxExtension = this.takeExtensionCtx()

    const type = this.typeChecker.visit(ctx);
    const typeWithAlias = this.typeChecker.encodeToAlias(type);

    const premises: ProofNode[] = ctx.term_list().map(t => this.visit(t))

    const unwrappedConclusion = '<' + premises
        .map((p, i) => `${ctx.ID(i)} = ${p.unwrappedConclusion}`)
        .join(", ") + '>';

    const unwrappedConclusionWithAlias = '<' + premises
        .map((p, i) => `${ctx.ID(i)} = ${p.unwrappedConclusionWithAlias}`)
        .join(", ") + '>';

    const result = {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: "(T-record)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false,
      ctxExtension: ctxExtension,
    } as ProofNode;

    console.log("Tuple: ")

    return result;
  }

  visitRecordProjection = (ctx: RecordProjectionContext): ProofNode => {
    const ctxExtension = this.takeExtensionCtx()

    const record = ctx.getChild(0);

    const recordType = this.typeChecker.visit(record);
    const projectionType = this.typeChecker.visit(ctx)

    const recordTypeWithAlias = this.typeChecker.encodeToAlias(recordType);
    const projectionTypeWithAlias = this.typeChecker.encodeToAlias(projectionType);

    return {
      type: projectionType,
      wrappedConclusion: `$ \\vdash ${ctx.getText()} : ${projectionType}`,
      wrappedConclusionWithAlias: `$ \\vdash ${ctx.getText()} : ${projectionTypeWithAlias}`,
      unwrappedConclusion: ctx.getText(),
      unwrappedConclusionWithAlias: ctx.getText(),
      rule: "(T-proj)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(record.getText()),
      root: false,
      isExpandable: false,
      ctxExtension: ctxExtension,
      premises:
          [
            {
              type: projectionType,
              wrappedConclusion: `$ \\vdash ${record.getText()} : ${recordType}`,
              wrappedConclusionWithAlias: `$ \\vdash  ${record.getText()} : ${recordTypeWithAlias}`,
              unwrappedConclusion: ctx.getText(),
              unwrappedConclusionWithAlias: ctx.getText(),
              rule: "",
              root: false,
              tokenLocation: getTokenLocation(ctx),
              declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(record.getText()),
              isExpandable: false,
              ctxExtension: this.takeExtensionCtx(),
            }
          ],

    } as ProofNode;
  }

  visitInjection = (ctx: InjectionContext): ProofNode => {
    const ctxExtension = this.takeExtensionCtx()

    console.log("Inj " + ctx.getText())

    const variantType = this.typeChecker.visit(ctx);
    const variantTypeWithAlias = this.typeChecker.encodeToAlias(variantType);

    const body = ctx.term()
    const premise: ProofNode = this.visit(body);

    const bodyType = this.typeChecker.visit(body)
    const bodyTypeWithAlias = this.typeChecker.encodeToAlias(bodyType);
    const unwrappedConclusion = `[${ctx.ID()} = ${premise.unwrappedConclusion} ] as ${variantType}`;
    const unwrappedConclusionWithAlias =
        `[${ctx.ID()} = ${premise.unwrappedConclusionWithAlias} ] as ${variantTypeWithAlias}`;

    return {
      type: variantType,
      wrappedConclusion:
          `$ \\vdash ${unwrappedConclusion} : ${variantType}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${variantTypeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: "(T-variant)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      ctxExtension: ctxExtension,
      premises:
          [
            {
              type: variantType,
              wrappedConclusion: `$ \\vdash ${premise.unwrappedConclusion} : ${bodyType}`,
              wrappedConclusionWithAlias: `$ \\vdash ${premise.unwrappedConclusionWithAlias} : ${bodyTypeWithAlias}`,
              unwrappedConclusion: premise.unwrappedConclusion,
              unwrappedConclusionWithAlias: premise.unwrappedConclusionWithAlias,
              rule: "",
              root: false,
              tokenLocation: getTokenLocation(ctx),
              isExpandable: false,
              ctxExtension: this.takeExtensionCtx(),
            }
          ],

    } as ProofNode;
  }

  visitLeftRightInj = (ctx: LeftRightInjContext) => {
    const ctxExtension = this.takeExtensionCtx()

    const variantType = this.typeChecker.visit(ctx);
    const variantTypeWithAlias = this.typeChecker.encodeToAlias(variantType);

    const body = ctx.term()
    const premise: ProofNode = this.visit(body);
    const injType = ctx.getChild(0).getText();

    const bodyType = this.typeChecker.visit(body)
    const bodyTypeWithAlias = this.typeChecker.encodeToAlias(bodyType);
    const unwrappedConclusion = `${injType} ${premise.unwrappedConclusion} as ${variantType}`;
    const unwrappedConclusionWithAlias =
        `${injType} = ${premise.unwrappedConclusionWithAlias} as ${variantTypeWithAlias}`;

    return {
      type: variantType,
      wrappedConclusion:
          `$ \\vdash ${unwrappedConclusion} : ${variantType}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${variantTypeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-${injType})`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      ctxExtension: ctxExtension,
      premises:
          [
            {
              type: variantType,
              wrappedConclusion: `$ \\vdash ${premise.unwrappedConclusion} : ${bodyType}`,
              wrappedConclusionWithAlias: `$ \\vdash ${premise.unwrappedConclusionWithAlias} : ${bodyTypeWithAlias}`,
              unwrappedConclusion: premise.unwrappedConclusion,
              unwrappedConclusionWithAlias: premise.unwrappedConclusionWithAlias,
              rule: "",
              root: false,
              tokenLocation: getTokenLocation(ctx),
              isExpandable: false,
              ctxExtension: this.takeExtensionCtx(),
            }
          ],

    } as ProofNode;

  }

  visitCaseOf = (ctx: CaseOfContext): ProofNode => {
    const ctxExtension = this.takeExtensionCtx()

    console.log("Cas " + ctx.getText())

    const varNode = ctx.term(0);
    const varName = varNode.getText();
    const caseType = this.typeChecker.visit(ctx);
    const caseTypeWithAlias = this.typeChecker.encodeToAlias(caseType);

    const variantType = this.typeChecker.findType(varName, varNode);
    if (!variantType) throw new Error();
    const variantTypeNode = parseTypeAndElimParentheses(variantType);

    const variantLabels = this.typeChecker.extractLabels(variantTypeNode);

    const premises: ProofNode[] = [this.visit(varNode)]

    for (let i = 4; i < ctx.getChildCount(); i += 8) {
      const labelNode = ctx.getChild(i);
      const label = labelNode.getText();
      const variableNode = ctx.getChild(i + 2);
      const variable = variableNode.getText();
      const variableType = variantLabels
          .find(e => e.name === label)?.type;

      const term = ctx.getChild(i + 5);

      if (variableType === undefined)
        throw new TypeError(`Type '${variantType}' does not contain label '${label}'`, getTokenLocation(ctx))

      this.localContext.addVariable(variable, variableType, undefined)
      this.typeChecker.localContext.addVariable(variable, variableType, undefined)
      this.updateContextExtension(true)

      const termProofNode = this.visit(term)
      premises.push(termProofNode);

      this.typeChecker.localContext.deleteVariable(variable)
      this.localContext.deleteVariable(variable)
      this.updateContextExtension(false)
    }

    const unwrappedConclusion = `case ${premises[0].unwrappedConclusion} of ` +
        premises.slice(1, premises.length)
            .map((child, i) =>
                `[${ctx.ID(i * 2)}=${ctx.ID(i * 2 + 1)}]=>${premises[i + 1].unwrappedConclusion}`)
            .join(" || ");

    const unwrappedConclusionWithALias = `case ${premises[0].unwrappedConclusionWithAlias} of ` +
        premises.slice(1, premises.length)
            .map((child, i) =>
                `[${ctx.ID(i * 2)}=${ctx.ID(i * 2 + 1)}]=>${premises[i + 1].unwrappedConclusionWithAlias}`)
            .join(" || ");

    return {
      type: caseType,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${caseType}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithALias} : ${caseTypeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithALias,
      rule: "(T-case)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false,
      ctxExtension: ctxExtension,
    } as ProofNode;
  };

  visitBinaryCaseOf = (ctx: BinaryCaseOfContext): ProofNode => {
    console.log("Cas B " + ctx.getText())
    const ctxExtension = this.takeExtensionCtx()

    const varNode = ctx.term(0);
    const varName = varNode.getText();
    const caseType = this.typeChecker.visit(ctx);
    const caseTypeWithAlias = this.typeChecker.encodeToAlias(caseType);

    const variantType = this.typeChecker.findType(varName, varNode);
    if (!variantType) throw new Error();
    const variantTypeNode = parseTypeAndElimParentheses(variantType);

    const leftType = variantTypeNode.getChild(0).getText();
    const rightType = variantTypeNode.getChild(2).getText();

    const variantLabels = [
      {name: 'inl', type: leftType},
      {name: 'inr', type: rightType},
    ];

    const premises: ProofNode[] = [this.visit(varNode)]

    for (let i = 3; i < ctx.getChildCount(); i += 5) {
      const labelNode = ctx.getChild(i);
      const label = labelNode.getText();
      const variableNode = ctx.getChild(i + 1);
      const variable = variableNode.getText();
      const variableType = variantLabels
          .find(e => e.name === label)?.type;

      const term = ctx.getChild(i + 3);

      if (variableType === undefined)
        throw new TypeError(`Type '${variantType}' does not contain label '${label}'`, getTokenLocation(ctx))

      this.localContext.addVariable(variable, variableType, undefined)
      this.typeChecker.localContext.addVariable(variable, variableType, undefined)
      this.updateContextExtension(true)

      const termProofNode = this.visit(term)
      premises.push(termProofNode);

      this.typeChecker.localContext.deleteVariable(variable)
      this.localContext.deleteVariable(variable)
      this.updateContextExtension(false)
    }

    const unwrappedConclusion = `case ${premises[0].unwrappedConclusion} of ` +
        `${ctx.getChild(3).getText()} ${ctx.ID(0).getText()}=>${premises[1].unwrappedConclusion} ||` +
        ` ${ctx.getChild(8).getText()} ${ctx.ID(1).getText()}=>${premises[2].unwrappedConclusion}`;


    const unwrappedConclusionWithAlias = `case ${premises[0].unwrappedConclusionWithAlias} of ` +
        `${ctx.getChild(3).getText()} ${ctx.ID(0).getText()}=>${premises[1].unwrappedConclusionWithAlias} ||` +
        ` ${ctx.getChild(8).getText()} ${ctx.ID(1).getText()}=>${premises[2].unwrappedConclusionWithAlias}`;

    return {
      type: caseType,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${caseType}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${caseTypeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: "(T-case)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false,
      ctxExtension: ctxExtension,
    } as ProofNode;
  };


  visitLiteral = (ctx: LiteralContext): ProofNode => {
    console.log("Lit", ctx.getText());
    const ctxExtension = this.takeExtensionCtx()

    const literal = ctx.getText();
    const type = this.typeChecker.visit(ctx);

    let ruleName;
    if (type === 'Bool')
      ruleName = ctx.getText();
    else if (literal === '0')
      ruleName = 'zero';
    else
      ruleName = "nat";

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${literal} : ${type}`,
      wrappedConclusionWithAlias: `$ \\vdash ${literal} : ${type}`,
      unwrappedConclusion: `${literal}`,
      unwrappedConclusionWithAlias: `${literal}`,
      rule: `(T-${ruleName})`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      ctxExtension: ctxExtension,
      premises: [
        {
          type: type,
          wrappedConclusion: "",
          wrappedConclusionWithAlias: "",
          unwrappedConclusion: "",
          unwrappedConclusionWithAlias: "",
          rule: "",
          tokenLocation: getTokenLocation(ctx),
          root: false,
          isExpandable: false,
          ctxExtension: this.takeExtensionCtx(),
        }
      ]
    } as ProofNode;
  };

  visitIfElse = (ctx: IfElseContext): ProofNode => {
    console.log("Visiting a condition", ctx.getText());
    const ctxExtension = this.takeExtensionCtx()

    const ifType = this.typeChecker.visit(ctx);
    const ifTypeWithAlias = this.typeChecker.encodeToAlias(ifType);

    const premises: ProofNode[] = ctx.term_list().map(t => this.visit(t));

    let unwrappedConclusion = `if ${premises[0].unwrappedConclusion} then ${premises[1].unwrappedConclusion}`
    let unwrappedConclusionWithAlias =
        `if ${premises[0].unwrappedConclusionWithAlias} then ${premises[1].unwrappedConclusionWithAlias}`

    for (let i = 2; i < (premises.length % 2 === 0 ? premises.length : premises.length - 1); i += 2) {
      unwrappedConclusion += ` else if ${premises[i].unwrappedConclusion} then ${premises[i + 1].unwrappedConclusion}`
      unwrappedConclusionWithAlias
          += ` else if ${premises[i].unwrappedConclusionWithAlias} then ${premises[i + 1].unwrappedConclusionWithAlias}`
    }

    if (premises.length % 2 !== 0) {
      unwrappedConclusion += ` else ${premises[premises.length - 1].unwrappedConclusion}`;
      unwrappedConclusionWithAlias += ` else ${premises[premises.length - 1].unwrappedConclusionWithAlias}`;
    }

    return {
      type: ifType,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${ifType}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${ifTypeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: "(T-if)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false,
      ctxExtension: ctxExtension,
    } as ProofNode;
  }

  visitParentheses = (ctx: ParenthesesContext): ProofNode => {
    const tmp: ProofNode = this.visit(ctx.getChild(1))
    console.log(ctx.getText())
    tmp.unwrappedConclusion = `(${tmp.unwrappedConclusion})`
    tmp.unwrappedConclusionWithAlias = `(${tmp.unwrappedConclusionWithAlias})`

    return tmp;
  };

  visitListNil = (ctx: ListNilContext): any => {
    console.log("Nil", ctx.getText());
    const ctxExtension = this.takeExtensionCtx()

    const type = this.typeChecker.visit(ctx)
    const typeWithAlias = this.typeChecker.encodeToAlias(type)

    const elType = parseTypeAndElimParentheses(type).getChild(1).getText()

    const elTypeWithAlias = this.typeChecker.encodeToAlias(elType);

    const unwrappedConclusion = `nil[${elType}]`
    const unwrappedConclusionWithAlias = `nil[${elTypeWithAlias}]`

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-nil)`,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      ctxExtension: ctxExtension,
      premises: [
        {
          type: type,
          wrappedConclusion: `\\Gamma \\vdash ${unwrappedConclusion} : ${type} \\in \\Gamma`,
          wrappedConclusionWithAlias:
              `\\Gamma \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias} \\in \\Gamma`,
          unwrappedConclusion: unwrappedConclusion,
          unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
          rule: ``,
          tokenLocation: getTokenLocation(ctx),
          root: false,
          isExpandable: false,
          ctxExtension: ctxExtension,
        }
      ]
    } as ProofNode;
  };

  visitListCons = (ctx: ListConsContext): any => {
    console.log("Cons", ctx.getText());
    const ctxExtension = this.takeExtensionCtx()

    let type = this.typeChecker.visit(ctx)

    const elType = this.typeChecker.decodeAlias(eliminateOutParentheses(ctx.type_()).getText())

    const elTypeWithAlias = this.typeChecker.encodeToAlias(elType);

    const parenApp1 = (this.findFirstParent(ctx.parentCtx) instanceof ApplicationContext) ?
        (this.findFirstParent(ctx.parentCtx) as ApplicationContext) : undefined;

    const parenApp2 = (this.findFirstParent(parenApp1) instanceof ApplicationContext) ?
        (this.findFirstParent(parenApp1) as ApplicationContext) : undefined;


    let premises: ProofNode[] | undefined = undefined

    if (parenApp1) {
      type = this.typeChecker.visit(parenApp1)
      premises = [this.visit(parenApp1.term(1))]
      if (parenApp2) {
        type = this.typeChecker.visit(parenApp2)
        premises = [...premises, this.visit(parenApp2.term(1))]
      }
    }

    const typeWithAlias = this.typeChecker.encodeToAlias(type)

    const unwrappedConclusion =
        `cons[${elType}] ${premises ? premises.map(p => p.unwrappedConclusion).join(' ') : ''}`;
    const unwrappedConclusionWithAlias =
        `cons[${elTypeWithAlias}] ${premises ? premises.map(p => p.unwrappedConclusionWithAlias).join(' ') : ''}`

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-cons)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises ? premises : [        {
        type: type,
        wrappedConclusion: `\\Gamma \\vdash ${unwrappedConclusion} : ${type} \\in \\Gamma`,
        wrappedConclusionWithAlias:
            `\\Gamma \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias} \\in \\Gamma`,
        unwrappedConclusion: unwrappedConclusion,
        unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
        rule: ``,
        tokenLocation: getTokenLocation(ctx),
        root: false,
        isExpandable: false,
        ctxExtension: ctxExtension,
      }],
      ctxExtension: ctxExtension,
    } as ProofNode;
  };

  visitListConstructor = (ctx: ListConstructorContext) => {
    console.log("Constructor", ctx.getText());
    const ctxExtension = this.takeExtensionCtx()

    const type = this.typeChecker.visit(ctx)

    const elType = parseTypeAndElimParentheses(type).getChild(1).getText()

    const premises: ProofNode[] = ctx.term_list().map((t) => this.visit(t))

    const typeWithAlias = this.typeChecker.encodeToAlias(type)
    const unwrappedConclusion = `[ ${premises.map(p => p.unwrappedConclusion).join(', ')} ]`;
    const unwrappedConclusionWithAlias = `[ ${premises.map(p => p.unwrappedConclusionWithAlias).join(', ')} ]`;

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-list)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises,
      ctxExtension: ctxExtension,
    } as ProofNode;
  }

  visitListIsNil = (ctx: ListIsNilContext): any => {
    console.log("Isnil", ctx.getText());
    const ctxExtension = this.takeExtensionCtx()

    let type = this.typeChecker.visit(ctx)

    let premises: ProofNode[] | undefined = undefined
    const elType = this.typeChecker.decodeAlias(eliminateOutParentheses(ctx.type_()).getText());
    const parenApp = (ctx.parentCtx?.parentCtx instanceof ApplicationContext) ?
        (ctx.parentCtx?.parentCtx as ApplicationContext) : undefined;

    if (parenApp) {
      type = this.typeChecker.visit(parenApp)
      premises = [this.visit(parenApp.term(1))]
    }

    const typeWithAlias = this.typeChecker.encodeToAlias(type)
    const elTypeWithAlias = this.typeChecker.encodeToAlias(elType);


    const unwrappedConclusion = `isnil[${elType}] ${premises ? premises[0].unwrappedConclusion : ''}`;
    const unwrappedConclusionWithAlias =
        `isnil[${elTypeWithAlias}] ${premises ? premises[0].unwrappedConclusionWithAlias : ''}`

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-isnil)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises ? premises : [        {
        type: type,
        wrappedConclusion: `\\Gamma \\vdash ${unwrappedConclusion} : ${type} \\in \\Gamma`,
        wrappedConclusionWithAlias:
            `\\Gamma \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias} \\in \\Gamma`,
        unwrappedConclusion: unwrappedConclusion,
        unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
        rule: ``,
        tokenLocation: getTokenLocation(ctx),
        root: false,
        isExpandable: false,
        ctxExtension: ctxExtension,
      }],
      ctxExtension: ctxExtension,
    } as ProofNode;
  };

  visitListTail = (ctx: ListTailContext): any => {
    console.log("Tail", ctx.getText());
    const ctxExtension = this.takeExtensionCtx()

    let type = this.typeChecker.visit(ctx)
    let premises: ProofNode[] | undefined = undefined
    const elType = this.typeChecker.decodeAlias(eliminateOutParentheses(ctx.type_()).getText());
    const parenApp = (ctx.parentCtx?.parentCtx instanceof ApplicationContext) ?
        (ctx.parentCtx?.parentCtx as ApplicationContext) : undefined;
    if (parenApp) {
      type = this.typeChecker.visit(parenApp)
      premises = [this.visit(parenApp.term(1))]
    }

    const typeWithAlias = this.typeChecker.encodeToAlias(type)
    const elTypeWithAlias = this.typeChecker.encodeToAlias(elType)
    const unwrappedConclusion = `tail[${elType}] ${premises ? premises[0].unwrappedConclusion : ''}`;
    const unwrappedConclusionWithAlias =
        `tail[${elTypeWithAlias}] ${premises ? premises[0].unwrappedConclusionWithAlias : ''}`

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-tail)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises ? premises : [        {
        type: type,
        wrappedConclusion: `\\Gamma \\vdash ${unwrappedConclusion} : ${type} \\in \\Gamma`,
        wrappedConclusionWithAlias:
            `\\Gamma \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias} \\in \\Gamma`,
        unwrappedConclusion: unwrappedConclusion,
        unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
        rule: ``,
        tokenLocation: getTokenLocation(ctx),
        root: false,
        isExpandable: false,
        ctxExtension: ctxExtension,
      }],
      ctxExtension: ctxExtension,
    } as ProofNode;
  };

  visitListHead = (ctx: ListHeadContext): any => {
    console.log("head", ctx.getText());
    const ctxExtension = this.takeExtensionCtx()

    let type = this.typeChecker.visit(ctx)
    let premises: ProofNode[] | undefined = undefined
    const elType = this.typeChecker.decodeAlias(eliminateOutParentheses(ctx.type_()).getText());
    const parenApp = (ctx.parentCtx?.parentCtx instanceof ApplicationContext) ?
        (ctx.parentCtx?.parentCtx as ApplicationContext) : undefined;
    if (parenApp) {
      type = this.typeChecker.visit(parenApp)
      premises = [this.visit(parenApp.term(1))]
    }

    const typeWithAlias = this.typeChecker.encodeToAlias(type)
    const elTypeWithAlias = this.typeChecker.encodeToAlias(elType)
    const unwrappedConclusion = `head[${elType}] ${premises ? premises[0].unwrappedConclusion : ''}`;
    const unwrappedConclusionWithAlias =
        `head[${elTypeWithAlias}] ${premises ? premises[0].unwrappedConclusionWithAlias : ''}`

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-head)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises ? premises : [        {
        type: type,
        wrappedConclusion: `\\Gamma \\vdash ${unwrappedConclusion} : ${type} \\in \\Gamma`,
        wrappedConclusionWithAlias:
            `\\Gamma \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias} \\in \\Gamma`,
        unwrappedConclusion: unwrappedConclusion,
        unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
        rule: ``,
        tokenLocation: getTokenLocation(ctx),
        root: false,
        isExpandable: false,
        ctxExtension: ctxExtension,
      }],
      ctxExtension: ctxExtension,
    } as ProofNode;
  };

  visitFix = (ctx: FixContext) => {
    console.log("Visiting a fix", ctx.getText());
    const ctxExtension = this.takeExtensionCtx()

    const type = this.typeChecker.visit(ctx)
    const typeWithAlias = this.typeChecker.encodeToAlias(type)
    const premises: ProofNode[] = [this.visit(ctx.term())]
    const unwrappedConclusion = `fix ${premises[0].unwrappedConclusion}`;
    const unwrappedConclusionWithAlias =
        `fix ${premises[0].unwrappedConclusionWithAlias}`

    return {
      type: type,
      wrappedConclusion: `$ \\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `$ \\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-fix)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises,
      ctxExtension: ctxExtension,
    } as ProofNode;

  }

  visitList = (ctx: ListContext): any => {
    return this.visit(ctx.getChild(0))
  }

  private contextStack = new Array<CtxStackElement>();

  private ctxExtensionNum = 0

  updateContextExtension(operation : boolean) {
    if (operation) {
      if (this.localContext.isEmpty()) return;
      const contextExtension = this.localContext.toStringWithoutAliases(this.typeChecker.aliasContext);
      const contextExtensionWithAlies = this.localContext.toStringWithAliases(this.typeChecker.aliasContext);
      console.warn(contextExtensionWithAlies);
      if (this.contextStack.length === 0) {
        this.contextStack.push(
            {
              number : this.ctxExtensionNum++,
              unwrapped:
                  contextExtension +
                  (this.typeChecker.globalContext.isEmpty() ? '' : ', ' +
                      this.typeChecker.globalContext.toStringWithoutAliases(this.typeChecker.aliasContext)),
              unwrappedWithAlias:
                  contextExtensionWithAlies +
                  (this.typeChecker.globalContext.isEmpty() ? '' : ', ' +
                      this.typeChecker.globalContext.toStringWithAliases(this.typeChecker.aliasContext)),
              wrapped:
                  `\\Gamma@${this.ctxExtensionNum} = ${this.typeChecker.globalContext.isEmpty() ? '' : '\\Gamma \\cup '}\\{ ${contextExtension} \\}`,
              wrappedWithAlias:
                  `\\Gamma@${this.ctxExtensionNum} = ${this.typeChecker.globalContext.isEmpty() ? '' : '\\Gamma \\cup '}\\{ ${contextExtensionWithAlies} \\}`,
              declaration: `\\Gamma@${this.ctxExtensionNum}`,
              isTaken: false,
            }
        )
      } else {
        const prev = this.contextStack[this.contextStack.length - 1];
        if (contextExtension === prev.unwrapped) {
          this.contextStack.push({
            number: prev.number,
            wrapped:  prev.wrapped,
            unwrapped: prev.unwrapped,
            wrappedWithAlias: prev.wrappedWithAlias,
            unwrappedWithAlias: prev.unwrappedWithAlias,
            declaration: `\\Gamma@${prev.number}`,
            isTaken: false,
          });
        } else {
          this.contextStack.push({
            number: ++this.ctxExtensionNum,
            unwrapped:  contextExtension,
            unwrappedWithAlias: contextExtensionWithAlies,
            wrapped: `\\Gamma@${this.ctxExtensionNum} =  ${prev.declaration} \\cup \\{ ${
              contextExtension.replace(prev.unwrapped, "").replace(",", "")
            } \\}`,
            wrappedWithAlias: `\\Gamma@${this.ctxExtensionNum} =  ${prev.declaration} \\cup \\{ ${
                contextExtensionWithAlies.replace(prev.unwrappedWithAlias, "").replace(",", "")
            } \\}`,

            declaration: `\\Gamma@${this.ctxExtensionNum}`,
            isTaken: false,
          });
        }
      }
    } else {
      this.contextStack.pop()
    }

    const current = this.contextStack.length !== 0 ? this.contextStack[this.contextStack.length - 1] : undefined;
    this.contextExtension = current?.wrapped ?? "";
  }

  takeExtensionCtx() : CtxStackElement {

    if (this.contextStack.length === 0) {
      return this.typeChecker.globalContext.isEmpty() ? {
        number: 0,
        wrapped:  '',
        unwrapped: '',
        declaration: '',
        wrappedWithAlias: '',
        unwrappedWithAlias: '',
        isTaken: false,
      } : {
        number: 0,
        wrapped:  '\\Gamma',
        unwrapped: this.typeChecker.globalContext.toStringWithoutAliases(this.typeChecker.aliasContext),
        unwrappedWithAlias: this.typeChecker.globalContext.toStringWithAliases(this.typeChecker.aliasContext),
        wrappedWithAlias: '\\Gamma',
        declaration: '\\Gamma',
        isTaken: false,
      }
    }

    const ctxEx = this.contextStack[this.contextStack.length - 1]

    const tmp = JSON.parse(JSON.stringify(ctxEx));
    ctxEx.isTaken = true;


    return tmp;
  }

  getContextInfo(name: string): ContextElement {
    let ctxInfo = this.localContext.getContextInfo(name)
    if (!ctxInfo) ctxInfo = this.typeChecker.localContext.getContextInfo(name)
    if (!ctxInfo) ctxInfo = this.typeChecker.globalContext.getContextInfo(name)
    if (!ctxInfo) ctxInfo = this.typeChecker.predefinedFunctionsContext.getContextInfo(name)
    if (!ctxInfo) throw new Error("Unrecognized variable: " + name)

    return ctxInfo
  }

  generateConclusionStr(premises: ProofNode[], separator?: string) {
    const unwrappedConclusion = premises
        .map(p => p.unwrappedConclusion)
        .join(separator ? separator : " ");
    const unwrappedConclusionWithAlias = premises
        .map(p => p.unwrappedConclusionWithAlias)
        .join(separator ? separator : " ");

    return {conclusion: unwrappedConclusion, conclusionWithAlias: unwrappedConclusionWithAlias};
  }

  findFirstParent(ctx: ParserRuleContext | undefined) {
    if (!ctx)
      return undefined;
    let parent = ctx.parentCtx

    while (parent && (parent instanceof ParenthesesContext)) {
      parent = parent.parentCtx
    }

    return parent;
  }
}

export interface CtxStackElement {
  number: number
  wrapped: string;
  wrappedWithAlias: string;
  unwrapped: string;
  unwrappedWithAlias: string;
  declaration: string;
  isTaken: boolean;
}