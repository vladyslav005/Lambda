import {Context, ContextElement} from "../../../../core/context/Context";
import {EditorContext} from "../../../lambda-input/context/EditorContext";
import {useContext, useEffect, useState} from "react";
import {decodeAlias, encodeToAlias, preprocessString, preprocessTex} from "../../../../core/utils";
import {MathComponent} from "mathjax-react";

interface GammaItemProps {
  ctxElement: ContextElement
  showAliases: boolean;
}

export const GammaItem = ({ctxElement, showAliases}: GammaItemProps) => {
  const editorContext = useContext(EditorContext);

  const [ctxElStr, setCtxElStr] = useState('')

  const genCtxElStr = () =>  {
    return preprocessTex(preprocessString(`${ctxElement.name}: ${showAliases ? encodeToAlias(ctxElement.type ?? '', 
            editorContext.aliasCtx ?? new Context())
        : decodeAlias(ctxElement.type ?? '', editorContext.aliasCtx ?? new Context())}`))
  }

  useEffect(() => {
    setCtxElStr(genCtxElStr());
  }, [showAliases, ctxElement]);


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
    if (!ctxElement.declarationLocation) return

    const startLine = ctxElement.declarationLocation[0];
    const endLine = ctxElement.declarationLocation[1];
    const startColumn = ctxElement.declarationLocation[2];
    const endColumn = ctxElement.declarationLocation[3];

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

  const handleMouseLeave = () => {
    // Clear the decorations when the mouse leaves
    setDecorations(editorContext.editor.deltaDecorations(decorations, []));
    if (editorContext.editor.getModel())
      editorContext.editor.deltaDecorations(editorContext.editor.getModel().getAllDecorations()
        .filter((decorator: any) => decorator.options.className === "highlighted-code")
        .map((decorator: any) => decorator.id), [])
    setIsHovered(false)
  }

  return (
      <div className="ctx-el"
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
           onTouchStart={handleTouch}
           title={ctxElement.name + ': ' + decodeAlias(ctxElement.type, editorContext.aliasCtx ?? new Context())}
      >
        <MathComponent tex= {ctxElStr}/>
      </div>

  )
}