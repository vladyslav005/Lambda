import React, {useContext, useState} from "react";
import {EditorContext} from "../../lambda-input/context/EditorContext";

import {MapInteractionCSS} from 'react-map-interaction';
import "./ProofTree.css"
import {ProofTreeComponentUsingCss} from "./prooftreeusingcss/ProofTreeUsingCss";
import {MdFullscreen, MdFullscreenExit} from "react-icons/md";
import {IconButton} from "../../../common/components/button/IconButton";
import {ExportButton} from "./exportbutton/ExportButton";
import {Checkbox} from "react-aria-components";


export default function TreeFlat() {

  const editorContext = useContext(EditorContext);
  const [fullScreen, setFullScreen] = useState(false);

  const [showAliases, setShowAliases] = useState(false)

  const handleFullScreenClick = () => {
    setFullScreen(!fullScreen);
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
                    {editorContext.tree &&
                        <ProofTreeComponentUsingCss showAliases={showAliases} node={editorContext.tree}/>}
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
                        useAliases={showAliases}
                    />
                }

                {editorContext.aliasesPresent && <Checkbox
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '1rem',
                      zIndex: 9999,
                    }}
                    defaultSelected={showAliases}
                    onChange={(isChecked) => setShowAliases(isChecked)}
                >
                  <div className="checkbox">
                    <svg viewBox="0 0 18 18" aria-hidden="true">
                      <polyline points="1 9 7 14 15 4"/>
                    </svg>
                  </div>
                  Show aliases
                </Checkbox>}

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




