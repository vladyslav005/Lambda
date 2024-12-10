import LambdaCalcVisitor from "../antlr/LambdaCalcVisitor";
import {
  ApplicationContext,
  ExprContext,
  FunctionTypeContext,
  GlobalFunctionDeclarationContext,
  GlobalVariableDeclarationContext,
  GreekTypeContext,
  LambdaAbstractionContext,
  ParenthesesContext,
  ParenTypeContext, RecordContext, RecordProjectionContext,
  TupleContext,
  TupleProjectionContext,
  VariableContext
} from "../antlr/LambdaCalcParser";
import {TypeChecker} from "../typechecker/TypeChecker";
import {ParserRuleContext, ParseTree} from "antlr4";
import {Context, ContextElement} from "../context/Context";
import {getTokenLocation, parseType, tupleTypeToArray} from "../utils";

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

  public generateTree(AST: ParseTree, globalContext: Context): ProofNode | undefined {

    this.globalContext = globalContext;
    this.typeChecker.globalContext = globalContext;

    this.localContext = new Context()

    this.visit(AST);

    if (this._proofTree !== undefined) {
      this._proofTree.root = true;
      return this._proofTree;
    }

    const result = this._proofTree;

    this._proofTree = undefined;
    this.typeChecker.clearGlobalContext();
    this.typeChecker.clearLocalContext()

    return result;
  }

  visitExpr = (ctx: ExprContext): any => {
    this._proofTree = this.visit(ctx.term());

  };

  visitGlobalVariableDeclaration = (ctx: GlobalVariableDeclarationContext): any => {

  };

  visitGlobalFunctionDeclaration = (ctx: GlobalFunctionDeclarationContext): any => {

  };

  visitLambdaAbstraction = (ctx: LambdaAbstractionContext): any => {
    console.log("T-abs: " + ctx.getText())

    const ctxExtensionTmp = this.contextExtension
    this.localContext.addVariable(ctx.ID().getText(),
        this.typeChecker.visit(ctx.type_(0)), undefined)
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

    const type = this.typeChecker.visit(ctx);

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

    return {
      type: type,
      conclusion: `\\Gamma ${this.contextExtension} \\vdash ${ctx.getText()} : ${type}`,
      rule: "(T-app)",
      context: ctx,
      tokenLocation: getTokenLocation(ctx),
      root: false,
      isExpandable: false,
      premises: this.visitChildren(ctx),
    } as ProofNode;
  };

  visitTuple = (ctx: TupleContext): any => {
    const type = this.typeChecker.visit(ctx);

    const tupleTypesArray : string[] = []
    const tupleTypeNode = parseType(type)
    tupleTypeToArray(tupleTypeNode, tupleTypesArray)

    const nodeList = []
    const premises : ProofNode[] = []

    for (let i = 0; i < ctx.getChildCount(); i++) {
      if (i % 2 !== 0) {
        nodeList.push(ctx.getChild(i));
        premises.push(this.visit(ctx.getChild(i)));
      }
    }

    const result = {
      type: type,
      conclusion: `\\Gamma ${this.contextExtension} \\vdash ${ctx.getText()} : ${type.replaceAll("*", " \\times  ")}`,
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


    const tupleProjType = this.typeChecker.visit(tuple);

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
              conclusion: `\\Gamma \\vdash  ${tuple.getText()} : ${tupleType.replaceAll("*", " \\times  ")}`,
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
      premises.push(this.visit(ctx.getChild(i+2)));
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

  getContextInfo (name: string): ContextElement {
    let ctxInfo = this.typeChecker.globalContext.getContextInfo(name)
    if (!ctxInfo) ctxInfo = this.typeChecker.localContext.getContextInfo(name)
    if (!ctxInfo) throw new Error("Unrecognized variable: " + name)

    return ctxInfo
  }

}