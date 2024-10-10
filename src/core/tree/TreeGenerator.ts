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
import TypeChecker, {Context} from "../typechecker/TypeChecker";

export interface ProofNode {
    type: string;
    conclusion: string;
    rule: string;
    // context: ParserRuleContext;
    premises?: ProofNode[];
}


export class TreeGenerator extends LambdaCalcVisitor<any> {

    private typeChecker: TypeChecker = new TypeChecker();
    private globalContext: Context;
    private _proofTree: ProofNode | undefined;


    get proofTree(): ProofNode | undefined {
        return this._proofTree;
    }

    constructor(globalContext: Context) {
        super();
        this._proofTree = undefined;
        this.globalContext = globalContext;

        this.typeChecker.globalContext = globalContext;
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

        this.typeChecker.localContext = localContext;

        const type = this.typeChecker.visit(ctx);
        const body = ctx.term();

        const result = {
            type : type,
            conclusion: ctx.getText(),
            rule: "T-app",
            // context: ctx,
            premises: [this.visit(body)],
        } as ProofNode;

        this.typeChecker.clearLocalContext();

        return result;
    };

    visitVariable = (ctx: VariableContext): any => {
        console.log("Var: " + ctx.getText())

        const type = this.typeChecker.visit(ctx);

        return {
            type : type,
            conclusion: ctx.getText(),
            rule: "T-var",
            // context: ctx,
        } as ProofNode;
    };

    visitApplication = (ctx: ApplicationContext): any => {
        console.log("App: " + ctx.getText())

        const type = this.typeChecker.visit(ctx);

        return {
            type : type,
            conclusion: ctx.getText(),
            rule: "T-app",
            // context: ctx,
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