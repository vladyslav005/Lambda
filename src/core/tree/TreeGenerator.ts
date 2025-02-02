import LambdaCalcVisitor from "../antlr/LambdaCalcVisitor";
import {
  ApplicationContext,
  CaseOfContext,
  ExprContext,
  FunctionTypeContext,
  GlobalFunctionDeclarationContext,
  GlobalVariableDeclarationContext,
  GreekTypeContext,
  InjectionContext,
  LambdaAbstractionContext,
  ParenthesesContext,
  ParenTypeContext,
  RecordContext,
  RecordProjectionContext,
  SequenceContext,
  TupleContext,
  TupleProjectionContext,
  VariableContext
} from "../antlr/LambdaCalcParser";
import {TypeChecker} from "../typechecker/TypeChecker";
import {ParserRuleContext, ParseTree} from "antlr4";
import {Context, ContextElement} from "../context/Context";
import {getTokenLocation, parseType, preprocessString, tupleTypeToArray} from "../utils";
import {TypeError} from "../errorhandling/customErrors";

export interface ProofNode {
  type: string;
  conclusion: string;
  rule: string;
  context: ParserRuleContext;
  tokenLocation: number[],
  declarationLocation?: number[];
  premises?: ProofNode[];
  expandedPremises?: ProofNode[];
  root: boolean;
  isExpandable: boolean;
  isExpanded?: boolean;
}


export class TreeGenerator extends LambdaCalcVisitor<any> {

  private typeChecker: TypeChecker = new TypeChecker();
  private globalContext: Context | undefined;

  private localContext: Context;

  private contextExtension: string;

  constructor() {
    super();
    this._proofTree = undefined;
    this.globalContext = undefined;
    this.localContext = new Context();
    this.contextExtension = "";
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

  visitGlobalVariableDeclaration = (ctx: GlobalVariableDeclarationContext): any => {

  };

  visitGlobalFunctionDeclaration = (ctx: GlobalFunctionDeclarationContext): any => {

  };

  visitLambdaAbstraction = (ctx: LambdaAbstractionContext): any => {
    console.log("T-abs: " + ctx.getText())

    const ctxExtensionTmp = this.contextExtension
    this.localContext.addVariable(ctx.ID().getText(),
        this.typeChecker.decodeAlias(this.typeChecker.visit(ctx.type_(0))), undefined)
    this.typeChecker.localContext = this.localContext;

    this.updateContextExtension()

    const type = this.typeChecker.visit(ctx);
    const body = ctx.term();

    const result = {
      type: type,
      conclusion: `\\Gamma ${ctxExtensionTmp} \\vdash ${ctx.getText()}`,
      rule: "(T-abs)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: [this.visit(body)],
      isExpandable: false
    } as ProofNode;

    this.localContext.deleteVariable(ctx.ID().getText())
    this.typeChecker.clearLocalContext();

    this.updateContextExtension()

    return result;
  };

  visitVariable = (ctx: VariableContext): any => {
    console.log("Var: " + ctx.getText())

    const type = preprocessString(this.typeChecker.visit(ctx));

    let ctxInfo = this.getContextInfo(ctx.getText())


    return {
      type: type,
      conclusion: `\\Gamma ${this.contextExtension} \\vdash ${ctx.getText()} : ${type}`,
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
          conclusion: `${ctx.getText()} : ${type} \\in \\Gamma ${this.contextExtension}`,
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

  visitApplication = (ctx: ApplicationContext): any => {
    console.log("App: " + ctx.getText())

    const type = this.typeChecker.visit(ctx);

    const appStr = ctx.children?.map(child => child.getText()).join("\\hspace{0.2cm}");

    return {
      type: type,
      conclusion: `\\Gamma ${this.contextExtension} \\vdash ${appStr} : ${type}`,
      rule: "(T-app)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: this.visitChildren(ctx),
    } as ProofNode;
  };

  visitSequence = (ctx: SequenceContext): any => {
    console.log("Seq " + ctx.getText())
    const type = this.typeChecker.visit(ctx);

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

    if (seqTerms.length === 1)
      return this.visit(seqTerms[0].ctx)
    else
      return {
        type: type,
        conclusion: `\\Gamma ${this.contextExtension} \\vdash ${seqTerms.map(c => c.ctx.getText()).join(';')} : ${type}`,
        rule: "(T-seq)",
        context: ctx,
        tokenLocation: getTokenLocation(ctx),
        root: false,
        premises: premises,
        isExpandable: false
      } as ProofNode;
  }

  visitTuple = (ctx: TupleContext): any => {
    const type = this.typeChecker.visit(ctx);

    const tupleTypesArray: string[] = []
    const tupleTypeNode = parseType(type)
    tupleTypeToArray(tupleTypeNode, tupleTypesArray)

    const nodeList = []
    const premises: ProofNode[] = []

    for (let i = 0; i < ctx.getChildCount(); i++) {
      if (i % 2 !== 0) {
        nodeList.push(ctx.getChild(i));
        premises.push(this.visit(ctx.getChild(i)));
      }
    }

    const result = {
      type: type,
      conclusion: `\\Gamma ${this.contextExtension} \\vdash ${ctx.getText()} : ${preprocessString(type)}`,
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

  visitTupleProjection = (ctx: TupleProjectionContext): any => {
    const tuple = ctx.getChild(0);
    const tupleType = this.typeChecker.visit(tuple);


    const tupleProjType = this.typeChecker.visit(ctx);

    return {
      type: tupleProjType,
      conclusion: `\\Gamma ${this.contextExtension} \\vdash ${ctx.getText()} : ${tupleProjType}`,
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
              conclusion: `\\Gamma \\vdash  ${tuple.getText()} : ${preprocessString(tupleType)}`,
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

  visitRecord = (ctx: RecordContext): any => {
    const type = this.typeChecker.visit(ctx);
    const typeNode = parseType(type)

    const premises: ProofNode[] = []
    for (let i = 1; i < typeNode.getChildCount(); i += 4) {
      premises.push(this.visit(ctx.getChild(i + 2)));
    }

    const result = {
      type: type,
      conclusion: `\\Gamma ${this.contextExtension} \\vdash ${ctx.getText()} : ${type}`,
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

  visitRecordProjection = (ctx: RecordProjectionContext): any => {
    const record = ctx.getChild(0);
    const recordType = this.typeChecker.visit(record);

    const projectionType = this.typeChecker.visit(ctx)

    return {
      type: projectionType,
      conclusion: `\\Gamma ${this.contextExtension} \\vdash ${ctx.getText()} : ${projectionType}`,
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
              conclusion: `\\Gamma \\vdash  ${record.getText()} : ${recordType}`,
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
    const body = ctx.term()

    const bodyType = this.typeChecker.visit(body)


    return {
      type: variantType,
      conclusion: `\\Gamma ${this.contextExtension} \\vdash ${preprocessString(ctx.getText().replace("]as", "] as "))} : ${variantType}`,
      rule: "(T-variant)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      // declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(record.getText()),
      root: false,
      isExpandable: false,
      premises:
          [
            {
              type: variantType,
              conclusion: `\\Gamma \\vdash  ${body.getText()} : ${bodyType}`,
              rule: "",
              root: false,
              context: ctx,
              tokenLocation: getTokenLocation(ctx),
              // declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(record.getText()),
              isExpandable: false
            }
          ],

    } as ProofNode;

  }

  visitCaseOf = (ctx: CaseOfContext): any => {
    console.log("Cas " + ctx.getText())

    const varNode = ctx.term(0);
    const varName = varNode.getText();
    const caseType = this.typeChecker.visit(ctx);


    const variantType = this.typeChecker.findType(varName, varNode);
    const variantTypeNode = parseType(variantType);
    const variantLabels = this.typeChecker.extractLabels(variantTypeNode);

    const premises: ProofNode[] = [
      // {
      //   type: variantType,
      //   conclusion: `\\Gamma \\vdash  ${varName} : ${preprocessString(variantType)}`,
      //   rule: "",
      //   root: false,
      //   context: ctx,
      //   tokenLocation: getTokenLocation(ctx),
      //   // declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(record.getText()),
      //   isExpandable: false
      // }
      this.visit(varNode)

    ]
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

      const x = 0
    }

    const caseStr = ctx.children?.map((child, i) => {
      return (child.getText() + (i < 2 ? "\\hspace{0.2cm}" : ""))
    }).join("")

    const result = {
      type: caseType,
      conclusion: `\\Gamma ${this.contextExtension} \\vdash ${caseStr} : ${preprocessString(caseType)}`,
      rule: "(T-case)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      premises: premises,
      isExpandable: false
    } as ProofNode;

    console.log("Tuple: ")

    return result;
  };


  visitParentheses = (ctx: ParenthesesContext): any => {
    const tmp = this.visit(ctx.getChild(1))
    console.log(ctx.getText())
    return tmp;
  };

  visitGreekType = (ctx: GreekTypeContext): any => {

  };

  visitFunctionType = (ctx: FunctionTypeContext): any => {

  };

  visitParenType = (ctx: ParenTypeContext): any => {

  };

  updateContextExtension() {
    this.contextExtension = "";

    if (this.localContext.isEmpty()) return;

    const ctxElements = this.localContext.getAllElements()
    this.contextExtension = ",";

    for (const element of ctxElements) {
      this.contextExtension += element.name + ':' + element.type + ', ';
    }

    this.contextExtension = this.contextExtension.substring(0, this.contextExtension.lastIndexOf(','));
  }

  getContextInfo(name: string): ContextElement {
    let ctxInfo = this.typeChecker.globalContext.getContextInfo(name)
    if (!ctxInfo) ctxInfo = this.typeChecker.localContext.getContextInfo(name)
    if (!ctxInfo) throw new Error("Unrecognized variable: " + name)

    return ctxInfo
  }

}