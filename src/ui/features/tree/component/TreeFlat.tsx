import {useZoomAndDragHook} from "../hook/ZoomAndDragHook";
import "./Tree.css"
import {ProofTree} from "./ProofTree";
import React, {useContext, useState} from "react";
import {EditorContext} from "../../lambdainput/context/EditorContext";




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
        handleMouseLeave
    } = useZoomAndDragHook();


    const editorContext = useContext(EditorContext);

    return (
        <div
            className="tree-flat-container ui-block justify-around ali"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
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
                    // transition: dragging ? 'none' : 'transform 0.1s linear',
                    transformOrigin: "0% 0%",
                    backgroundColor: 'white',
                    position: 'absolute',
                }}
            >
                {editorContext.tree  && <ProofTree root={editorContext.tree} />}
            </div>
        </div>
    );
}
