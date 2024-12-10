import React, {useContext} from "react";
import {EditorContext} from "../../lambda-input/context/EditorContext";

import {MapInteractionCSS} from 'react-map-interaction';
import "./ProofTree.css"
import {ProofTreeComponentUsingCss} from "./prooftreeusingcss/ProofTreeUsingCss";

export enum TreeView {
  INTERACTIVE = 0,
  LATEX = 1
}

export default function TreeFlat() {

  const editorContext = useContext(EditorContext);

  return (
      <div
          className="tree-flat-container ui-block "
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




