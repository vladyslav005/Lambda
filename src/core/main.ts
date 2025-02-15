import LambdaCalcLexer from "./antlr/LambdaCalcLexer";
import {CharStream, CommonTokenStream} from "antlr4";
import LambdaCalcParser from "./antlr/LambdaCalcParser";
import {TypeChecker} from "./typechecker/TypeChecker";
import {TreeGenerator} from "./tree/TreeGenerator";
import {InputAnalyzer} from "./AnalyzeInput";


let input = `
x : α;
y : α -> α;

M = λ f: α -> α . f : (α -> α) -> (α -> α);
N = λ x: α . x : α -> α;
P = λ g: α -> α . (g x) : (α -> α) -> α;
Q = λ h: α -> α . (h x) : (α -> α) -> α; 

 N (P y); 

`;

// const lexer = new LambdaCalcLexer(new CharStream(input))
//
//
// const tokens = new CommonTokenStream(lexer);
//
//
// const parser = new LambdaCalcParser(tokens);
//
//
// const ast = parser.expression()
//
// const typeChecker = new TypeChecker();
//
// typeChecker.visit(ast)
//
// const treeGenerator = new TreeGenerator()

// const proofTree = treeGenerator.generateTree(ast, typeChecker.globalContext, typeChecker.aliasContext)
//
// console.log(ast.toStringTree(parser.ruleNames, parser))
//
const analyzer = new InputAnalyzer()

analyzer.analyzeInput(input)

analyzer.checkTypes()

console.log(analyzer.generateProofTree())

// console.log(analyzer.generateProofTree())

input = `
x : α;
y : α -> α;
z : (α -> α) -> α;
w : ((α -> α) -> α) -> α;

newType = (α->α)*(α->α);

b = < y, y> : newType;

M = λ f: α -> α . f : (α -> α) -> (α -> α);
N = λ x: α . x : α -> α;
P = λ g: α -> α . (g x) : (α -> α) -> α;
Q = λ h: α -> α . (h x) : (α -> α) -> α;a : T;
a : T;

(N (M N (P (b.1))));
 `;


input = `
PhysicalAddr = < firstlast : String, addr : String> ;
VirtualAddr = <name : String, email : String>;

Addr = PhysicalAddr * VirtualAddr;

a : Addr;

a;

`;






