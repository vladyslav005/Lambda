import React, {useContext, useState} from "react";
import {EditorContext} from "../../lambda-input/context/EditorContext";
import {ProofTreeUsingMathJax} from "./ProofTreeUsingMathJax";

import {MapInteractionCSS} from 'react-map-interaction';
import "./ProofTree.css"
import {ProofTreeComponentUsingCss} from "./prooftreeusingcss/ProofTreeUsingCss";
import {SwitchTreeView} from "./SwitchTreeView";

export enum TreeView {
  INTERACTIVE = 0,
  LATEX = 1
}

export function TreeFlat() {

  const editorContext = useContext(EditorContext);
  const [treeView, setTreeView] = useState(TreeView.LATEX);

  return (
      <div
          className="tree-flat-container ui-block bg-white"
      >
        {/*<SwitchTreeView setTreeView={setTreeView} treeView={treeView}/>*/}

        <div className="tree-bx"
        >

            <MapInteractionCSS>
              {editorContext.tree && <ProofTreeComponentUsingCss node={editorContext.tree}/>}
            </MapInteractionCSS>

          {!editorContext.tree &&
             <div className="tree-info-bx">
                <h1>
                    Tree will be displayed here
                </h1>
             </div>
           }
        </div>
      </div>
  );
}




