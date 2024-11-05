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
  ParenTypeContext,
  VariableContext
} from "../antlr/LambdaCalcParser";
import {Context, TypeChecker} from "../typechecker/TypeChecker";
import {ParserRuleContext, ParseTree} from "antlr4";

export interface ProofNode {
  type: string;
  conclusion: string;
  rule: string;
  context: ParserRuleContext;
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
        this.typeChecker.visit(ctx.type_(0))
    )

    //TODO : IS IT CORRECT???
    // TODO : КОСТИЛЬ
    this.contextExtension = (this.contextExtension ? this.contextExtension : '') + `, ${ctx.ID().getText()} :  ${this.localContext.getType(ctx.ID().getText())}`;

    this.typeChecker.localContext = this.localContext;

    const type = this.typeChecker.visit(ctx);
    const body = ctx.term();

    const result = {
      type: type,
      conclusion: `\\Gamma \\vdash ${ctx.getText()}`,
      rule: "(T-abs)",
      context: ctx,
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
      premises: [
        {
          type: type,
          conclusion: `${ctx.getText()} : ${type} \\in \\Gamma`,
          rule: "",
          root: false,
          context: ctx
        }

      ],
    } as ProofNode;
  };

  visitApplication = (ctx: ApplicationContext): any => {
    console.log("App: " + ctx.getText())

    const type = this.typeChecker.visit(ctx);

    const returnNode =  {
      type: type,
      conclusion: `\\Gamma${this.contextExtension ? this.contextExtension : ''} \\vdash ${ctx.getText()} : ${type}`,
      rule: "(T-app)",
      context: ctx,
      root: false,
      premises: this.visitChildren(ctx),
    } as ProofNode;


    // TODO : КОСТИЛЬ
    if (this.contextExtension) {
      this.contextExtension = undefined;
    }


    return returnNode;
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

}