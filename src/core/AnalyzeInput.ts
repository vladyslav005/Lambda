import {CharStream, CommonTokenStream, ParseTree} from "antlr4";
import LambdaCalcLexer from "./antlr/LambdaCalcLexer";
import LambdaCalcParser from "./antlr/LambdaCalcParser";
import {ProofNode, TreeGenerator} from "./tree/TreeGenerator";
import {CustomLexerErrorListener, CustomParserErrorListener} from "./errorhandling/ErrorListeners";


export class InputAnalyzer {

  private tokens: CommonTokenStream | undefined;

  private lexer: LambdaCalcLexer | undefined;

  private parser: LambdaCalcParser | undefined;

  private AST: ParseTree | undefined;

  private treeGenerator: TreeGenerator;


  constructor() {
    this.treeGenerator = new TreeGenerator()
  }

  public analyzeInput(input: string): ProofNode | undefined {
    this.lexer = new LambdaCalcLexer(new CharStream(input))
    this.lexer.removeErrorListeners()
    this.lexer.addErrorListener(new CustomLexerErrorListener())

    this.tokens = new CommonTokenStream(this.lexer);

    this.parser = new LambdaCalcParser(this.tokens);
    this.parser.removeErrorListeners()
    this.parser.addErrorListener(new CustomParserErrorListener())

    this.AST = this.parser.expression();

    return this.treeGenerator.generateTree(this.AST)
  }
}