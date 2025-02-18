import {ErrorListener, RecognitionException, Recognizer} from 'antlr4';
import {SyntaxError} from "./customErrors";


export class CustomLexerErrorListener implements ErrorListener<any> {
  syntaxError(
      recognizer: Recognizer<any>,
      offendingSymbol: any,
      line: number,
      charPositionInLine: number,
      msg: string,
      e: RecognitionException | undefined
  ): void {
    throw new Error(`Lexical error at line ${line}:${charPositionInLine} - ${msg}`);
  }
}


export class CustomParserErrorListener implements ErrorListener<any> {
  syntaxError(
      recognizer: Recognizer<any>,
      offendingSymbol: any,
      line: number,
      charPositionInLine: number,
      msg: string,
      e: RecognitionException | undefined
  ): void {
    throw new SyntaxError(`Syntax error at line ${line}:${charPositionInLine} - ${msg}`, [line, line, 0, charPositionInLine + 1]);
  }

  reportAmbiguity(
      recognizer: Recognizer<any>,
      dfa: any,
      startIndex: number,
      stopIndex: number,
      exact: boolean,
      ambigAlts: any,
      configs: any
  ): void {
    console.warn(
        `PARSER: Ambiguity detected from index ${startIndex} to ${stopIndex}.`
    );
  }

  reportAttemptingFullContext(
      recognizer: Recognizer<any>,
      dfa: any,
      startIndex: number,
      stopIndex: number,
      conflictingAlts: any,
      configs: any
  ): void {
    console.info(
        `PARSER: Attempting full context from index ${startIndex} to ${stopIndex}.`
    );
  }

  reportContextSensitivity(
      recognizer: Recognizer<any>,
      dfa: any,
      startIndex: number,
      stopIndex: number,
      prediction: number,
      configs: any
  ): void {
    console.info(
        `PARSER: Context sensitivity resolved at index range ${startIndex}-${stopIndex}.`
    );
  }
}