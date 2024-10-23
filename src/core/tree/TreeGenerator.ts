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
import {ParseTree} from "antlr4";

export interface ProofNode {
  type: string;
  conclusion: string;
  rule: string;
  // context: ParserRuleContext;
  premises?: ProofNode[];
  root: boolean;
}


export class TreeGenerator extends LambdaCalcVisitor<any> {

  private typeChecker: TypeChecker = new TypeChecker();
  private globalContext: Context | undefined;

  private contextExtension: string | undefined;

  constructor() {
    super();
    this._proofTree = undefined;
    this.globalContext = undefined;


  }

  private _proofTree: ProofNode | undefined;

  get proofTree(): ProofNode | undefined {
    return this._proofTree;
  }

  public generateTree(AST: ParseTree, globalContext: Context): ProofNode | undefined {

    this.globalContext = globalContext;
    this.typeChecker.globalContext = globalContext;
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

    const localContext = new Context();
    localContext.addVariable(ctx.ID().getText(),
        this.typeChecker.visit(ctx.type_())
    )


    //TODO : IS IT CORRECT???
    this.contextExtension = `, ${ctx.ID().getText()} :  ${localContext.getType(ctx.ID().getText())}`;

    this.typeChecker.localContext = localContext;

    const type = this.typeChecker.visit(ctx);
    const body = ctx.term();

    const result = {
      type: type,
      conclusion: `\\Gamma \\vdash ${ctx.getText()} : ${type}`,
      rule: "(T-abs)",
      // context: ctx,
      root: false,
      premises: [this.visit(body)],
    } as ProofNode;

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
      premises: [
        {
          type: type,
          conclusion: `${ctx.getText()} : ${type} \\in \\Gamma`,
          rule: "",
          root: false,
        }

      ],
      // context: ctx,
    } as ProofNode;
  };

  visitApplication = (ctx: ApplicationContext): any => {
    console.log("App: " + ctx.getText())

    const type = this.typeChecker.visit(ctx);

    return {
      type: type,
      conclusion: `\\Gamma${this.contextExtension ? this.contextExtension : ''} \\vdash ${ctx.getText()} : ${type}`,
      rule: "(T-app)",
      // context: ctx,
      root: false,
      premises: this.visitChildren(ctx),
    } as ProofNode;

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