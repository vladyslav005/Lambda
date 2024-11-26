import React, {useContext, useState} from "react";
import {EditorContext} from "../../lambdainput/context/EditorContext";
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
        <SwitchTreeView setTreeView={setTreeView} treeView={treeView}/>

        <div className="tree-component"
          style={{
            backgroundColor: "#f3edf7"
          }}
        >
          <MapInteractionCSS>

            {treeView === TreeView.LATEX && editorContext.tree &&
                <ProofTreeUsingMathJax proofTree={editorContext.tree}/>}
            {treeView === TreeView.INTERACTIVE && editorContext.tree &&
                <ProofTreeComponentUsingCss node={editorContext.tree}/>}

          </MapInteractionCSS>
        </div>
      </div>
  );
}




