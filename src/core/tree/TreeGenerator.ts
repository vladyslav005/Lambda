import LambdaCalcVisitor from "../antlr/LambdaCalcVisitor";
import {
  AdditionContext,
  ApplicationContext,
  BinaryCaseOfContext,
  CaseOfContext,
  ComparisonContext,
  ExprContext, FixContext,
  IfElseContext,
  InjectionContext,
  LambdaAbstractionContext,
  LeftRightInjContext,
  ListConsContext, ListConstructorContext,
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
  VariableContext,
  WildCardContext
} from "../antlr/LambdaCalcParser";
import {TypeChecker} from "../typechecker/TypeChecker";
import {ParserRuleContext, ParseTree} from "antlr4";
import {Context, ContextElement} from "../context/Context";
import {getTokenLocation, parseTypeAndElimParentheses, tupleTypeToArray} from "../utils";
import {TypeError} from "../errorhandling/customErrors";

export interface ProofNode {
  type: string;
  wrappedConclusion: string;
  wrappedConclusionWithAlias: string;
  unwrappedConclusion: string;
  unwrappedConclusionWithAlias: string;
  rule: string;
  context: ParserRuleContext;
  tokenLocation: number[],
  declarationLocation?: number[];
  premises?: ProofNode[];
  expandedPremises?: ProofNode[];
  root: boolean;
  isExpandable: boolean;
  isExpanded?: boolean;
  aliasesPresent?: boolean;
}


export class TreeGenerator extends LambdaCalcVisitor<any> {

  private typeChecker: TypeChecker = new TypeChecker();
  private globalContext: Context | undefined;

  private localContext: Context;

  private contextExtension: string;
  private contextExtensionWithAlies: string;


  constructor() {
    super();
    this._proofTree = undefined;
    this.globalContext = undefined;
    this.localContext = new Context();
    this.contextExtension = "";
    this.contextExtensionWithAlies = "";
  }

  private _proofTree: ProofNode | undefined;

  get proofTree(): ProofNode | undefined {
    return this._proofTree;
  }

  public generateTree(AST: ParseTree, globalContext: Context, aliasContext: Context): ProofNode | undefined {

    this.globalContext = globalContext;
    this.typeChecker.globalContext = globalContext;
    this.typeChecker.aliasContext = aliasContext;

    this.localContext = new Context()

    this.visit(AST);

    if (this._proofTree !== undefined) {
      this._proofTree.root = true;
      this._proofTree.aliasesPresent = !aliasContext.isEmpty()
      return this._proofTree;
    }

    const result = this._proofTree;

    this._proofTree = undefined;
    this.typeChecker.clearGlobalContext();
    this.typeChecker.clearLocalContext();
    this.typeChecker.clearAliasContext();

    return result;
  }

  visitExpr = (ctx: ExprContext): any => {
    this._proofTree = this.visit(ctx.terms());
  };

  visitAddition = (ctx: AdditionContext): ProofNode => {
    const premises: ProofNode[] = ctx.term_list().map(t => this.visit(t));
    const type = 'Nat'
    const cncns = this.generateConclusionStr(premises, ` ${ctx.getChild(1).getText()} `)
    const unwrappedConclusion = cncns.conclusion;
    const unwrappedConclusionWithAlias = cncns.conclusionWithAlias;
    const ruleName = `T-${ctx.getChild(1).getText() === '+' ? 'add' : 'sub'}`

    return {
      type: type,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias: `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${type}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: ruleName,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises,
    } as ProofNode;
  };

  visitMultiplication = (ctx: MultiplicationContext): ProofNode => {
    const premises: ProofNode[] = ctx.term_list().map(t => this.visit(t));
    const type = 'Nat'
    const cncns = this.generateConclusionStr(premises, ` ${ctx.getChild(1).getText()} `)
    const unwrappedConclusion = cncns.conclusion;
    const unwrappedConclusionWithAlias = cncns.conclusionWithAlias;
    const ruleName = `T-mult`

    return {
      type: type,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias: `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${type}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: ruleName,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises,
    } as ProofNode;
  };

  visitPower = (ctx: PowerContext): ProofNode => {
    const premises: ProofNode[] = ctx.term_list().map(t => this.visit(t));
    const type = 'Nat'
    const cncns = this.generateConclusionStr(premises, `${ctx.getChild(1).getText()}`)
    const unwrappedConclusion = cncns.conclusion;
    const unwrappedConclusionWithAlias = cncns.conclusionWithAlias;
    const ruleName = `T-pow`

    return {
      type: type,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias: `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${type}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: ruleName,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises,
    } as ProofNode;
  };

  visitComparison = (ctx: ComparisonContext): ProofNode => {
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
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias: `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${type}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: ruleName,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises,
    } as ProofNode;
  };

  visitLambdaAbstraction = (ctx: LambdaAbstractionContext): ProofNode => {
    console.log("T-abs: " + ctx.getText())

    const ctxExtensionTmp = this.contextExtension
    this.localContext.addVariable(ctx.ID().getText(),
        this.typeChecker.decodeAlias(this.typeChecker.visit(ctx.type_(0))), undefined)
    this.typeChecker.localContext = this.localContext;
    this.updateContextExtension()

    const type = this.typeChecker.visit(ctx);
    const typeWithAlias = this.typeChecker.encodeToAlias(type)
    const body = ctx.term();

    const argumentType = ctx.type_(0).getText()
    const argumentTypeWithAlias = this.typeChecker.encodeToAlias(argumentType)

    const premises = [this.visit(body)]

    const cncs = this.generateConclusionStr(premises);
    const unwrappedConclusion = `λ ${ctx.ID().getText()}:${argumentType}.${cncs.conclusion}`;
    const unwrappedConclusionWithAlias = `λ ${ctx.ID().getText()}:${argumentTypeWithAlias}.${cncs.conclusionWithAlias}`;

    this.localContext.deleteVariable(ctx.ID().getText())
    this.typeChecker.clearLocalContext();
    this.updateContextExtension()

    return {
      type: type,
      wrappedConclusion: `\\Gamma${ctxExtensionTmp}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.typeChecker.encodeToAlias(ctxExtensionTmp)}\\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: "(T-abs)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false
    } as ProofNode;
  };

  visitWildCard = (ctx: WildCardContext) => {
    console.log("T-abs: " + ctx.getText())

    const ctxExtensionTmp = this.contextExtension

    const type = this.typeChecker.visit(ctx);
    const typeWithAlias = this.typeChecker.encodeToAlias(type)
    const body = ctx.term();

    const argumentType = ctx.type_(0).getText()
    const argumentTypeWithAlias = this.typeChecker.encodeToAlias(argumentType)

    const premises = [this.visit(body)]

    const cncs = this.generateConclusionStr(premises);
    const unwrappedConclusion = `λ \\_:${argumentType}.${cncs.conclusion}`;
    const unwrappedConclusionWithAlias = `λ \\_:${argumentTypeWithAlias}.${cncs.conclusionWithAlias}`;

    return {
      type: type,
      wrappedConclusion: `\\Gamma${ctxExtensionTmp}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.typeChecker.encodeToAlias(ctxExtensionTmp)}\\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: "(T-wildcard)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false
    } as ProofNode;
  };


  visitVariable = (ctx: VariableContext): ProofNode => {
    console.log("Var: " + ctx.getText())

    const type = (this.typeChecker.visit(ctx));
    const typeWithAlias = this.typeChecker.encodeToAlias(type);

    let ctxInfo = this.getContextInfo(ctx.getText())
    const varName = ctx.getText()

    return {
      type: type,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${ctx.getText()} : ${(type)}`,
      wrappedConclusionWithAlias: `\\Gamma${this.contextExtensionWithAlies}\\vdash ${ctx.getText()} : ${(typeWithAlias)}`,
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
      premises: [
        {
          type: type,
          wrappedConclusion: `${ctx.getText()} : ${type}\\in\\Gamma${this.contextExtension}`,
          wrappedConclusionWithAlias: `${ctx.getText()} : ${typeWithAlias}\\in\\Gamma${this.contextExtensionWithAlies}`,
          unwrappedConclusion: varName,
          unwrappedConclusionWithAlias: varName,
          rule: "",
          root: false,
          context: ctx,
          tokenLocation: getTokenLocation(ctx),
          declarationLocation: ctxInfo.declarationLocation,
          isExpandable: ctxInfo.isExpandable,
        }
      ],
    } as ProofNode;
  };

  visitApplication = (ctx: ApplicationContext): ProofNode => {
    console.log("App: " + ctx.getText())

    const type = this.typeChecker.visit(ctx);
    const typeWithAlias = this.typeChecker.encodeToAlias(type);

    const premises = this.visitChildren(ctx)

    const cncs = this.generateConclusionStr(premises)

    return {
      type: type,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${cncs.conclusion} : ${type}`,
      wrappedConclusionWithAlias: `\\Gamma${this.contextExtensionWithAlies}\\vdash ${cncs.conclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: cncs.conclusion,
      unwrappedConclusionWithAlias: cncs.conclusionWithAlias,
      rule: "(T-app)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises,
    } as ProofNode;
  };

  visitSequence = (ctx: SequenceContext): ProofNode => {
    console.log("Seq " + ctx.getText())
    const type = this.typeChecker.visit(ctx);
    const typeWithAlias = this.typeChecker.encodeToAlias(type);

    const seqTerms: {
      ctx: ParseTree;
      type: string;
    }[] = []

    for (let i = 0; i < ctx.getChildCount(); i++) {
      const child = ctx.getChild(i);
      const childType = this.typeChecker.visit(child);
      if (typeof childType === "string") {
        seqTerms.push({
          ctx: child,
          type: childType
        })
      }
    }

    const premises = seqTerms.map(c => this.visit(c.ctx));
    const cncs = this.generateConclusionStr(premises, "; ")

    if (seqTerms.length === 1)
      return this.visit(seqTerms[0].ctx)
    else
      return {
        type: type,
        wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${cncs.conclusion} : ${type}`,
        wrappedConclusionWithAlias:
            `\\Gamma ${this.contextExtensionWithAlies}\\vdash ${cncs.conclusionWithAlias} : ${typeWithAlias}`,
        rule: "(T-seq)",
        unwrappedConclusion: cncs.conclusion,
        unwrappedConclusionWithAlias: cncs.conclusionWithAlias,
        context: ctx,
        tokenLocation: getTokenLocation(ctx),
        root: false,
        premises: premises,
        isExpandable: false
      } as ProofNode;
  }

  visitTuple = (ctx: TupleContext): ProofNode => {
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
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash \\langle ${cncs.conclusion} \\rangle : ${type}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash \\langle ${cncs.conclusionWithAlias} \\rangle : ${typeWithAlias}`,
      unwrappedConclusion: `\\langle ${cncs.conclusion} \\rangle`,
      unwrappedConclusionWithAlias: `\\langle ${cncs.conclusionWithAlias} \\rangle`,
      rule: "(T-tuple)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false
    } as ProofNode;

    console.log("Tuple: " + ctx.getText())

    return result;
  }

  visitTupleProjection = (ctx: TupleProjectionContext): ProofNode => {
    const tuple = ctx.getChild(0);
    const tupleType = this.typeChecker.visit(tuple);
    const tupleTypeWithAlias = this.typeChecker.encodeToAlias(tupleType);

    const tupleProjType = this.typeChecker.visit(ctx);
    const tupleProjTypeWithAlias = this.typeChecker.encodeToAlias(tupleProjType);

    return {
      type: tupleProjType,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${ctx.getText()} : ${tupleProjType}`,
      wrappedConclusionWithAlias: `\\Gamma${this.contextExtensionWithAlies}\\vdash ${ctx.getText()} : ${tupleProjTypeWithAlias}`,
      unwrappedConclusion: ctx.getText(),
      unwrappedConclusionWithAlias: ctx.getText(),

      rule: "(T-proj)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(tuple.getText()),
      root: false,
      isExpandable: false,
      premises:
          [
            {
              type: tupleType,
              wrappedConclusion: `\\Gamma \\vdash  ${tuple.getText()} : ${tupleType}`,
              wrappedConclusionWithAlias: `\\Gamma \\vdash  ${tuple.getText()} : ${tupleTypeWithAlias}`,
              unwrappedConclusion: ctx.getText(),
              unwrappedConclusionWithAlias: ctx.getText(),
              rule: "",
              root: false,
              context: ctx,
              tokenLocation: getTokenLocation(ctx),
              declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(tuple.getText()),
              isExpandable: false
            }
          ],
    } as ProofNode;
  }

  visitRecord = (ctx: RecordContext): ProofNode => {
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
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: "(T-record)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false
    } as ProofNode;

    console.log("Tuple: ")

    return result;
  }

  visitRecordProjection = (ctx: RecordProjectionContext): ProofNode => {
    const record = ctx.getChild(0);

    const recordType = this.typeChecker.visit(record);
    const projectionType = this.typeChecker.visit(ctx)

    const recordTypeWithAlias = this.typeChecker.encodeToAlias(recordType);
    const projectionTypeWithAlias = this.typeChecker.encodeToAlias(projectionType);
    console.warn(recordType)

    return {
      type: projectionType,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${ctx.getText()} : ${projectionType}`,
      wrappedConclusionWithAlias: `\\Gamma${this.contextExtensionWithAlies}\\vdash ${ctx.getText()} : ${projectionTypeWithAlias}`,
      unwrappedConclusion: ctx.getText(),
      unwrappedConclusionWithAlias: ctx.getText(),
      rule: "(T-proj)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(record.getText()),
      root: false,
      isExpandable: false,
      premises:
          [
            {
              type: projectionType,
              wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${record.getText()} : ${recordType}`,
              wrappedConclusionWithAlias: `\\Gamma${this.contextExtensionWithAlies}\\vdash  ${record.getText()} : ${recordTypeWithAlias}`,
              unwrappedConclusion: ctx.getText(),
              unwrappedConclusionWithAlias: ctx.getText(),
              rule: "",
              root: false,
              context: ctx,
              tokenLocation: getTokenLocation(ctx),
              declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(record.getText()),
              isExpandable: false
            }
          ],

    } as ProofNode;
  }

  visitInjection = (ctx: InjectionContext): ProofNode => {
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
          `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${variantType}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${variantTypeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: "(T-variant)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises:
          [
            {
              type: variantType,
              wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${premise.unwrappedConclusion} : ${bodyType}`,
              wrappedConclusionWithAlias: `\\Gamma${this.contextExtensionWithAlies}\\vdash ${premise.unwrappedConclusionWithAlias} : ${bodyTypeWithAlias}`,
              unwrappedConclusion: premise.unwrappedConclusion,
              unwrappedConclusionWithAlias: premise.unwrappedConclusionWithAlias,
              rule: "",
              root: false,
              context: ctx,
              tokenLocation: getTokenLocation(ctx),
              isExpandable: false
            }
          ],

    } as ProofNode;
  }

  visitLeftRightInj? = (ctx: LeftRightInjContext) => {

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
          `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${variantType}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${variantTypeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-${injType})`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises:
          [
            {
              type: variantType,
              wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${premise.unwrappedConclusion} : ${bodyType}`,
              wrappedConclusionWithAlias: `\\Gamma${this.contextExtensionWithAlies}\\vdash ${premise.unwrappedConclusionWithAlias} : ${bodyTypeWithAlias}`,
              unwrappedConclusion: premise.unwrappedConclusion,
              unwrappedConclusionWithAlias: premise.unwrappedConclusionWithAlias,
              rule: "",
              root: false,
              context: ctx,
              tokenLocation: getTokenLocation(ctx),
              isExpandable: false
            }
          ],

    } as ProofNode;

  }

  visitCaseOf = (ctx: CaseOfContext): ProofNode => {
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
      this.updateContextExtension()

      const termProofNode = this.visit(term)
      premises.push(termProofNode);

      this.typeChecker.localContext.deleteVariable(variable)
      this.localContext.deleteVariable(variable)
      this.updateContextExtension()
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
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${caseType}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithALias} : ${caseTypeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithALias,
      rule: "(T-case)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false
    } as ProofNode;
  };

  visitBinaryCaseOf = (ctx: BinaryCaseOfContext): ProofNode => {
    console.log("Cas B " + ctx.getText())

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
      this.updateContextExtension()

      const termProofNode = this.visit(term)
      premises.push(termProofNode);

      this.typeChecker.localContext.deleteVariable(variable)
      this.localContext.deleteVariable(variable)
      this.updateContextExtension()
    }

    const unwrappedConclusion = `case ${premises[0].unwrappedConclusion} of ` +
        `${ctx.getChild(3).getText()} ${ctx.ID(0).getText()}=>${premises[1].unwrappedConclusion} ||` +
        ` ${ctx.getChild(8).getText()} ${ctx.ID(1).getText()}=>${premises[2].unwrappedConclusion}`;


    const unwrappedConclusionWithAlias = `case ${premises[0].unwrappedConclusionWithAlias} of ` +
        `${ctx.getChild(3).getText()} ${ctx.ID(0).getText()}=>${premises[1].unwrappedConclusionWithAlias} ||` +
        ` ${ctx.getChild(8).getText()} ${ctx.ID(1).getText()}=>${premises[2].unwrappedConclusionWithAlias}`;

    return {
      type: caseType,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${caseType}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${caseTypeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: "(T-case)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false
    } as ProofNode;
  };


  visitLiteral = (ctx: LiteralContext): ProofNode => {
    console.log("Lit", ctx.getText());

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
      wrappedConclusion: `${literal} : ${type}`,
      wrappedConclusionWithAlias: `${literal} : ${type}`,
      unwrappedConclusion: `${literal}`,
      unwrappedConclusionWithAlias: `${literal}`,
      rule: `(T-${ruleName})`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: [
        {
          type: type,
          wrappedConclusion: "",
          wrappedConclusionWithAlias: "",
          unwrappedConclusion: "",
          unwrappedConclusionWithAlias: "",
          rule: "",
          context: ctx,
          tokenLocation: getTokenLocation(ctx),
          root: false,
          isExpandable: false,
        }
      ]
    } as ProofNode;
  };

  visitIfElse = (ctx: IfElseContext): ProofNode => {
    console.log("Visiting a condition", ctx.getText());

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
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${ifType}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${ifTypeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: "(T-if)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false
    } as ProofNode;
  }

  visitParentheses = (ctx: ParenthesesContext): ProofNode => {
    const tmp: ProofNode = this.visit(ctx.getChild(1))
    console.log(ctx.getText())
    tmp.unwrappedConclusion = `(${tmp.unwrappedConclusion})`
    tmp.unwrappedConclusionWithAlias = `(${tmp.unwrappedConclusionWithAlias})`

    return tmp;
  };

  updateContextExtension() {
    this.contextExtension = "";
    this.contextExtensionWithAlies = "";

    if (this.localContext.isEmpty()) return;

    const ctxElements = this.localContext.getAllElements()
    this.contextExtension = ", ";
    this.contextExtensionWithAlies = ", ";

    for (const element of ctxElements) {
      this.contextExtension += element.name + ':' + element.type + ', ';
      this.contextExtensionWithAlies += element.name + ':' + this.typeChecker.encodeToAlias(element.type) + ', ';
    }

    this.contextExtension = this.contextExtension.substring(0, this.contextExtension.lastIndexOf(','));
    this.contextExtensionWithAlies = this.contextExtensionWithAlies.substring(0, this.contextExtensionWithAlies.lastIndexOf(','));
  }

  visitListNil = (ctx: ListNilContext): any => {
    console.log("Nil", ctx.getText());

    const type = this.typeChecker.visit(ctx)
    const typeWithAlias = this.typeChecker.encodeToAlias(type)

    const elType = parseTypeAndElimParentheses(type).getChild(1).getText()

    const elTypeWithAlias = this.typeChecker.encodeToAlias(elType);

    const unwrappedConclusion = `nil[${elType}]`
    const unwrappedConclusionWithAlias = `nil[${elTypeWithAlias}]`

    return {
      type: type,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-nil)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: [
        {
          type: type,
          wrappedConclusion: "",
          wrappedConclusionWithAlias: "",
          unwrappedConclusion: "",
          unwrappedConclusionWithAlias: "",
          rule: "",
          context: ctx,
          tokenLocation: getTokenLocation(ctx),
          root: false,
          isExpandable: false,
        }
      ]
    } as ProofNode;
  };

  visitListCons = (ctx: ListConsContext): any => {
    console.log("Cons", ctx.getText());

    const type = this.typeChecker.visit(ctx)
    const typeWithAlias = this.typeChecker.encodeToAlias(type)

    const elType = parseTypeAndElimParentheses(type).getChild(1).getText()

    const elTypeWithAlias = this.typeChecker.encodeToAlias(elType);

    const premises: ProofNode[] = ctx.term_list().map((t) => this.visit(t))

    const unwrappedConclusion = `cons[${elType}] ${premises[0].unwrappedConclusion} ${premises[1].unwrappedConclusion}`;
    const unwrappedConclusionWithAlias =
        `cons[${elTypeWithAlias}] ${premises[0].unwrappedConclusionWithAlias} ${premises[1].unwrappedConclusionWithAlias}`

    return {
      type: type,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-cons)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises
    } as ProofNode;
  };

  visitListConstructor = (ctx: ListConstructorContext) => {
    console.log("Constructor", ctx.getText());

    const type = this.typeChecker.visit(ctx)
    const typeWithAlias = this.typeChecker.encodeToAlias(type)

    const elType = parseTypeAndElimParentheses(type).getChild(1).getText()

    const premises: ProofNode[] = ctx.term_list().map((t) => this.visit(t))

    const unwrappedConclusion = `[ ${premises.map(p => p.unwrappedConclusion).join(', ')} ]`;
    const unwrappedConclusionWithAlias = `[ ${premises.map(p => p.unwrappedConclusionWithAlias).join(', ')} ]`;

    return {
      type: type,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-list)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises
    } as ProofNode;
  }

  visitListIsNil = (ctx: ListIsNilContext): any => {
    console.log("Isnil", ctx.getText());

    const type = 'Bool'
    const typeWithAlias = 'Bool'
    const elType = parseTypeAndElimParentheses(this.typeChecker.visit(ctx.term())).getChild(1).getText()
    const elTypeWithAlias = this.typeChecker.encodeToAlias(elType);
    const premises: ProofNode[] = [this.visit(ctx.term())];
    const unwrappedConclusion = `isnil[${elType}] ${premises[0].unwrappedConclusion}`;
    const unwrappedConclusionWithAlias =
        `isnil[${elTypeWithAlias}] ${premises[0].unwrappedConclusionWithAlias}`

    return {
      type: type,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-isnil)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises
    } as ProofNode;
  };

  visitListTail = (ctx: ListTailContext): any => {
    console.log("Cons", ctx.getText());

    const type = this.typeChecker.visit(ctx)
    const typeWithAlias = this.typeChecker.encodeToAlias(type)
    const elType = parseTypeAndElimParentheses(type).getChild(1).getText()
    const elTypeWithAlias = this.typeChecker.encodeToAlias(elType);
    const premises: ProofNode[] = [this.visit(ctx.term())]
    const unwrappedConclusion = `tail[${elType}] ${premises[0].unwrappedConclusion}`;
    const unwrappedConclusionWithAlias =
        `tail[${elTypeWithAlias}] ${premises[0].unwrappedConclusionWithAlias}`

    return {
      type: type,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-tail)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises
    } as ProofNode;
  };

  visitListHead = (ctx: ListHeadContext): any => {
    console.log("head", ctx.getText());
    const type = this.typeChecker.visit(ctx)
    const typeWithAlias = this.typeChecker.encodeToAlias(type)
    const premises: ProofNode[] = [this.visit(ctx.term())]
    const unwrappedConclusion = `head[${type}] ${premises[0].unwrappedConclusion}`;
    const unwrappedConclusionWithAlias =
        `head[${typeWithAlias}] ${premises[0].unwrappedConclusionWithAlias}`

    return {
      type: type,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-head)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises
    } as ProofNode;
  };

  visitFix = (ctx: FixContext) => {
    console.log("Visiting a fix", ctx.getText());
    const type = this.typeChecker.visit(ctx)
    const typeWithAlias = this.typeChecker.encodeToAlias(type)
    const premises: ProofNode[] = [this.visit(ctx.term())]
    const unwrappedConclusion = `fix ${premises[0].unwrappedConclusion}`;
    const unwrappedConclusionWithAlias =
        `fix ${premises[0].unwrappedConclusionWithAlias}`

    return {
      type: type,
      wrappedConclusion: `\\Gamma${this.contextExtension}\\vdash ${unwrappedConclusion} : ${type}`,
      wrappedConclusionWithAlias:
          `\\Gamma${this.contextExtensionWithAlies}\\vdash ${unwrappedConclusionWithAlias} : ${typeWithAlias}`,
      unwrappedConclusion: unwrappedConclusion,
      unwrappedConclusionWithAlias: unwrappedConclusionWithAlias,
      rule: `(T-fix)`,
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: premises
    } as ProofNode;

  }

  visitList = (ctx: ListContext): any => {
    return this.visit(ctx.getChild(0))
  }

  getContextInfo(name: string): ContextElement {
    let ctxInfo = this.typeChecker.globalContext.getContextInfo(name)
    if (!ctxInfo) ctxInfo = this.typeChecker.localContext.getContextInfo(name)
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
}