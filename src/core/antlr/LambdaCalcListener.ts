// Generated from ./src/core/antlr/LambdaCalc.g4 by ANTLR 4.13.2

import {ParseTreeListener} from "antlr4";


import { ExprContext } from "./LambdaCalcParser.js";
import { GlobalVariableDeclarationContext } from "./LambdaCalcParser.js";
import { GlobalFunctionDeclarationContext } from "./LambdaCalcParser.js";
import { LambdaAbstractionContext } from "./LambdaCalcParser.js";
import { VariableContext } from "./LambdaCalcParser.js";
import { RecordProjectionContext } from "./LambdaCalcParser.js";
import { TupleProjectionContext } from "./LambdaCalcParser.js";
import { RecordContext } from "./LambdaCalcParser.js";
import { ApplicationContext } from "./LambdaCalcParser.js";
import { TupleContext } from "./LambdaCalcParser.js";
import { ParenthesesContext } from "./LambdaCalcParser.js";
import { GreekTypeContext } from "./LambdaCalcParser.js";
import { RecordTypeContext } from "./LambdaCalcParser.js";
import { FunctionTypeContext } from "./LambdaCalcParser.js";
import { TupleTypeContext } from "./LambdaCalcParser.js";
import { ParenTypeContext } from "./LambdaCalcParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `LambdaCalcParser`.
 */
export default class LambdaCalcListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the `Expr`
	 * labeled alternative in `LambdaCalcParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by the `Expr`
	 * labeled alternative in `LambdaCalcParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;
	/**
	 * Enter a parse tree produced by the `GlobalVariableDeclaration`
	 * labeled alternative in `LambdaCalcParser.globalDecl`.
	 * @param ctx the parse tree
	 */
	enterGlobalVariableDeclaration?: (ctx: GlobalVariableDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by the `GlobalVariableDeclaration`
	 * labeled alternative in `LambdaCalcParser.globalDecl`.
	 * @param ctx the parse tree
	 */
	exitGlobalVariableDeclaration?: (ctx: GlobalVariableDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by the `GlobalFunctionDeclaration`
	 * labeled alternative in `LambdaCalcParser.globalDecl`.
	 * @param ctx the parse tree
	 */
	enterGlobalFunctionDeclaration?: (ctx: GlobalFunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by the `GlobalFunctionDeclaration`
	 * labeled alternative in `LambdaCalcParser.globalDecl`.
	 * @param ctx the parse tree
	 */
	exitGlobalFunctionDeclaration?: (ctx: GlobalFunctionDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by the `LambdaAbstraction`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	enterLambdaAbstraction?: (ctx: LambdaAbstractionContext) => void;
	/**
	 * Exit a parse tree produced by the `LambdaAbstraction`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	exitLambdaAbstraction?: (ctx: LambdaAbstractionContext) => void;
	/**
	 * Enter a parse tree produced by the `Variable`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	enterVariable?: (ctx: VariableContext) => void;
	/**
	 * Exit a parse tree produced by the `Variable`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	exitVariable?: (ctx: VariableContext) => void;
	/**
	 * Enter a parse tree produced by the `RecordProjection`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	enterRecordProjection?: (ctx: RecordProjectionContext) => void;
	/**
	 * Exit a parse tree produced by the `RecordProjection`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	exitRecordProjection?: (ctx: RecordProjectionContext) => void;
	/**
	 * Enter a parse tree produced by the `TupleProjection`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	enterTupleProjection?: (ctx: TupleProjectionContext) => void;
	/**
	 * Exit a parse tree produced by the `TupleProjection`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	exitTupleProjection?: (ctx: TupleProjectionContext) => void;
	/**
	 * Enter a parse tree produced by the `Record`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	enterRecord?: (ctx: RecordContext) => void;
	/**
	 * Exit a parse tree produced by the `Record`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	exitRecord?: (ctx: RecordContext) => void;
	/**
	 * Enter a parse tree produced by the `Application`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	enterApplication?: (ctx: ApplicationContext) => void;
	/**
	 * Exit a parse tree produced by the `Application`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	exitApplication?: (ctx: ApplicationContext) => void;
	/**
	 * Enter a parse tree produced by the `Tuple`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	enterTuple?: (ctx: TupleContext) => void;
	/**
	 * Exit a parse tree produced by the `Tuple`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	exitTuple?: (ctx: TupleContext) => void;
	/**
	 * Enter a parse tree produced by the `Parentheses`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	enterParentheses?: (ctx: ParenthesesContext) => void;
	/**
	 * Exit a parse tree produced by the `Parentheses`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 */
	exitParentheses?: (ctx: ParenthesesContext) => void;
	/**
	 * Enter a parse tree produced by the `GreekType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 */
	enterGreekType?: (ctx: GreekTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `GreekType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 */
	exitGreekType?: (ctx: GreekTypeContext) => void;
	/**
	 * Enter a parse tree produced by the `RecordType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 */
	enterRecordType?: (ctx: RecordTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `RecordType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 */
	exitRecordType?: (ctx: RecordTypeContext) => void;
	/**
	 * Enter a parse tree produced by the `FunctionType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 */
	enterFunctionType?: (ctx: FunctionTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `FunctionType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 */
	exitFunctionType?: (ctx: FunctionTypeContext) => void;
	/**
	 * Enter a parse tree produced by the `TupleType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 */
	enterTupleType?: (ctx: TupleTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `TupleType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 */
	exitTupleType?: (ctx: TupleTypeContext) => void;
	/**
	 * Enter a parse tree produced by the `ParenType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 */
	enterParenType?: (ctx: ParenTypeContext) => void;
	/**
	 * Exit a parse tree produced by the `ParenType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 */
	exitParenType?: (ctx: ParenTypeContext) => void;
}

