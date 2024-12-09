import {CharStream, CommonTokenStream, ParserRuleContext, ParseTree} from "antlr4";
import LambdaCalcParser, {ParenthesesContext, ParenTypeContext, TypeContext} from "./antlr/LambdaCalcParser";
import LambdaCalcLexer from "./antlr/LambdaCalcLexer";

export function getTokenLocation(ctx: ParserRuleContext) {
  return [
    ctx.start.line,
    (ctx.stop ? ctx.stop.line : ctx.start.line),
    ctx.start.column,
    (ctx.stop ? ctx.stop.column + ctx.stop.text.length : ctx.start.column + ctx.start.text.length)
  ]
}



export function parseType(input: string): TypeContext {
  const lexer = new LambdaCalcLexer(new CharStream(input));
  const tokens = new CommonTokenStream(lexer);
  const parser = new LambdaCalcParser(tokens);
  return parser.type_();
}

export function eliminateOutParentheses(ctx: ParseTree): any {
  if (ctx instanceof ParenthesesContext || ctx instanceof ParenTypeContext) {
    return ctx.getChild(1)
  }
  return ctx;
}