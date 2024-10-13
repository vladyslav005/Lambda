import {CharStream, CommonTokenStream, Lexer, ParseTree} from "antlr4";
import LambdaCalcLexer from "./antlr/LambdaCalcLexer";
import LambdaCalcParser from "./antlr/LambdaCalcParser";
import {TypeChecker, Context} from "./typechecker/TypeChecker";
import {ProofNode, TreeGenerator} from "./tree/TreeGenerator";
import {CustomLexerErrorListener, CustomParserErrorListener} from "./errorhandling/ErrorListeners";


export class InputAnalyzer {

    private input : string | undefined;
    private tokens : CommonTokenStream | undefined;

    private lexer : LambdaCalcLexer | undefined;

    private parser : LambdaCalcParser | undefined;

    private AST : ParseTree | undefined;

    private typeChecker : TypeChecker;
    private treeGenerator : TreeGenerator;

    private globalContext : Context | undefined;

    constructor() {
        this.typeChecker = new TypeChecker();

        this.treeGenerator = new TreeGenerator()
    }

    public analyzeInput(input: string) {
        this.input = input;
        this.lexer = new LambdaCalcLexer(new CharStream(input))
        this.lexer.removeErrorListeners()
        this.lexer.addErrorListener(new CustomLexerErrorListener())

        this.tokens = new CommonTokenStream(this.lexer);

        this.parser = new LambdaCalcParser(this.tokens);
        this.parser.removeErrorListeners()
        this.parser.addErrorListener(new CustomParserErrorListener())

        this.AST = this.parser.expression();
    }


    // CHECK type and throw exceptions
    public checkTypes() {
        if (!this.AST) {
            throw new Error("Error: Can't check types, AST is undefined");
        }

        this.typeChecker.visit(this.AST)
        this.globalContext = this.typeChecker.globalContext;
    }

    public generateProofTree() : ProofNode | undefined {

        if (!this.globalContext) {
            throw new Error("Error: Can't generate tree, global context is empty");
        }

        if (!this.AST) {
            throw new Error("Error: Can't generate tree, AST is undefined");
        }

        return this.treeGenerator.generateTree(this.AST, this.globalContext);
    }

    public clearContext() {
        this.typeChecker.clearLocalContext()
        this.typeChecker.clearGlobalContext()

        this.globalContext = undefined;
    }

}