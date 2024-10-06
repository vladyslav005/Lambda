// Generated from src/core/antlr/LambdaCalc.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
import {
	ATN,
	ATNDeserializer,
	CharStream,
	DecisionState, DFA,
	Lexer,
	LexerATNSimulator,
	RuleContext,
	PredictionContextCache,
	Token
} from "antlr4";
export default class LambdaCalcLexer extends Lexer {
	public static readonly T__0 = 1;
	public static readonly LAMBDA = 2;
	public static readonly ID = 3;
	public static readonly GREEK_TYPE = 4;
	public static readonly ARROW = 5;
	public static readonly COLON = 6;
	public static readonly DOT = 7;
	public static readonly SEMI = 8;
	public static readonly LPAREN = 9;
	public static readonly RPAREN = 10;
	public static readonly WS = 11;
	public static readonly EOF = Token.EOF;

	public static readonly channelNames: string[] = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	public static readonly literalNames: (string | null)[] = [ null, "'='", 
                                                            null, null, 
                                                            null, "'->'", 
                                                            "':'", "'.'", 
                                                            "';'", "'('", 
                                                            "')'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, null, 
                                                             "LAMBDA", "ID", 
                                                             "GREEK_TYPE", 
                                                             "ARROW", "COLON", 
                                                             "DOT", "SEMI", 
                                                             "LPAREN", "RPAREN", 
                                                             "WS" ];
	public static readonly modeNames: string[] = [ "DEFAULT_MODE", ];

	public static readonly ruleNames: string[] = [
		"T__0", "LAMBDA", "ID", "GREEK_TYPE", "ARROW", "COLON", "DOT", "SEMI", 
		"LPAREN", "RPAREN", "WS",
	];


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(this, LambdaCalcLexer._ATN, LambdaCalcLexer.DecisionsToDFA, new PredictionContextCache());
	}

	public get grammarFileName(): string { return "LambdaCalc.g4"; }

	public get literalNames(): (string | null)[] { return LambdaCalcLexer.literalNames; }
	public get symbolicNames(): (string | null)[] { return LambdaCalcLexer.symbolicNames; }
	public get ruleNames(): string[] { return LambdaCalcLexer.ruleNames; }

	public get serializedATN(): number[] { return LambdaCalcLexer._serializedATN; }

	public get channelNames(): string[] { return LambdaCalcLexer.channelNames; }

	public get modeNames(): string[] { return LambdaCalcLexer.modeNames; }

	public static readonly _serializedATN: number[] = [4,0,11,56,6,-1,2,0,7,
	0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,
	9,2,10,7,10,1,0,1,0,1,1,1,1,1,2,1,2,5,2,30,8,2,10,2,12,2,33,9,2,1,3,1,3,
	1,4,1,4,1,4,1,5,1,5,1,6,1,6,1,7,1,7,1,8,1,8,1,9,1,9,1,10,4,10,51,8,10,11,
	10,12,10,52,1,10,1,10,0,0,11,1,1,3,2,5,3,7,4,9,5,11,6,13,7,15,8,17,9,19,
	10,21,11,1,0,5,2,0,92,92,955,955,3,0,65,90,95,95,97,122,4,0,48,57,65,90,
	95,95,97,122,1,0,945,969,3,0,9,10,13,13,32,32,57,0,1,1,0,0,0,0,3,1,0,0,
	0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,0,13,1,0,0,0,0,15,1,
	0,0,0,0,17,1,0,0,0,0,19,1,0,0,0,0,21,1,0,0,0,1,23,1,0,0,0,3,25,1,0,0,0,
	5,27,1,0,0,0,7,34,1,0,0,0,9,36,1,0,0,0,11,39,1,0,0,0,13,41,1,0,0,0,15,43,
	1,0,0,0,17,45,1,0,0,0,19,47,1,0,0,0,21,50,1,0,0,0,23,24,5,61,0,0,24,2,1,
	0,0,0,25,26,7,0,0,0,26,4,1,0,0,0,27,31,7,1,0,0,28,30,7,2,0,0,29,28,1,0,
	0,0,30,33,1,0,0,0,31,29,1,0,0,0,31,32,1,0,0,0,32,6,1,0,0,0,33,31,1,0,0,
	0,34,35,7,3,0,0,35,8,1,0,0,0,36,37,5,45,0,0,37,38,5,62,0,0,38,10,1,0,0,
	0,39,40,5,58,0,0,40,12,1,0,0,0,41,42,5,46,0,0,42,14,1,0,0,0,43,44,5,59,
	0,0,44,16,1,0,0,0,45,46,5,40,0,0,46,18,1,0,0,0,47,48,5,41,0,0,48,20,1,0,
	0,0,49,51,7,4,0,0,50,49,1,0,0,0,51,52,1,0,0,0,52,50,1,0,0,0,52,53,1,0,0,
	0,53,54,1,0,0,0,54,55,6,10,0,0,55,22,1,0,0,0,3,0,31,52,1,6,0,0];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!LambdaCalcLexer.__ATN) {
			LambdaCalcLexer.__ATN = new ATNDeserializer().deserialize(LambdaCalcLexer._serializedATN);
		}

		return LambdaCalcLexer.__ATN;
	}


	static DecisionsToDFA = LambdaCalcLexer._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );
}