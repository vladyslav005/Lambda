
import {InputAnalyzer} from "./AnalyzeInput";

const input = `
    f : (α -> β) -> (α -> γ)
    g : α -> β
    h : α
    f g h
    `;

// const input = ""

const analyzer = new InputAnalyzer()


analyzer.analyzeInput(input)

analyzer.checkTypes()

console.log(analyzer.generateTree())






