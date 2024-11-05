import React, {useContext} from "react";
import {EditorContext} from "../../lambdainput/context/EditorContext";
import {ProofTreeUsingMathJax} from "./ProofTreeUsingMathJax";

import {MapInteractionCSS} from 'react-map-interaction';
import "./ProofTree.css"

export function TreeFlat() {

  const editorContext = useContext(EditorContext);

  return (
      <div
          className="tree-flat-container ui-block bg-white"
      >
        <div className="tree-component">
          <MapInteractionCSS>

            {editorContext.tree && <ProofTreeUsingMathJax proofTree={editorContext.tree}/>}

          </MapInteractionCSS>
        </div>
      </div>
  );
}
