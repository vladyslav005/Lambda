import React, {useContext} from "react";
import {EditorContext} from "../../lambdainput/context/EditorContext";
import {ProofTreeUsingMathJax} from "./ProofTreeUsingMathJax";

import {MapInteractionCSS} from 'react-map-interaction';


export function TreeFlat() {

  const editorContext = useContext(EditorContext);

  return (
      <div
          className="tree-flat-container ui-block bg-white"
          style={{
            flexGrow: 1,
            overflow: 'hidden',
            position: 'relative',
          }}
      >
        <div
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
            }}
        >
          <MapInteractionCSS>

            {editorContext.tree && <ProofTreeUsingMathJax proofTree={editorContext.tree}/>}

          </MapInteractionCSS>
        </div>
      </div>
  );
}
