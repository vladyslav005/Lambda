import React, {lazy, Suspense, useContext, useEffect, useRef, useState} from "react";
import {EditorContext} from "../../lambda-input/context/EditorContext";
import {AiOutlineAim} from "react-icons/ai";
import {MapInteractionCSS} from 'react-map-interaction';
import "./ProofTree.css"
import {ProofTreeComponentUsingCss} from "./prooftreeusingcss/ProofTreeUsingCss";
import {MdFullscreen, MdFullscreenExit} from "react-icons/md";
import {IconButton} from "../../../common/components/button/IconButton";
import {Switch} from "react-aria-components";

const ExportButton = lazy(() => import('./exportbutton/ExportButton'))


export default function TreeFlat() {
  const editorContext = useContext(EditorContext);
  const [fullScreen, setFullScreen] = useState(false);

  const [showAliases, setShowAliases] = useState(false)

  const treeContainerRef = useRef<HTMLDivElement | null>(null);
  const treeRef = useRef<HTMLDivElement | null>(null);

  const [treeContainerWidth, setTreeContainerWidth] = useState(0);
  const [treeWidth, setTreeWidth] = useState(0);
  const [treeContainerHeight, setTreeContainerHeight] = useState(0);
  const [treeHeight, setTreeHeight] = useState(0);

  const [treeHasChanged, setTreeHasChanged] = useState(false)

  const [map, setMap] = useState({
    value: {
      scale: 1,
      translation: {x: 0, y: 0}
    }
  });

  const centerTree = () => {
    if (treeContainerRef.current && treeRef.current) {
      let scale = map.value.scale;

      if (Math.abs(treeWidth - treeContainerWidth) > 0 || Math.abs(treeHeight - treeContainerHeight) > 0)
        scale = Math.min(treeContainerWidth / (treeWidth + 200), treeContainerHeight / (treeHeight + 200));

      const centeredX = (treeContainerWidth - (treeWidth + 75) * scale) / 2;
      const centeredY = (treeContainerHeight - (treeHeight) * scale) / 2;

      setMap({
        value: {
          scale: scale,
          translation: {x: centeredX, y: centeredY},
        }
      });
    }
  }

  useEffect(() => {
    if (treeContainerRef.current && treeRef.current) {
      const observer = new ResizeObserver(() => {
        if (treeContainerRef.current) {
          setTreeContainerWidth(treeContainerRef.current.getBoundingClientRect().width);
          setTreeContainerHeight(treeContainerRef.current.getBoundingClientRect().height);
        }
        if (treeRef.current) {
          setTreeWidth(treeRef.current.getBoundingClientRect().width / map.value.scale);
          setTreeHeight(treeRef.current.getBoundingClientRect().height / map.value.scale);
        }
      });

      observer.observe(treeContainerRef.current);
      observer.observe(treeRef.current);
      return () => observer.disconnect();
    }
  }, [editorContext.tree, showAliases, fullScreen, treeHasChanged]);

  const handleFullScreenClick = () => {
    setFullScreen(!fullScreen);
  }

  return (
      <div ref={treeContainerRef}
           className={`${fullScreen ? 'tree-flat-container-full-screen' : 'tree-flat-container'} ui-block `}
      >
        <div className="tree-bx"
        >
          <MapInteractionCSS
              value={map.value}
              onChange={(value) => setMap({value})}
          >
            {editorContext.tree && <ProofTreeComponentUsingCss canMutateTree={true}
                treeHasChanged={treeHasChanged} setTreeHasChanged={setTreeHasChanged}
                treeRef={treeRef} showAliases={showAliases} node={editorContext.tree}/>}
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

          <Suspense fallback={<div></div>}>
            <ExportButton
                treeWidth={treeWidth}
                treeHeight={treeHeight}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '1rem',
                  zIndex: 9999,
                }}
                useAliases={showAliases}
            />
          </Suspense>

          <IconButton onClick={centerTree} style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
          }}>
            <AiOutlineAim size={26}></AiOutlineAim>
          </IconButton>
          {editorContext.aliasesPresent && <Switch
              style={{
                position: 'absolute',
                left: '1rem',
                top: '1rem',
                zIndex: 9999,
              }}
              defaultSelected={showAliases}
              onChange={(isChecked) => setShowAliases(isChecked)}
          >
              <div className="indicator" />

              Type aliases
          </Switch>}

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




