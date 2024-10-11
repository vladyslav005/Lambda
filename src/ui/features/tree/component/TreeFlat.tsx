import {useZoomAndDragHook} from "../hook/ZoomAndDragHook";
import {ProofNode, TreeGenerator} from "../../../../core/tree/TreeGenerator";
import {ProofTreeComponent} from "./ProofTreeComponent";
import "./Tree.css"
import {ProofTree} from "./ProofTree";
import LambdaCalcLexer from "../../../../core/antlr/LambdaCalcLexer";
import {CharStream, CommonTokenStream} from "antlr4";
import LambdaCalcParser from "../../../../core/antlr/LambdaCalcParser";
import TypeChecker from "../../../../core/typechecker/TypeChecker";
import React, {useState} from "react";




const input = `
x : α
y : α -> α
z : (α -> α) -> α
w : ((α -> α) -> α) -> α

M = λ f: α -> α . f : (α -> α) -> (α -> α)
N = λ x: α . x : α -> α
P = λ g: α -> α . (g x) : (α -> α) -> α
Q = λ h: α -> α . (h x) : (α -> α) -> α
R = λ k: (α -> α) -> α . k (λ p: α -> α . (p x)) : (α -> α) -> α
S = λ q: ((α -> α) -> α) -> α . (q R) : (((α -> α) -> α) -> α) -> α

(N (M N (P y))) 


    `;


const lexer = new LambdaCalcLexer(new CharStream(input));

const tokens = new CommonTokenStream(lexer);

const parser = new LambdaCalcParser(tokens);

const typeChecker = new TypeChecker()

const tree = parser.expression();


const typeCheck = typeChecker.visit(tree)



const globalContext = typeChecker.globalContext;

const treeGenerator = new TreeGenerator(globalContext);
treeGenerator.visit(tree)
const DEMO_TREE = treeGenerator.proofTree;

export function TreeFlat() {
    const {
        elementRef,
        scale,
        position,
        dragging,
        handleWheel,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
    } = useZoomAndDragHook();

    return (
        <div
            className="tree-flat-container ui-block justify-around ali"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{
                flexGrow: 4,
                overflow: 'hidden',
                position: 'relative',
                background: '#f0f0f0',
                cursor: dragging ? 'grabbing' : 'grab',
                flexWrap: 'nowrap',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <div
                id={"id"}
                ref={elementRef}
                className="tree-flat bg-white flex justify-around"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    // transition: dragging ? 'none' : 'transform 0.1s ease',
                    transformOrigin: "0% 0%",
                    backgroundColor: 'white',
                    position: 'absolute',
                }}
            >
                {DEMO_TREE !== undefined && <ProofTree root={DEMO_TREE} />}
            </div>
        </div>
    );
}
