
import antlr4, {CharStream, CommonTokenStream} from "antlr4";
import LambdaCalcLexer from "./antlr/LambdaCalcLexer";
import LambdaCalcParser from "./antlr/LambdaCalcParser";
import {TreeGenerator} from "./tree/TreeGenerator";
import TypeChecker from "./typechecker/TypeChecker";

const input = `
    x : α
    z : β
    M = λ y:α.y : α -> α
    (λ y:α->α.(y x)) M 
    `;


const lexer = new LambdaCalcLexer(new CharStream(input));

const tokens = new CommonTokenStream(lexer);

const parser = new LambdaCalcParser(tokens);

const typeChecker = new TypeChecker()

const tree = parser.expression();


const typeCheck = typeChecker.visit(tree)



const globalContext = typeChecker.globalContext;

const treeGenerator = new TreeGenerator(globalContext);
treeGenerator.visit(tree)
const proofTree = treeGenerator.proofTree;

console.log(JSON.stringify(proofTree, null, 2));




