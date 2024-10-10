import {useZoomAndDragHook} from "../../lambdainput/hook/ZoomAndDragHook";
import {ProofNode} from "../../../../core/tree/TreeGenerator";

const DEMO_TREE : ProofNode = {
    "type": "α",
    "conclusion": "(λy:α->α.(yx))M",
    "rule": "T-app",
    "premises": [
        {
            "type": "(α->α)->α",
            "conclusion": "λy:α->α.(yx)",
            "rule": "T-app",
            "premises": [
                {
                    "type": "α",
                    "conclusion": "yx",
                    "rule": "T-app",
                    "premises": [
                        {
                            "type": "α->α",
                            "conclusion": "y",
                            "rule": "T-var"
                        },
                        {
                            "type": "α",
                            "conclusion": "x",
                            "rule": "T-var"
                        }
                    ]
                }
            ]
        },
        {
            "type": "α->α",
            "conclusion": "M",
            "rule": "T-var"
        }
    ]
}




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
                className="tree-flat bg-white"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: `50% 50%`,
                    transition: dragging ? 'none' : 'transform 0.1s ease',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                }}
            >


            </div>
        </div>
    );
}
