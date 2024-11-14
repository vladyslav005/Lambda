import {MathComponent} from "mathjax-react";
import {ProofNode} from "../../../../../core/tree/TreeGenerator";
import {useContext, useState} from "react";
import {EditorContext} from "../../../lambdainput/context/EditorContext";

interface ConclusionCenterProps {
  isItLeaf: string;
  isItRoot: string;
  node: ProofNode;
}


//TODO : support for mobile
export function ConclusionCenter(props: ConclusionCenterProps): JSX.Element {

  const editorContext = useContext(EditorContext);
  const [isHovered, setIsHovered] = useState(false)
  const [decorations, setDecorations] = useState([])

  function handleMouseEnter() {
    const ctx = props.node.context;

    const startLine = ctx.start.line;
    const endLine = (ctx.stop ? ctx.stop.line : ctx.start.line);
    const startColumn = ctx.start.column;
    const endColumn = (ctx.stop ? ctx.stop.column + ctx.stop.text.length : ctx.start.column + ctx.start.text.length);

    // Create the new decoration for highlighting
    const newDecorations = [{
      range: new editorContext.monaco.Range(startLine, startColumn + 1, endLine, endColumn + 1),
      options: {
        isWholeLine: false,
        className: 'highlighted-code',
        zIndex: 1,
      }
    }];

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