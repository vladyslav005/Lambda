import {useZoomAndDragHook} from "../hook/ZoomAndDragHook";
import React, {useContext} from "react";
import {EditorContext} from "../../lambdainput/context/EditorContext";
import {ProofTreeUsingMathJax} from "./ProofTreeUsingMathJax";
import {ProofNode} from "../../../../core/tree/TreeGenerator";
// import {ProofTreeComponentUsingCss} from "./ProofTreeComponentUsingCss";


const input = `
x : α
y : α -> α
z : (α -> α) -> α
w : ((α -> α) -> α) -> α

M = λ f: α -> α . f : (α -> α) -> (α -> α)
N = λ x: α . x : α -> α
P = λ g: α -> α . (g x) : (α -> α) -> α
Q = λ h: α -> α . (h x) : (α -> α) -> α

(N (M N (P y))) 
    `;

const DEMO_TREE: ProofNode = {
  "type": "γ",
  "conclusion": "\\Gamma \\vdash fgh : γ",
  "rule": "(T-app)",
  "root": true,
  "premises": [{
    "type": "α->γ",
    "conclusion": "\\Gamma \\vdash fg : α->γ",
    "rule": "(T-app)",
    "root": false,
    "premises": [{
      "type": "(α->β)->(α->γ)",
      "conclusion": "\\Gamma \\vdash f : (α->β)->(α->γ)",
      "rule": "(T-var)",
      "root": false,
      "premises": [{
        "type": "(α->β)->(α->γ)",
        "conclusion": "f : (α->β)->(α->γ) \\in \\Gamma",
        "rule": "",
        "root": false
      }]
    }, {
      "type": "α->β",
      "conclusion": "\\Gamma \\vdash g : α->β",
      "rule": "(T-var)",
      "root": false,
      "premises": [{"type": "α->β", "conclusion": "g : α->β \\in \\Gamma", "rule": "", "root": false}]
    }]
  }, {
    "type": "α",
    "conclusion": "\\Gamma \\vdash h : α",
    "rule": "(T-var)",
    "root": false,
    "premises": [{"type": "α", "conclusion": "h : α \\in \\Gamma", "rule": "", "root": false}]
  }]
}


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
          className="tree-flat-container ui-block justify-around bg-white"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            flexGrow: 4,
            overflow: 'hidden',
            position: 'relative',
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
          {editorContext.tree && <ProofTreeUsingMathJax proofTree={editorContext.tree}/>}

          {/*{editorContext.tree  && <ProofTreeComponentUsingCss  node={editorContext.tree} />}*/}
        </div>
      </div>
  );
}
