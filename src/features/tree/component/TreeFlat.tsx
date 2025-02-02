import React, {useContext, useState} from "react";
import {EditorContext} from "../../lambda-input/context/EditorContext";

import {MapInteractionCSS} from 'react-map-interaction';
import "./ProofTree.css"
import {ProofTreeComponentUsingCss} from "./prooftreeusingcss/ProofTreeUsingCss";
import {MdFullscreen, MdFullscreenExit} from "react-icons/md";
import {IconButton} from "../../../common/components/button/IconButton";
import {ExportButton} from "./exportbutton/ExportButton";

export enum TreeView {
  INTERACTIVE = 0,
  LATEX = 1
}

export default function TreeFlat() {

  const editorContext = useContext(EditorContext);
  const [fullScreen, setFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    setFullScreen(!fullScreen);
    // @ts-ignore

  }


  return (
      <div
          className={`${fullScreen ? 'tree-flat-container-full-screen' : 'tree-flat-container'} ui-block `}
      >
        <div className="tree-bx"
        >
          {editorContext.tree &&
              <>
                  <MapInteractionCSS>
                    {editorContext.tree && <ProofTreeComponentUsingCss node={editorContext.tree}/>}
                  </MapInteractionCSS>
                  <IconButton className={"tree-full-screen-btn"} style={{
                    position: fullScreen ? "fixed" : "absolute",
                    zIndex: 9999,
                    bottom: '1rem',
                    right: '1rem',

                  }} onClick={handleFullScreenClick}>
                    {fullScreen && <MdFullscreenExit size={48}/>}
                    {!fullScreen && <MdFullscreen size={48}/>}
                  </IconButton>

                {!fullScreen &&
                    <ExportButton
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '1rem',
                          zIndex: 9999,
                        }}
                    />
                }

              </>
          }


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




