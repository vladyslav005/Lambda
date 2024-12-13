import {InputAnalyzer} from "./AnalyzeInput";
import LambdaCalcLexer from "./antlr/LambdaCalcLexer";
import {CharStream, CommonTokenStream} from "antlr4";
import LambdaCalcParser from "./antlr/LambdaCalcParser";
import {TypeChecker} from "./typechecker/TypeChecker";
import {TreeGenerator} from "./tree/TreeGenerator";


let input = `
x : α;
y : α -> α;
z : (α -> α) -> α;
w : ((α -> α) -> α) -> α;

b = < y, y> : (α->α)*(α->α);


M = λ f: α -> α . f : (α -> α) -> (α -> α);
N = λ x: α . x : α -> α;
P = λ g: α -> α . (g x) : (α -> α) -> α;
Q = λ h: α -> α . (h x) : (α -> α) -> α;a : T;
a : T;


(N (M N (P (b.1))));
a;
z : T;
Q;

`;

const lexer = new LambdaCalcLexer(new CharStream(input))


const tokens = new CommonTokenStream(lexer);


const parser = new LambdaCalcParser(tokens);


const ast = parser.expression()

const typeChecker = new TypeChecker();

typeChecker.visit(ast)

const treeGenerator = new TreeGenerator()

const proofTree = treeGenerator.generateTree(ast, typeChecker.globalContext)
//
console.log(ast.toStringTree(parser.ruleNames, parser))
//
// const analyzer = new InputAnalyzer()
//
// analyzer.analyzeInput(input)
//
// analyzer.checkTypes()
//
// // console.log(JSON.stringify(analyzer.generateProofTree(), undefined, 4))
//
// console.log(analyzer.generateProofTree())

input = `
x : α;
y : α -> α;
z : (α -> α) -> α;
w : ((α -> α) -> α) -> α;

b = < y, y> : (α->α)*(α->α);

M = λ f: α -> α . f : (α -> α) -> (α -> α);
N = λ x: α . x : α -> α;
P = λ g: α -> α . (g x) : (α -> α) -> α;
Q = λ h: α -> α . (h x) : (α -> α) -> α;a : T;
a : T;

(N (M N (P (b.1)))) 
 `;










