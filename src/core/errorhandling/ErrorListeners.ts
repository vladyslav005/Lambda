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
    throw new SyntaxError(`at line ${line}:${charPositionInLine} - ${msg}`, [line, line, 0, charPositionInLine + 1]);
  }
}