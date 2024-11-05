import {InputAnalyzer} from "./AnalyzeInput";

let input = `
 a : α;
 b : β;
 c : γ;
 f = λ x:α.(λ y:β.(λ z:γ.x : γ -> α) : β -> γ -> α )  : α -> β -> γ -> α;
 f a b c 
 `;


const analyzer = new InputAnalyzer()


analyzer.analyzeInput(input)

analyzer.checkTypes()

// console.log(JSON.stringify(analyzer.generateProofTree(), undefined, 4))

console.log(analyzer.generateProofTree())

input = `
    x : α
    y : α -> α
    z : (α -> α) -> α
    w : ((α -> α) -> α) -> α
    
    M = λ f: α -> α . f : (α -> α) -> (α -> α)
    N = λ x: α . x : α -> α
    P = λ g: α -> α . (g x) : (α -> α) -> α
    Q = λ h: α -> α . (h x) : (α -> α) -> α
    
    (N (M N (P y))) 
 `;






