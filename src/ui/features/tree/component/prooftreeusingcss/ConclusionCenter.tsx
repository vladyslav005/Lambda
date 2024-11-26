import {MathComponent} from "mathjax-react";
import {ProofNode} from "../../../../../core/tree/TreeGenerator";
import {useContext, useState} from "react";
import {EditorContext} from "../../../lambdainput/context/EditorContext";

interface ConclusionCenterProps {
  isItLeaf: string;
  isItRoot: string;
  node: ProofNode;
}


export function ConclusionCenter(props: ConclusionCenterProps): JSX.Element {

  const editorContext = useContext(EditorContext);
  const [isHovered, setIsHovered] = useState(false)
  const [decorations, setDecorations] = useState([])

  function handleMouseEnter() {
    const ctx = props.node.context;

    const startLine = props.node.tokenLocation[0];
    const endLine = props.node.tokenLocation[1];
    const startColumn = props.node.tokenLocation[2];
    const endColumn = props.node.tokenLocation[3];

    // Create the new decoration for highlighting
    const newDecorations = [{
      range: new editorContext.monaco.Range(startLine, startColumn + 1, endLine, endColumn + 1),
      options: {
        isWholeLine: false,
        className: 'highlighted-code',
        zIndex: 1,
      }
    }];

    if (props.node.declarationLocation) {
      newDecorations.push({
        range: new editorContext.monaco.Range(props.node.declarationLocation[0],
            props.node.declarationLocation[2] + 1,
            props.node.declarationLocation[1],
            props.node.declarationLocation[3] + 1),
        options: {
          isWholeLine: false,
          className: 'highlighted-code',
          zIndex: 1,
        }
      })
    }

    setIsHovered(true)
    setDecorations(editorContext.editor.deltaDecorations(decorations, newDecorations));
  }

  function handleMouseLeave() {
    // Clear the decorations when the mouse leaves
    setDecorations(editorContext.editor.deltaDecorations(decorations, []));
    setIsHovered(false)
  }

  return (
      <div className={`conclusion-center ${props.isItLeaf} ${props.isItRoot}`}
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
           style={{
             backgroundColor: isHovered ? "rgba(255, 255, 0, 0.3)" : "", // Highlight the div when hovered
             borderRadius: '10px'
           }}
      >
        <MathComponent tex={props.node.conclusion.replaceAll("->", " \\rightarrow ")}/>
      </div>

  )
}