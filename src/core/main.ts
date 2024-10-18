import {InputAnalyzer} from "./AnalyzeInput";

const input = `
x : α
z : β
M = λ y:α.y : α -> α
(λ y:α->α.(y x)) M 
    `;

// const input = ""

const analyzer = new InputAnalyzer()


analyzer.analyzeInput(input)

analyzer.checkTypes()

console.log(JSON.stringify(analyzer.generateProofTree(), undefined, 4))






