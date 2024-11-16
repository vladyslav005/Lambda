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
  ParenTypeContext, TupleContext, TupleProjectionContext,
  VariableContext
} from "../antlr/LambdaCalcParser";
import {Context, TypeChecker} from "../typechecker/TypeChecker";
import {ParserRuleContext, ParseTree} from "antlr4";

export interface ProofNode {
  type: string;
  conclusion: string;
  rule: string;
  context: ParserRuleContext;
  tokenLocation: number[],
  declarationLocation?: number[];
  premises?: ProofNode[];
  root: boolean;
}


export class TreeGenerator extends LambdaCalcVisitor<any> {

  private typeChecker: TypeChecker = new TypeChecker();
  private globalContext: Context | undefined;

  private localContext: Context;

  private contextExtension: string | undefined;

  constructor() {
    super();
    this._proofTree = undefined;
    this.globalContext = undefined;
    this.localContext = new Context();


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

    this.localContext.addVariable(ctx.ID().getText(),
        this.typeChecker.visit(ctx.type_(0)), undefined
    )

    //TODO : IS IT CORRECT???
    // TODO : КОСТИЛЬ
    const contextExtensionTmp = this.contextExtension;

    this.contextExtension = `, ${ctx.ID().getText()} :  ${this.localContext.getType(ctx.ID().getText())}`;

    this.typeChecker.localContext = this.localContext;

    const type = this.typeChecker.visit(ctx);
    const body = ctx.term();

    const result = {
      type: type,
      conclusion: `\\Gamma${contextExtensionTmp ? contextExtensionTmp : ''} \\vdash ${ctx.getText()}`,
      rule: "(T-abs)",
      context: ctx,
      tokenLocation: this.typeChecker.getTokenLocation(ctx),
      root: false,
      premises: [this.visit(body)],
    } as ProofNode;

    this.localContext.deleteVariable(ctx.ID().getText())
    this.typeChecker.clearLocalContext();
    this.contextExtension = undefined

    return result;
  };

  visitVariable = (ctx: VariableContext): any => {
    console.log("Var: " + ctx.getText())

    const type = this.typeChecker.visit(ctx);

    return {
      type: type,
      conclusion: `\\Gamma \\vdash ${ctx.getText()} : ${type}`,
      rule: "(T-var)",
      root: false,
      context: ctx,
      tokenLocation: this.typeChecker.getTokenLocation(ctx),
      declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(ctx.getText()),
      premises: [
        {
          type: type,
          conclusion: `${ctx.getText()} : ${type} \\in \\Gamma`,
          rule: "",
          root: false,
          context: ctx,
          tokenLocation: this.typeChecker.getTokenLocation(ctx),
          declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(ctx.getText()),

        }

      ],
    } as ProofNode;
  };

  visitApplication = (ctx: ApplicationContext): any => {
    console.log("App: " + ctx.getText())

    const type = this.typeChecker.visit(ctx);

    const returnNode = {
      type: type,
      conclusion: `\\Gamma${this.contextExtension ? this.contextExtension : ''} \\vdash ${ctx.getText()} : ${type}`,
      rule: "(T-app)",
      context: ctx,
      tokenLocation: this.typeChecker.getTokenLocation(ctx),
      root: false,
      premises: this.visitChildren(ctx),
    } as ProofNode;


    return returnNode;
  };

  visitTuple = (ctx: TupleContext): any => {
    const type = this.typeChecker.visit(ctx);

    const tupleTypesArray : string[] = []
    const tupleTypeNode = this.typeChecker.parseType(type)
    this.typeChecker.tupleTypeToArray(tupleTypeNode, tupleTypesArray)

    const nodeList = []
    const premises : ProofNode[] = []
    const premisesStr : string[] = []

    for (let i = 0; i < ctx.getChildCount(); i++) {
      if (i % 2 !== 0) {
        nodeList.push(ctx.getChild(i));
        premises.push(this.visit(ctx.getChild(i)));
      }
    }

    nodeList.map((node, index) => {
      premisesStr.push(node.getText() + ':'+ tupleTypesArray[index]);
    })

    const result = {
      type: type,
      conclusion: `\\Gamma \\vdash ${ctx.getText()} : ${type.replaceAll("*", " \\times  ")}`,
      rule: "(T-tuple)",
      context: ctx,
      tokenLocation: this.typeChecker.getTokenLocation(ctx),
      root: false,
      premises: premises,
    } as ProofNode;

    console.log("Tuple: " + ctx.getText())

    return result;
  }

  visitTupleProjection = (ctx: TupleProjectionContext): any => {
    const tuple = ctx.getChild(0);
    const tupleType = this.typeChecker.visit(tuple);

    const projectionIndex = parseInt(ctx.getChild(2).getText());


    const tupleTypesArray : string[] = []
    const tupleTypeNode = this.typeChecker.parseType(tupleType)
    this.typeChecker.tupleTypeToArray(tupleTypeNode, tupleTypesArray)

    const result = {
      type: tupleTypesArray[projectionIndex - 1],
      conclusion: `\\Gamma \\vdash ${ctx.getText()} : ${tupleTypesArray[projectionIndex - 1]}`,
      rule: "(T-proj)",
      context: ctx,
      tokenLocation: this.typeChecker.getTokenLocation(ctx),
      declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(tuple.getText()),
      root: false,
      premises:
      [
        {
          type: tupleType,
          conclusion: `\\Gamma \\vdash  ${tuple.getText()} : ${tupleType.replaceAll("*", " \\times  ")}`,
          rule: "",
          root: false,
          context: ctx,
          tokenLocation: this.typeChecker.getTokenLocation(ctx),
          declarationLocation: this.typeChecker.globalContext.getDeclarationLocation(tuple.getText()),
        }
      ],

    } as ProofNode;


    return result;
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

}