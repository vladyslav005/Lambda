import LambdaCalcVisitor from "../antlr/LambdaCalcVisitor";
import {
    ApplicationContext,
    ExprContext, ExpressionContext,
    FunctionTypeContext,
    GlobalFunctionDeclarationContext,
    GlobalVariableDeclarationContext,
    GreekTypeContext,
    LambdaAbstractionContext,
    ParenthesesContext,
    ParenTypeContext, TermContext,
    VariableContext
} from "../antlr/LambdaCalcParser";
import {ParseTree} from "antlr4";
import {Context} from "../typechecker/TypeChecker";

interface ProofNode {
    conclusion: string;
    rule: string;
    premises?: ProofNode[];
}


export class TreeGenerator extends LambdaCalcVisitor<any> {

    private globalContext: Context;


    constructor(globalContext: Context) {
        super();
        this.globalContext = globalContext;
    }

    visitExpr = (ctx: ExprContext): any => {
        const childCount = ctx.getChildCount();

        let term = undefined;

        for (let i = 0; i < childCount; i++) {
            if (ctx.getChild(i) instanceof TermContext) {
                term = ctx.getChild(i)
                console.log(term.getText())
            }
        }


    };

    visitGlobalVariableDeclaration = (ctx: GlobalVariableDeclarationContext): any => {

    };

    visitGlobalFunctionDeclaration = (ctx: GlobalFunctionDeclarationContext): any => {

    };

    visitLambdaAbstraction = (ctx: LambdaAbstractionContext): any => {

    };

    visitVariable = (ctx: VariableContext): any => {

    };

    visitApplication = (ctx: ApplicationContext): any => {

    };

    visitParentheses = (ctx: ParenthesesContext): any => {

    };

    visitGreekType = (ctx: GreekTypeContext): any => {

    };

    visitFunctionType = (ctx: FunctionTypeContext): any => {

    };

    visitParenType = (ctx: ParenTypeContext): any => {

    };

}