import React, {useContext, useState} from "react";
import {EditorContext} from "../../lambda-input/context/EditorContext";

import {MapInteractionCSS} from 'react-map-interaction';
import "./ProofTree.css"
import {ProofTreeComponentUsingCss} from "./prooftreeusingcss/ProofTreeUsingCss";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import {Button} from "react-aria-components";

export enum TreeView {
  INTERACTIVE = 0,
  LATEX = 1
}

export default function TreeFlat() {

  const editorContext = useContext(EditorContext);
  const [fullScreen, setFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    setFullScreen(!fullScreen);
    console.log("fullScreen", fullScreen);
  }


  return (
      <div
          className={`${fullScreen ? 'tree-flat-container-full-screen' : 'tree-flat-container'} ui-block `}
      >

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

        <Button style={{
          position: "absolute",
          zIndex: 9999,
          bottom: '1rem',
          right: '1rem',

        }} onPress={handleFullScreenClick}>
          {fullScreen && <MdFullscreenExit size={48}/>}
          {!fullScreen && <MdFullscreen size={48}/>}
        </Button>

      </div>
  );
}




