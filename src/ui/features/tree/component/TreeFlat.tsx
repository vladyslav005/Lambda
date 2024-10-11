import {useZoomAndDragHook} from "../hook/ZoomAndDragHook";
import {ProofNode, TreeGenerator} from "../../../../core/tree/TreeGenerator";
import {ProofTreeComponent} from "./ProofTreeComponent";
import "./Tree.css"
import {ProofTree} from "./ProofTree";
import LambdaCalcLexer from "../../../../core/antlr/LambdaCalcLexer";
import {CharStream, CommonTokenStream} from "antlr4";
import LambdaCalcParser from "../../../../core/antlr/LambdaCalcParser";
import TypeChecker from "../../../../core/typechecker/TypeChecker";




const input = `
    x : α
    z : β
    M = λ y:α->α.y : (α->α)->(α->α)
    N = λ x:α.x : α->α
    M N x
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
console.log(DEMO_TREE)






export function TreeFlat() {
    const {
        scale, position, dragging, handleWheel,
        handleMouseDown, handleMouseUp, handleMouseMove
    } = useZoomAndDragHook();


    return (
        <div
            className="tree-flat-container ui-block"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{
                flexGrow : 3,
                overflow: 'hidden',
                position: 'relative',
                background: '#f0f0f0',
                cursor: dragging ? 'grabbing' : 'grab'
            }}
        >
            <div
                className="tree-flat bg-white flex justify-around al"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: `50% 50%`,
                    transition: dragging ? 'none' : 'transform 0.1s ease',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                }}
            >
                { DEMO_TREE !== undefined && (<ProofTree root={DEMO_TREE}></ProofTree>)}

            </div>
        </div>
    );
}
