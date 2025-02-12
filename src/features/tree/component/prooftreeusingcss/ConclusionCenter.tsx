import {MathComponent} from "mathjax-react";
import {ProofNode} from "../../../../core/tree/TreeGenerator";
import {useContext, useState} from "react";
import {EditorContext} from "../../../lambda-input/context/EditorContext";
import {preprocessString} from "../../../../core/utils";

interface ConclusionCenterProps {
  isItLeaf: string;
  isItRoot: string;
  node: ProofNode;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  showAliases: boolean;
}


export const ConclusionCenter = (props: ConclusionCenterProps) => {

  const editorContext = useContext(EditorContext);
  const [isHovered, setIsHovered] = useState(false)
  const [decorations, setDecorations] = useState([])

  const [isTouched, setIsTouched] = useState(false)

  function handleTouch() {
    if (isTouched) {
      setIsTouched(false)
      handleMouseLeave()
    } else {
      setIsTouched(true)
      handleMouseEnter()
    }
  }

  function handleMouseEnter() {
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

  const handleMouseLeave = () => {
    // Clear the decorations when the mouse leaves
    setDecorations(editorContext.editor.deltaDecorations(decorations, []));
    setIsHovered(false)
  }

  // Expand feature
  const handleClick = () => {
    if (props.node.isExpandable) {
      props.setIsExpanded(!props.isExpanded);

      editorContext.editor.deltaDecorations(editorContext.editor.getModel().getAllDecorations()
          .filter((decorator: any) => decorator.options.className === "highlighted-code")
          .map((decorator: any) => decorator.id), [])
    }
    console.log(editorContext.editor.getModel().getAllDecorations()
        .filter((decorator: any) => decorator.options.className === "highlighted-code"))
  }


  return (
      <div className={`conclusion-center ${props.isItLeaf} ${props.isItRoot}`}
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
           onClick={handleClick}
           onTouchStart={props.node.isExpandable ? handleClick : handleTouch}

           style={{
             backgroundColor: isHovered ? "rgba(255, 255, 0, 0.3)" : "", // Highlight the div when hovered
             borderRadius: '10px',
             cursor: props.node.isExpandable ? 'pointer' : 'default',
           }}
      >
        <MathComponent
            tex={preprocessString(props.showAliases ? props.node.conclusionWithAlias : props.node.conclusion)}/>
      </div>

  )
}