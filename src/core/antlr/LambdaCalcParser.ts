// Generated from ./src/core/antlr/LambdaCalc.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import LambdaCalcListener from "./LambdaCalcListener.js";
import LambdaCalcVisitor from "./LambdaCalcVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class LambdaCalcParser extends Parser {
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
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_expression = 0;
	public static readonly RULE_globalDecl = 1;
	public static readonly RULE_term = 2;
	public static readonly RULE_type = 3;
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
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"expression", "globalDecl", "term", "type",
	];
	public get grammarFileName(): string { return "LambdaCalc.g4"; }
	public get literalNames(): (string | null)[] { return LambdaCalcParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return LambdaCalcParser.symbolicNames; }
	public get ruleNames(): string[] { return LambdaCalcParser.ruleNames; }
	public get serializedATN(): number[] { return LambdaCalcParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, LambdaCalcParser._ATN, LambdaCalcParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public expression(): ExpressionContext {
		let localctx: ExpressionContext = new ExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, LambdaCalcParser.RULE_expression);
		try {
			let _alt: number;
			localctx = new ExprContext(this, localctx);
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 11;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 0, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 8;
					this.globalDecl();
					}
					}
				}
				this.state = 13;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 0, this._ctx);
			}
			this.state = 14;
			this.term(0);
			this.state = 15;
			this.match(LambdaCalcParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public globalDecl(): GlobalDeclContext {
		let localctx: GlobalDeclContext = new GlobalDeclContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, LambdaCalcParser.RULE_globalDecl);
		let _la: number;
		try {
			this.state = 31;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				localctx = new GlobalVariableDeclarationContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 17;
				this.match(LambdaCalcParser.ID);
				this.state = 18;
				this.match(LambdaCalcParser.COLON);
				this.state = 19;
				this.type_(0);
				this.state = 20;
				this.match(LambdaCalcParser.SEMI);
				}
				break;
			case 2:
				localctx = new GlobalFunctionDeclarationContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 22;
				this.match(LambdaCalcParser.ID);
				this.state = 23;
				this.match(LambdaCalcParser.T__0);
				this.state = 24;
				this.term(0);
				this.state = 27;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===11) {
					{
					this.state = 25;
					this.match(LambdaCalcParser.COLON);
					this.state = 26;
					this.type_(0);
					}
				}

				this.state = 29;
				this.match(LambdaCalcParser.SEMI);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public term(): TermContext;
	public term(_p: number): TermContext;
	// @RuleVersion(0)
	public term(_p?: number): TermContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: TermContext = new TermContext(this, this._ctx, _parentState);
		let _prevctx: TermContext = localctx;
		let _startState: number = 4;
		this.enterRecursionRule(localctx, 4, LambdaCalcParser.RULE_term, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 75;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 6, this._ctx) ) {
			case 1:
				{
				localctx = new LambdaAbstractionContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;

				this.state = 34;
				this.match(LambdaCalcParser.LAMBDA);
				this.state = 35;
				this.match(LambdaCalcParser.ID);
				this.state = 36;
				this.match(LambdaCalcParser.COLON);
				this.state = 37;
				this.type_(0);
				this.state = 38;
				this.match(LambdaCalcParser.DOT);
				this.state = 39;
				this.term(0);
				this.state = 42;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 3, this._ctx) ) {
				case 1:
					{
					this.state = 40;
					this.match(LambdaCalcParser.COLON);
					this.state = 41;
					this.type_(0);
					}
					break;
				}
				}
				break;
			case 2:
				{
				localctx = new VariableContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 44;
				this.match(LambdaCalcParser.ID);
				}
				break;
			case 3:
				{
				localctx = new RecordContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 45;
				this.match(LambdaCalcParser.T__1);
				this.state = 46;
				this.match(LambdaCalcParser.ID);
				this.state = 47;
				this.match(LambdaCalcParser.T__0);
				this.state = 48;
				this.term(0);
				this.state = 55;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===9) {
					{
					{
					this.state = 49;
					this.match(LambdaCalcParser.COMMA);
					this.state = 50;
					this.match(LambdaCalcParser.ID);
					this.state = 51;
					this.match(LambdaCalcParser.T__0);
					this.state = 52;
					this.term(0);
					}
					}
					this.state = 57;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 58;
				this.match(LambdaCalcParser.T__2);
				}
				break;
			case 4:
				{
				localctx = new TupleContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 60;
				this.match(LambdaCalcParser.T__1);
				this.state = 61;
				this.term(0);
				this.state = 66;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===9) {
					{
					{
					this.state = 62;
					this.match(LambdaCalcParser.COMMA);
					this.state = 63;
					this.term(0);
					}
					}
					this.state = 68;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 69;
				this.match(LambdaCalcParser.T__2);
				}
				break;
			case 5:
				{
				localctx = new ParenthesesContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 71;
				this.match(LambdaCalcParser.LPAREN);
				this.state = 72;
				this.term(0);
				this.state = 73;
				this.match(LambdaCalcParser.RPAREN);
				}
				break;
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 87;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 8, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 85;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 7, this._ctx) ) {
					case 1:
						{
						localctx = new ApplicationContext(this, new TermContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, LambdaCalcParser.RULE_term);
						this.state = 77;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 78;
						this.term(8);
						}
						break;
					case 2:
						{
						localctx = new RecordProjectionContext(this, new TermContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, LambdaCalcParser.RULE_term);
						this.state = 79;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 80;
						this.match(LambdaCalcParser.DOT);
						this.state = 81;
						this.match(LambdaCalcParser.ID);
						}
						break;
					case 3:
						{
						localctx = new TupleProjectionContext(this, new TermContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, LambdaCalcParser.RULE_term);
						this.state = 82;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 83;
						this.match(LambdaCalcParser.DOT);
						this.state = 84;
						this.match(LambdaCalcParser.NATURAL_NUMBER);
						}
						break;
					}
					}
				}
				this.state = 89;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 8, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}

	public type_(): TypeContext;
	public type_(_p: number): TypeContext;
	// @RuleVersion(0)
	public type_(_p?: number): TypeContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: TypeContext = new TypeContext(this, this._ctx, _parentState);
		let _prevctx: TypeContext = localctx;
		let _startState: number = 6;
		this.enterRecursionRule(localctx, 6, LambdaCalcParser.RULE_type, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 111;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 6:
			case 7:
				{
				localctx = new GreekTypeContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;

				this.state = 91;
				_la = this._input.LA(1);
				if(!(_la===6 || _la===7)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			case 2:
				{
				localctx = new RecordTypeContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 92;
				this.match(LambdaCalcParser.T__1);
				this.state = 93;
				this.match(LambdaCalcParser.ID);
				this.state = 94;
				this.match(LambdaCalcParser.COLON);
				this.state = 95;
				this.type_(0);
				this.state = 102;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===9) {
					{
					{
					this.state = 96;
					this.match(LambdaCalcParser.COMMA);
					this.state = 97;
					this.match(LambdaCalcParser.ID);
					this.state = 98;
					this.match(LambdaCalcParser.COLON);
					this.state = 99;
					this.type_(0);
					}
					}
					this.state = 104;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 105;
				this.match(LambdaCalcParser.T__2);
				}
				break;
			case 14:
				{
				localctx = new ParenTypeContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 107;
				this.match(LambdaCalcParser.LPAREN);
				this.state = 108;
				this.type_(0);
				this.state = 109;
				this.match(LambdaCalcParser.RPAREN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 121;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 12, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 119;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 11, this._ctx) ) {
					case 1:
						{
						localctx = new FunctionTypeContext(this, new TypeContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, LambdaCalcParser.RULE_type);
						this.state = 113;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 114;
						this.match(LambdaCalcParser.ARROW);
						this.state = 115;
						this.type_(4);
						}
						break;
					case 2:
						{
						localctx = new TupleTypeContext(this, new TypeContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, LambdaCalcParser.RULE_type);
						this.state = 116;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 117;
						this.match(LambdaCalcParser.T__3);
						this.state = 118;
						this.type_(2);
						}
						break;
					}
					}
				}
				this.state = 123;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 12, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}

	public sempred(localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 2:
			return this.term_sempred(localctx as TermContext, predIndex);
		case 3:
			return this.type_sempred(localctx as TypeContext, predIndex);
		}
		return true;
	}
	private term_sempred(localctx: TermContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 7);
		case 1:
			return this.precpred(this._ctx, 4);
		case 2:
			return this.precpred(this._ctx, 2);
		}
		return true;
	}
	private type_sempred(localctx: TypeContext, predIndex: number): boolean {
		switch (predIndex) {
		case 3:
			return this.precpred(this._ctx, 4);
		case 4:
			return this.precpred(this._ctx, 2);
		}
		return true;
	}

	public static readonly _serializedATN: number[] = [4,1,16,125,2,0,7,0,2,
	1,7,1,2,2,7,2,2,3,7,3,1,0,5,0,10,8,0,10,0,12,0,13,9,0,1,0,1,0,1,0,1,1,1,
	1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,28,8,1,1,1,1,1,3,1,32,8,1,1,2,1,2,
	1,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,43,8,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
	1,2,5,2,54,8,2,10,2,12,2,57,9,2,1,2,1,2,1,2,1,2,1,2,1,2,5,2,65,8,2,10,2,
	12,2,68,9,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,76,8,2,1,2,1,2,1,2,1,2,1,2,1,2,
	1,2,1,2,5,2,86,8,2,10,2,12,2,89,9,2,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,
	1,3,5,3,101,8,3,10,3,12,3,104,9,3,1,3,1,3,1,3,1,3,1,3,1,3,3,3,112,8,3,1,
	3,1,3,1,3,1,3,1,3,1,3,5,3,120,8,3,10,3,12,3,123,9,3,1,3,0,2,4,6,4,0,2,4,
	6,0,1,1,0,6,7,138,0,11,1,0,0,0,2,31,1,0,0,0,4,75,1,0,0,0,6,111,1,0,0,0,
	8,10,3,2,1,0,9,8,1,0,0,0,10,13,1,0,0,0,11,9,1,0,0,0,11,12,1,0,0,0,12,14,
	1,0,0,0,13,11,1,0,0,0,14,15,3,4,2,0,15,16,5,0,0,1,16,1,1,0,0,0,17,18,5,
	6,0,0,18,19,5,11,0,0,19,20,3,6,3,0,20,21,5,13,0,0,21,32,1,0,0,0,22,23,5,
	6,0,0,23,24,5,1,0,0,24,27,3,4,2,0,25,26,5,11,0,0,26,28,3,6,3,0,27,25,1,
	0,0,0,27,28,1,0,0,0,28,29,1,0,0,0,29,30,5,13,0,0,30,32,1,0,0,0,31,17,1,
	0,0,0,31,22,1,0,0,0,32,3,1,0,0,0,33,34,6,2,-1,0,34,35,5,5,0,0,35,36,5,6,
	0,0,36,37,5,11,0,0,37,38,3,6,3,0,38,39,5,12,0,0,39,42,3,4,2,0,40,41,5,11,
	0,0,41,43,3,6,3,0,42,40,1,0,0,0,42,43,1,0,0,0,43,76,1,0,0,0,44,76,5,6,0,
	0,45,46,5,2,0,0,46,47,5,6,0,0,47,48,5,1,0,0,48,55,3,4,2,0,49,50,5,9,0,0,
	50,51,5,6,0,0,51,52,5,1,0,0,52,54,3,4,2,0,53,49,1,0,0,0,54,57,1,0,0,0,55,
	53,1,0,0,0,55,56,1,0,0,0,56,58,1,0,0,0,57,55,1,0,0,0,58,59,5,3,0,0,59,76,
	1,0,0,0,60,61,5,2,0,0,61,66,3,4,2,0,62,63,5,9,0,0,63,65,3,4,2,0,64,62,1,
	0,0,0,65,68,1,0,0,0,66,64,1,0,0,0,66,67,1,0,0,0,67,69,1,0,0,0,68,66,1,0,
	0,0,69,70,5,3,0,0,70,76,1,0,0,0,71,72,5,14,0,0,72,73,3,4,2,0,73,74,5,15,
	0,0,74,76,1,0,0,0,75,33,1,0,0,0,75,44,1,0,0,0,75,45,1,0,0,0,75,60,1,0,0,
	0,75,71,1,0,0,0,76,87,1,0,0,0,77,78,10,7,0,0,78,86,3,4,2,8,79,80,10,4,0,
	0,80,81,5,12,0,0,81,86,5,6,0,0,82,83,10,2,0,0,83,84,5,12,0,0,84,86,5,8,
	0,0,85,77,1,0,0,0,85,79,1,0,0,0,85,82,1,0,0,0,86,89,1,0,0,0,87,85,1,0,0,
	0,87,88,1,0,0,0,88,5,1,0,0,0,89,87,1,0,0,0,90,91,6,3,-1,0,91,112,7,0,0,
	0,92,93,5,2,0,0,93,94,5,6,0,0,94,95,5,11,0,0,95,102,3,6,3,0,96,97,5,9,0,
	0,97,98,5,6,0,0,98,99,5,11,0,0,99,101,3,6,3,0,100,96,1,0,0,0,101,104,1,
	0,0,0,102,100,1,0,0,0,102,103,1,0,0,0,103,105,1,0,0,0,104,102,1,0,0,0,105,
	106,5,3,0,0,106,112,1,0,0,0,107,108,5,14,0,0,108,109,3,6,3,0,109,110,5,
	15,0,0,110,112,1,0,0,0,111,90,1,0,0,0,111,92,1,0,0,0,111,107,1,0,0,0,112,
	121,1,0,0,0,113,114,10,4,0,0,114,115,5,10,0,0,115,120,3,6,3,4,116,117,10,
	2,0,0,117,118,5,4,0,0,118,120,3,6,3,2,119,113,1,0,0,0,119,116,1,0,0,0,120,
	123,1,0,0,0,121,119,1,0,0,0,121,122,1,0,0,0,122,7,1,0,0,0,123,121,1,0,0,
	0,13,11,27,31,42,55,66,75,85,87,102,111,119,121];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!LambdaCalcParser.__ATN) {
			LambdaCalcParser.__ATN = new ATNDeserializer().deserialize(LambdaCalcParser._serializedATN);
		}

		return LambdaCalcParser.__ATN;
	}


	static DecisionsToDFA = LambdaCalcParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class ExpressionContext extends ParserRuleContext {
	constructor(parser?: LambdaCalcParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return LambdaCalcParser.RULE_expression;
	}
	public override copyFrom(ctx: ExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class ExprContext extends ExpressionContext {
	constructor(parser: LambdaCalcParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public term(): TermContext {
		return this.getTypedRuleContext(TermContext, 0) as TermContext;
	}
	public EOF(): TerminalNode {
		return this.getToken(LambdaCalcParser.EOF, 0);
	}
	public globalDecl_list(): GlobalDeclContext[] {
		return this.getTypedRuleContexts(GlobalDeclContext) as GlobalDeclContext[];
	}
	public globalDecl(i: number): GlobalDeclContext {
		return this.getTypedRuleContext(GlobalDeclContext, i) as GlobalDeclContext;
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterExpr) {
	 		listener.enterExpr(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitExpr) {
	 		listener.exitExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitExpr) {
			return visitor.visitExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GlobalDeclContext extends ParserRuleContext {
	constructor(parser?: LambdaCalcParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return LambdaCalcParser.RULE_globalDecl;
	}
	public override copyFrom(ctx: GlobalDeclContext): void {
		super.copyFrom(ctx);
	}
}
export class GlobalFunctionDeclarationContext extends GlobalDeclContext {
	constructor(parser: LambdaCalcParser, ctx: GlobalDeclContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public ID(): TerminalNode {
		return this.getToken(LambdaCalcParser.ID, 0);
	}
	public term(): TermContext {
		return this.getTypedRuleContext(TermContext, 0) as TermContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(LambdaCalcParser.SEMI, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(LambdaCalcParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterGlobalFunctionDeclaration) {
	 		listener.enterGlobalFunctionDeclaration(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitGlobalFunctionDeclaration) {
	 		listener.exitGlobalFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitGlobalFunctionDeclaration) {
			return visitor.visitGlobalFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class GlobalVariableDeclarationContext extends GlobalDeclContext {
	constructor(parser: LambdaCalcParser, ctx: GlobalDeclContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public ID(): TerminalNode {
		return this.getToken(LambdaCalcParser.ID, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(LambdaCalcParser.COLON, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(LambdaCalcParser.SEMI, 0);
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterGlobalVariableDeclaration) {
	 		listener.enterGlobalVariableDeclaration(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitGlobalVariableDeclaration) {
	 		listener.exitGlobalVariableDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitGlobalVariableDeclaration) {
			return visitor.visitGlobalVariableDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TermContext extends ParserRuleContext {
	constructor(parser?: LambdaCalcParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return LambdaCalcParser.RULE_term;
	}
	public override copyFrom(ctx: TermContext): void {
		super.copyFrom(ctx);
	}
}
export class LambdaAbstractionContext extends TermContext {
	constructor(parser: LambdaCalcParser, ctx: TermContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LAMBDA(): TerminalNode {
		return this.getToken(LambdaCalcParser.LAMBDA, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(LambdaCalcParser.ID, 0);
	}
	public COLON_list(): TerminalNode[] {
	    	return this.getTokens(LambdaCalcParser.COLON);
	}
	public COLON(i: number): TerminalNode {
		return this.getToken(LambdaCalcParser.COLON, i);
	}
	public type__list(): TypeContext[] {
		return this.getTypedRuleContexts(TypeContext) as TypeContext[];
	}
	public type_(i: number): TypeContext {
		return this.getTypedRuleContext(TypeContext, i) as TypeContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(LambdaCalcParser.DOT, 0);
	}
	public term(): TermContext {
		return this.getTypedRuleContext(TermContext, 0) as TermContext;
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterLambdaAbstraction) {
	 		listener.enterLambdaAbstraction(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitLambdaAbstraction) {
	 		listener.exitLambdaAbstraction(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitLambdaAbstraction) {
			return visitor.visitLambdaAbstraction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VariableContext extends TermContext {
	constructor(parser: LambdaCalcParser, ctx: TermContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public ID(): TerminalNode {
		return this.getToken(LambdaCalcParser.ID, 0);
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterVariable) {
	 		listener.enterVariable(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitVariable) {
	 		listener.exitVariable(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitVariable) {
			return visitor.visitVariable(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RecordProjectionContext extends TermContext {
	constructor(parser: LambdaCalcParser, ctx: TermContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public term(): TermContext {
		return this.getTypedRuleContext(TermContext, 0) as TermContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(LambdaCalcParser.DOT, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(LambdaCalcParser.ID, 0);
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterRecordProjection) {
	 		listener.enterRecordProjection(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitRecordProjection) {
	 		listener.exitRecordProjection(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitRecordProjection) {
			return visitor.visitRecordProjection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TupleProjectionContext extends TermContext {
	constructor(parser: LambdaCalcParser, ctx: TermContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public term(): TermContext {
		return this.getTypedRuleContext(TermContext, 0) as TermContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(LambdaCalcParser.DOT, 0);
	}
	public NATURAL_NUMBER(): TerminalNode {
		return this.getToken(LambdaCalcParser.NATURAL_NUMBER, 0);
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterTupleProjection) {
	 		listener.enterTupleProjection(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitTupleProjection) {
	 		listener.exitTupleProjection(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitTupleProjection) {
			return visitor.visitTupleProjection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RecordContext extends TermContext {
	constructor(parser: LambdaCalcParser, ctx: TermContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public ID_list(): TerminalNode[] {
	    	return this.getTokens(LambdaCalcParser.ID);
	}
	public ID(i: number): TerminalNode {
		return this.getToken(LambdaCalcParser.ID, i);
	}
	public term_list(): TermContext[] {
		return this.getTypedRuleContexts(TermContext) as TermContext[];
	}
	public term(i: number): TermContext {
		return this.getTypedRuleContext(TermContext, i) as TermContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(LambdaCalcParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(LambdaCalcParser.COMMA, i);
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterRecord) {
	 		listener.enterRecord(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitRecord) {
	 		listener.exitRecord(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitRecord) {
			return visitor.visitRecord(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ApplicationContext extends TermContext {
	constructor(parser: LambdaCalcParser, ctx: TermContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public term_list(): TermContext[] {
		return this.getTypedRuleContexts(TermContext) as TermContext[];
	}
	public term(i: number): TermContext {
		return this.getTypedRuleContext(TermContext, i) as TermContext;
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterApplication) {
	 		listener.enterApplication(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitApplication) {
	 		listener.exitApplication(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitApplication) {
			return visitor.visitApplication(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TupleContext extends TermContext {
	constructor(parser: LambdaCalcParser, ctx: TermContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public term_list(): TermContext[] {
		return this.getTypedRuleContexts(TermContext) as TermContext[];
	}
	public term(i: number): TermContext {
		return this.getTypedRuleContext(TermContext, i) as TermContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(LambdaCalcParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(LambdaCalcParser.COMMA, i);
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterTuple) {
	 		listener.enterTuple(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitTuple) {
	 		listener.exitTuple(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitTuple) {
			return visitor.visitTuple(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ParenthesesContext extends TermContext {
	constructor(parser: LambdaCalcParser, ctx: TermContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(LambdaCalcParser.LPAREN, 0);
	}
	public term(): TermContext {
		return this.getTypedRuleContext(TermContext, 0) as TermContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(LambdaCalcParser.RPAREN, 0);
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterParentheses) {
	 		listener.enterParentheses(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitParentheses) {
	 		listener.exitParentheses(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitParentheses) {
			return visitor.visitParentheses(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeContext extends ParserRuleContext {
	constructor(parser?: LambdaCalcParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return LambdaCalcParser.RULE_type;
	}
	public override copyFrom(ctx: TypeContext): void {
		super.copyFrom(ctx);
	}
}
export class GreekTypeContext extends TypeContext {
	constructor(parser: LambdaCalcParser, ctx: TypeContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public GREEK_TYPE(): TerminalNode {
		return this.getToken(LambdaCalcParser.GREEK_TYPE, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(LambdaCalcParser.ID, 0);
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterGreekType) {
	 		listener.enterGreekType(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitGreekType) {
	 		listener.exitGreekType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitGreekType) {
			return visitor.visitGreekType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RecordTypeContext extends TypeContext {
	constructor(parser: LambdaCalcParser, ctx: TypeContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public ID_list(): TerminalNode[] {
	    	return this.getTokens(LambdaCalcParser.ID);
	}
	public ID(i: number): TerminalNode {
		return this.getToken(LambdaCalcParser.ID, i);
	}
	public COLON_list(): TerminalNode[] {
	    	return this.getTokens(LambdaCalcParser.COLON);
	}
	public COLON(i: number): TerminalNode {
		return this.getToken(LambdaCalcParser.COLON, i);
	}
	public type__list(): TypeContext[] {
		return this.getTypedRuleContexts(TypeContext) as TypeContext[];
	}
	public type_(i: number): TypeContext {
		return this.getTypedRuleContext(TypeContext, i) as TypeContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(LambdaCalcParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(LambdaCalcParser.COMMA, i);
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterRecordType) {
	 		listener.enterRecordType(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitRecordType) {
	 		listener.exitRecordType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitRecordType) {
			return visitor.visitRecordType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class FunctionTypeContext extends TypeContext {
	constructor(parser: LambdaCalcParser, ctx: TypeContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public type__list(): TypeContext[] {
		return this.getTypedRuleContexts(TypeContext) as TypeContext[];
	}
	public type_(i: number): TypeContext {
		return this.getTypedRuleContext(TypeContext, i) as TypeContext;
	}
	public ARROW(): TerminalNode {
		return this.getToken(LambdaCalcParser.ARROW, 0);
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterFunctionType) {
	 		listener.enterFunctionType(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitFunctionType) {
	 		listener.exitFunctionType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitFunctionType) {
			return visitor.visitFunctionType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TupleTypeContext extends TypeContext {
	constructor(parser: LambdaCalcParser, ctx: TypeContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public type__list(): TypeContext[] {
		return this.getTypedRuleContexts(TypeContext) as TypeContext[];
	}
	public type_(i: number): TypeContext {
		return this.getTypedRuleContext(TypeContext, i) as TypeContext;
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterTupleType) {
	 		listener.enterTupleType(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitTupleType) {
	 		listener.exitTupleType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitTupleType) {
			return visitor.visitTupleType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ParenTypeContext extends TypeContext {
	constructor(parser: LambdaCalcParser, ctx: TypeContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(LambdaCalcParser.LPAREN, 0);
	}
	public type_(): TypeContext {
		return this.getTypedRuleContext(TypeContext, 0) as TypeContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(LambdaCalcParser.RPAREN, 0);
	}
	public enterRule(listener: LambdaCalcListener): void {
	    if(listener.enterParenType) {
	 		listener.enterParenType(this);
		}
	}
	public exitRule(listener: LambdaCalcListener): void {
	    if(listener.exitParenType) {
	 		listener.exitParenType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: LambdaCalcVisitor<Result>): Result {
		if (visitor.visitParenType) {
			return visitor.visitParenType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
