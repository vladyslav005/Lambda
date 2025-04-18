import {CharStream, CommonTokenStream, ParserRuleContext, ParseTree} from "antlr4";
import LambdaCalcParser, {
  FunctionTypeContext,
  GreekTypeContext,
  ListTypeContext,
  ParenthesesContext,
  ParenTypeContext,
  RecordTypeContext,
  TupleTypeContext,
  TypeContext
} from "./antlr/LambdaCalcParser";
import LambdaCalcLexer from "./antlr/LambdaCalcLexer";
import {Context} from "./context/Context";

export function getTokenLocation(ctx: ParserRuleContext) {
  return [
    ctx.start.line,
    (ctx.stop ? ctx.stop.line : ctx.start.line),
    ctx.start.column,
    (ctx.stop ? ctx.stop.column + ctx.stop.text.length : ctx.start.column + ctx.start.text.length)
  ]
}


export function parseTypeAndElimParentheses(input: string): TypeContext {
  const lexer = new LambdaCalcLexer(new CharStream(input));
  const tokens = new CommonTokenStream(lexer);
  const parser = new LambdaCalcParser(tokens);
  return eliminateOutParentheses(parser.type_());
}

export function parseType(input: string): TypeContext {
  const lexer = new LambdaCalcLexer(new CharStream(input));
  const tokens = new CommonTokenStream(lexer);
  const parser = new LambdaCalcParser(tokens);
  return parser.type_();
}

export function eliminateOutParentheses(ctx: ParseTree): any {
  if (ctx instanceof ListTypeContext) {
    let listType = ctx.getChild(1)
    if (listType instanceof ParenthesesContext || listType instanceof ParenTypeContext)
      return parseType("List " + listType.getChild(1).getText())
  }

  if (ctx instanceof ParenthesesContext || ctx instanceof ParenTypeContext) {
    return ctx.getChild(1)
  }
  return ctx;
}


export function tupleTypeToArray(ctx: TypeContext, output: string[]): any {
  const left = ctx.getChild(0);
  const right = ctx.getChild(2);

  output.push(eliminateOutParentheses(left).getText());

  if (right instanceof ParenTypeContext || right instanceof GreekTypeContext) {
    output.push(eliminateOutParentheses(right).getText());
  } else if (right instanceof TypeContext) {
    tupleTypeToArray(right, output);
  }
}


export function preprocessString(str: string): string {

  return str//.replaceAll(" ", "\\hspace{0.2cm}")
      .replaceAll("=>", "{\\Rightarrow}")
      .replaceAll("*", "{\\times}")
      .replaceAll("->", "{\\rightarrow}")

      .replaceAll(/</g, "{\\langle}")

      .replaceAll(/>/g, "{\\rangle}")
      .replaceAll(/`/g, "<")
      .replaceAll(/~/g, ">")
      .replaceAll(/§/g, "*")
      .replaceAll(/_/g, "{\\_}")
      .replaceAll(/@/g, "_")

      .replaceAll(" ", "{\\ }")
}

export function preprocessTex(text: string): string {
  const greekToLatex: { [key: string]: string } = {
    'α': '\\alpha',
    'β': '\\beta',
    'γ': '\\gamma',
    'δ': '\\delta',
    'ε': '\\epsilon',
    'ζ': '\\zeta',
    'η': '\\eta',
    'θ': '\\theta',
    'ι': '\\iota',
    'κ': '\\kappa',
    'λ': '\\lambda',
    'μ': '\\mu',
    'ν': '\\nu',
    'ξ': '\\xi',
    'ο': 'o',
    'π': '\\pi',
    'ρ': '\\rho',
    'σ': '\\sigma',
    'τ': '\\tau',
    'υ': '\\upsilon',
    'φ': '\\phi',
    'χ': '\\chi',
    'ψ': '\\psi',
    'ω': '\\omega',
    'Α': '\\Alpha',
    'Β': '\\Beta',
    'Γ': '\\Gamma',
    'Δ': '\\Delta',
    'Ε': '\\Epsilon',
    'Ζ': '\\Zeta',
    'Η': '\\Eta',
    'Θ': '\\Theta',
    'Ι': '\\Iota',
    'Κ': '\\Kappa',
    'Λ': '\\Lambda',
    'Μ': '\\Mu',
    'Ν': '\\Nu',
    'Ξ': '\\Xi',
    'Ο': 'O',
    'Π': '\\Pi',
    'Ρ': '\\Rho',
    'Σ': '\\Sigma',
    'Τ': '\\Tau',
    'Υ': '\\Upsilon',
    'Φ': '\\Phi',
    'Χ': '\\Chi',
    'Ψ': '\\Psi',
    'Ω': '\\Omega',
  };

  return text
      .replace(/[α-ωΑ-Ω]/g, (match) => greekToLatex[match] || match)
      .replaceAll("{\\Rightarrow}", " \\Rightarrow ")
      .replaceAll("{\\times}", " \\times ")
      .replaceAll("{\\rightarrow}", " \\rightarrow ")
      .replaceAll("{\\langle}", " \\langle ")
      .replaceAll("{\\rangle}", " \\rangle ")

      .replaceAll("{\\ }", " ")
}

export function decodeAlias(typeAlias: string, aliasCtx: Context) {

  const context = aliasCtx.getAllElements();

  for (let i = 0; i < context.length; i++) {
    if (typeAlias.match(new RegExp(`\\b${context[i].name}\\b`, 'g')) !== null) {
      let aliasNode = parseTypeAndElimParentheses(context[i].type)
      if ((aliasNode instanceof FunctionTypeContext ||
              aliasNode instanceof TupleTypeContext ||
              aliasNode instanceof ListTypeContext ||
              aliasNode instanceof RecordTypeContext)
          && context[i].name !== typeAlias.replaceAll('List ', ''))
        typeAlias = typeAlias.replaceAll(new RegExp(`\\b${context[i].name}\\b`, 'g'), '(' + context[i].type + ')');
      else
        typeAlias = typeAlias.replaceAll(new RegExp(`\\b${context[i].name}\\b`, 'g'), context[i].type);

      i = -1;
    }
  }

  return typeAlias;
}

export function encodeToAlias(typeAlias: string, aliasCtx: Context): string {

  const context = aliasCtx.getAllElements()

  for (let i = 0; i < context.length; i++) {
    if (typeAlias.includes(`${context[i].type}`)) {

      let aliasNode = parseTypeAndElimParentheses(context[i].type)

      if ((aliasNode instanceof FunctionTypeContext ||
              aliasNode instanceof TupleTypeContext ||
              aliasNode instanceof ListTypeContext ||
              aliasNode instanceof RecordTypeContext)
          && context[i].name !== typeAlias.replaceAll('List ', ''))
        typeAlias = typeAlias.replaceAll(`(${context[i].type})`, context[i].name);

      typeAlias = typeAlias.replaceAll(`${context[i].type}`, context[i].name);

      i = -1;

    }
  }

  return typeAlias;
}