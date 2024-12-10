// Generated from ./src/core/antlr/LambdaCalc.g4 by ANTLR 4.13.2

import {ParseTreeVisitor} from 'antlr4';


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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `LambdaCalcParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export default class LambdaCalcVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by the `Expr`
	 * labeled alternative in `LambdaCalcParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr?: (ctx: ExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `GlobalVariableDeclaration`
	 * labeled alternative in `LambdaCalcParser.globalDecl`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGlobalVariableDeclaration?: (ctx: GlobalVariableDeclarationContext) => Result;
	/**
	 * Visit a parse tree produced by the `GlobalFunctionDeclaration`
	 * labeled alternative in `LambdaCalcParser.globalDecl`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGlobalFunctionDeclaration?: (ctx: GlobalFunctionDeclarationContext) => Result;
	/**
	 * Visit a parse tree produced by the `LambdaAbstraction`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLambdaAbstraction?: (ctx: LambdaAbstractionContext) => Result;
	/**
	 * Visit a parse tree produced by the `Variable`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariable?: (ctx: VariableContext) => Result;
	/**
	 * Visit a parse tree produced by the `RecordProjection`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordProjection?: (ctx: RecordProjectionContext) => Result;
	/**
	 * Visit a parse tree produced by the `TupleProjection`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTupleProjection?: (ctx: TupleProjectionContext) => Result;
	/**
	 * Visit a parse tree produced by the `Record`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecord?: (ctx: RecordContext) => Result;
	/**
	 * Visit a parse tree produced by the `Application`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitApplication?: (ctx: ApplicationContext) => Result;
	/**
	 * Visit a parse tree produced by the `Tuple`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTuple?: (ctx: TupleContext) => Result;
	/**
	 * Visit a parse tree produced by the `Parentheses`
	 * labeled alternative in `LambdaCalcParser.term`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParentheses?: (ctx: ParenthesesContext) => Result;
	/**
	 * Visit a parse tree produced by the `GreekType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGreekType?: (ctx: GreekTypeContext) => Result;
	/**
	 * Visit a parse tree produced by the `RecordType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordType?: (ctx: RecordTypeContext) => Result;
	/**
	 * Visit a parse tree produced by the `FunctionType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionType?: (ctx: FunctionTypeContext) => Result;
	/**
	 * Visit a parse tree produced by the `TupleType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTupleType?: (ctx: TupleTypeContext) => Result;
	/**
	 * Visit a parse tree produced by the `ParenType`
	 * labeled alternative in `LambdaCalcParser.type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParenType?: (ctx: ParenTypeContext) => Result;
}

