// Generated from ./src/core/antlr/LambdaCalc.g4 by ANTLR 4.13.2
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
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly LAMBDA = 5;
	public static readonly ID = 6;
	public static readonly GREEK_TYPE = 7;
	public static readonly NATURAL_NUMBER = 8;
	public static readonly COMMA = 9;
	public static readonly ARROW = 10;
	public static readonly COLON = 11;
	public static readonly DOT = 12;
	public static readonly SEMI = 13;
	public static readonly LPAREN = 14;
	public static readonly RPAREN = 15;
	public static readonly WS = 16;
	public static readonly EOF = Token.EOF;

	public static readonly channelNames: string[] = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	public static readonly literalNames: (string | null)[] = [ null, "'='", 
                                                            "'<'", "'>'", 
                                                            "'*'", null, 
                                                            null, null, 
                                                            null, "','", 
                                                            "'->'", "':'", 
                                                            "'.'", "';'", 
                                                            "'('", "')'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, null, 
                                                             null, null, 
                                                             null, "LAMBDA", 
                                                             "ID", "GREEK_TYPE", 
                                                             "NATURAL_NUMBER", 
                                                             "COMMA", "ARROW", 
                                                             "COLON", "DOT", 
                                                             "SEMI", "LPAREN", 
                                                             "RPAREN", "WS" ];
	public static readonly modeNames: string[] = [ "DEFAULT_MODE", ];

	public static readonly ruleNames: string[] = [
		"T__0", "T__1", "T__2", "T__3", "LAMBDA", "ID", "GREEK_TYPE", "NATURAL_NUMBER", 
		"COMMA", "ARROW", "COLON", "DOT", "SEMI", "LPAREN", "RPAREN", "WS",
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

	public static readonly _serializedATN: number[] = [4,0,16,81,6,-1,2,0,7,
	0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,
	9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,1,0,1,0,1,
	1,1,1,1,2,1,2,1,3,1,3,1,4,1,4,1,5,1,5,5,5,46,8,5,10,5,12,5,49,9,5,1,6,1,
	6,1,7,1,7,5,7,55,8,7,10,7,12,7,58,9,7,1,8,1,8,1,9,1,9,1,9,1,10,1,10,1,11,
	1,11,1,12,1,12,1,13,1,13,1,14,1,14,1,15,4,15,76,8,15,11,15,12,15,77,1,15,
	1,15,0,0,16,1,1,3,2,5,3,7,4,9,5,11,6,13,7,15,8,17,9,19,10,21,11,23,12,25,
	13,27,14,29,15,31,16,1,0,7,2,0,92,92,955,955,3,0,65,90,95,95,97,122,4,0,
	48,57,65,90,95,95,97,122,1,0,945,969,1,0,49,57,1,0,48,57,3,0,9,10,13,13,
	32,32,83,0,1,1,0,0,0,0,3,1,0,0,0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,
	11,1,0,0,0,0,13,1,0,0,0,0,15,1,0,0,0,0,17,1,0,0,0,0,19,1,0,0,0,0,21,1,0,
	0,0,0,23,1,0,0,0,0,25,1,0,0,0,0,27,1,0,0,0,0,29,1,0,0,0,0,31,1,0,0,0,1,
	33,1,0,0,0,3,35,1,0,0,0,5,37,1,0,0,0,7,39,1,0,0,0,9,41,1,0,0,0,11,43,1,
	0,0,0,13,50,1,0,0,0,15,52,1,0,0,0,17,59,1,0,0,0,19,61,1,0,0,0,21,64,1,0,
	0,0,23,66,1,0,0,0,25,68,1,0,0,0,27,70,1,0,0,0,29,72,1,0,0,0,31,75,1,0,0,
	0,33,34,5,61,0,0,34,2,1,0,0,0,35,36,5,60,0,0,36,4,1,0,0,0,37,38,5,62,0,
	0,38,6,1,0,0,0,39,40,5,42,0,0,40,8,1,0,0,0,41,42,7,0,0,0,42,10,1,0,0,0,
	43,47,7,1,0,0,44,46,7,2,0,0,45,44,1,0,0,0,46,49,1,0,0,0,47,45,1,0,0,0,47,
	48,1,0,0,0,48,12,1,0,0,0,49,47,1,0,0,0,50,51,7,3,0,0,51,14,1,0,0,0,52,56,
	7,4,0,0,53,55,7,5,0,0,54,53,1,0,0,0,55,58,1,0,0,0,56,54,1,0,0,0,56,57,1,
	0,0,0,57,16,1,0,0,0,58,56,1,0,0,0,59,60,5,44,0,0,60,18,1,0,0,0,61,62,5,
	45,0,0,62,63,5,62,0,0,63,20,1,0,0,0,64,65,5,58,0,0,65,22,1,0,0,0,66,67,
	5,46,0,0,67,24,1,0,0,0,68,69,5,59,0,0,69,26,1,0,0,0,70,71,5,40,0,0,71,28,
	1,0,0,0,72,73,5,41,0,0,73,30,1,0,0,0,74,76,7,6,0,0,75,74,1,0,0,0,76,77,
	1,0,0,0,77,75,1,0,0,0,77,78,1,0,0,0,78,79,1,0,0,0,79,80,6,15,0,0,80,32,
	1,0,0,0,4,0,47,56,77,1,6,0,0];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!LambdaCalcLexer.__ATN) {
			LambdaCalcLexer.__ATN = new ATNDeserializer().deserialize(LambdaCalcLexer._serializedATN);
		}

		return LambdaCalcLexer.__ATN;
	}


	static DecisionsToDFA = LambdaCalcLexer._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );
}