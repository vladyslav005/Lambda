
import antlr4, {CharStream, CommonTokenStream} from "antlr4";
import LambdaCalcLexer from "./antlr/LambdaCalcLexer";
import LambdaCalcParser from "./antlr/LambdaCalcParser";
import {TreeGenerator} from "./tree/TreeGenerator";
import TypeChecker from "./typechecker/TypeChecker";

const input = `
    f : (α -> β) -> (α -> γ)
    g : α -> β
    h : α
    f g h
    `;


const lexer = new LambdaCalcLexer(new CharStream(input));

const tokens = new CommonTokenStream(lexer);

const parser = new LambdaCalcParser(tokens);

const typeChecker = new TypeChecker()

const tree = parser.expression();


const typeCheck = typeChecker.visit(tree)

const globalContext = typeChecker.globalContext;



const treeGenerator = new TreeGenerator(globalContext);

treeGenerator.visit(tree);




