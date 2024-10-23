import {InputAnalyzer} from "./AnalyzeInput";

let input = `
x : α
z : β
M = λ y:α.y : α -> α
(λ y:α->α.(y x)) M 
    `;


const analyzer = new InputAnalyzer()


analyzer.analyzeInput(input)

analyzer.checkTypes()

console.log(JSON.stringify(analyzer.generateProofTree(), undefined, 4))


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






