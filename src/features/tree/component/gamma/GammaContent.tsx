import './GammaContent.css'
import React, {useContext} from "react";
import {EditorContext} from "../../../lambda-input/context/EditorContext";
import {GammaItem} from "./GammaItem";
import translations from "../../../configurations/data/translations";

interface GammaContentProps {
  showAliases: boolean;
}

export const GammaContent = (props: GammaContentProps) => {
  const editorContext = useContext(EditorContext);

  return (
      <div className="gamma-content ui-block flex flex-col items-center gap-4 relative">
        <div></div>
        {editorContext.globalCtx && editorContext.globalCtx.getAllElements().map((el, i) => (
            <GammaItem key={i} ctxElement={el} showAliases={props.showAliases} />
        ))

        }
        {!editorContext.globalCtx &&
            <div className="tree-info-bx">
                <h1 className="text-center text-wrap">
                  Gamma content will be displayed here
                </h1>
            </div>
        }
        <div></div>

      </div>
  )
}