import { ErrorListener, RecognitionException, Recognizer } from 'antlr4';


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
        throw new Error(`Syntax error at line ${line}:${charPositionInLine} - ${msg}`);
    }
}