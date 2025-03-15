import './GammaContent.css'
import React, {useContext} from "react";
import {EditorContext} from "../../../lambda-input/context/EditorContext";
import {GammaItem} from "./GammaItem";
import {decodeAlias} from "../../../../core/utils";
import {Context} from "../../../../core/context/Context";
import {MathComponent} from "mathjax-react";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";

interface GammaContentProps {
  showAliases: boolean;
}

export const GammaContent = (props: GammaContentProps) => {
  const editorContext = useContext(EditorContext);
  const confCtx = useContext(ConfigurationContext)
  return (
      <div className="gamma-content ui-block flex flex-col items-center gap-4 relative ">

        <div className="modal-title gamma-title w-full"
        >
          <h1>{translations[confCtx.language].tree.gammaTitle}</h1>
        </div>
        <div className="flex flex-col gap-2 gamma-el-bx">
          {editorContext.globalCtx && editorContext.globalCtx.getAllElements().map((el, i) => (
              <GammaItem key={i} ctxElement={el} showAliases={props.showAliases} />
          ))}
        </div>
        {editorContext.globalCtx && editorContext.globalCtx.isEmpty() &&
            <div className="flex flex-col gap-2 gamma-el-bx"
            >
                <p className="ctx-el">{translations[confCtx.language].tree.gammaEmpty}</p>
            </div>

        }

        {!editorContext.globalCtx &&
            <div className="tree-info-bx">
                <h1 className="text-center text-wrap">
                  {translations[confCtx.language].tree.gammaPlaceholder}
                </h1>
            </div>
        }
        <div></div>

      </div>
  )
}