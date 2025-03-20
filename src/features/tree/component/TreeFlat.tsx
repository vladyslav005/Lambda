import React, {lazy, Suspense, useContext, useEffect, useRef, useState} from "react";
import {EditorContext} from "../../lambda-input/context/EditorContext";
import {AiOutlineAim} from "react-icons/ai";
import {MapInteractionCSS} from 'react-map-interaction';
import "./ProofTree.css"
import {ProofTreeComponentUsingCss} from "./prooftreeusingcss/ProofTreeUsingCss";
import {MdFullscreen, MdFullscreenExit} from "react-icons/md";
import {IconButton} from "../../../common/components/button/IconButton";
import {Switch} from "react-aria-components";
import {ConfigurationContext} from "../../configurations/context/ConfigurationContext";
import translations from "../../configurations/data/translations";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";

const ExportButton = lazy(() => import('./exportbutton/ExportButton'))

export default function TreeFlat(
    {showAliases, setShowAliases, resized}: { showAliases: boolean, setShowAliases: (showAliases: boolean) => void, resized?: boolean}
) {
  const confContext = useContext(ConfigurationContext);

  const editorContext = useContext(EditorContext);
  const [fullScreen, setFullScreen] = useState(false);

  const [showGammaDefinition, setShowGammaDefinition] = useState(false)

  const treeContainerRef = useRef<HTMLDivElement | null>(null);
  const treeRef = useRef<HTMLDivElement | null>(null);

  const [treeContainerWidth, setTreeContainerWidth] = useState(0);
  const [treeWidth, setTreeWidth] = useState(0);
  const [treeContainerHeight, setTreeContainerHeight] = useState(0);
  const [treeHeight, setTreeHeight] = useState(0);

  const [isTreeCentered, setIsTreeCentered] = useState(true)

  const [treeHasChanged, setTreeHasChanged] = useState(false)

  const [step, setStep] = useState(1);

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

  const updateTree = () => {
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

    if (treeContainerRef.current)
      observer.observe(treeContainerRef.current);
    if (treeRef.current)
      observer.observe(treeRef.current);

    return () => observer.disconnect();
  }


  useEffect(() => {

    setIsTreeCentered(false)
    return updateTree();
  }, [editorContext.tree,
      showAliases, showGammaDefinition,
      fullScreen, treeHasChanged,
      step, confContext.stepByStepMode,
      treeContainerRef.current
  ]);

  useEffect(() => {

    return updateTree();
  }, [
    confContext.showGamma, resized,
  ]);

  useEffect(() => {
    centerTree();
    setIsTreeCentered(true);
  }, [isTreeCentered]);

  const handleFullScreenClick = () => {
    setFullScreen(!fullScreen);
  }

  useEffect(() => {
    setStep(1);
  }, [editorContext.tree]);

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
            {editorContext.tree && <ProofTreeComponentUsingCss
                stepByStepModeEnabled={confContext.stepByStepMode}
                stepNumber={step}
                showGammaDefinition={showGammaDefinition}
                color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"
                canMutateTree={true}
                treeHasChanged={treeHasChanged}
                setTreeHasChanged={setTreeHasChanged}
                treeRef={treeRef} showAliases={showAliases}
                node={editorContext.tree}/>}
          </MapInteractionCSS>
          <IconButton className={"tree-full-screen-btn"} style={{
            position: fullScreen ? "fixed" : "absolute",
            zIndex: 999,
            bottom: '.3rem',
            right: '.3rem',

          }} onClick={handleFullScreenClick} title={"Full screen"}>
            {fullScreen && <MdFullscreenExit
                color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"
                size={38}/>}
            {!fullScreen && <MdFullscreen
                color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"
                size={38}/>}
          </IconButton>

          <Suspense fallback={<div></div>}>
            <ExportButton
                step={step}
                treeWidth={treeWidth}
                treeHeight={treeHeight}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '1rem',
                  zIndex: 999,
                }}
                useAliases={showAliases}
            />
          </Suspense>

          <IconButton onClick={centerTree} style={{
            position: 'absolute',
            bottom: '.5rem',
            left: '.5rem',
            zIndex: 999,
          }} title={"Center tree"}
          >
            <AiOutlineAim size={26}
                          color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"></AiOutlineAim>
          </IconButton>

          <div className="flex flex-col gap-4 sm:gap-1 "
               style={{
                 position: 'absolute',
                 left: '1rem',
                 top: '1rem',
                 zIndex: 999,
               }}
          >
            {editorContext.globalCtx && !editorContext.globalCtx.isEmpty() && <Switch
                defaultSelected={showGammaDefinition}
                onChange={(isChecked) => setShowGammaDefinition(isChecked)}
            >
                <div className="indicator"/>
              {translations[confContext.language].tree.showGamma}
            </Switch>}
            {editorContext.aliasesPresent && <Switch

                defaultSelected={showAliases}
                onChange={(isChecked) => setShowAliases(isChecked)}
            >
                <div className="indicator"/>

              {translations[confContext.language].tree.showAlias}
            </Switch>}

          </div>

          {confContext.stepByStepMode && <div className="flex flex-row items-center justify-center align-middle w-full"
                                              style={{
                                                position: 'absolute',
                                                bottom: '.8rem',
                                              }}
          >
              <IconButton
                  onClick={() => {
                    if (step > 1) setStep(step - 1)
                  }}
              >
                  <FaArrowLeft size={26}
                               color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"/>
              </IconButton>
              <p className="step-label">
                {step}/{editorContext.nodeNumber}
              </p>
              <IconButton
                  onClick={() => {
                    if (step < editorContext.nodeNumber) setStep(step + 1)
                  }}
              >
                  <FaArrowRight size={26}
                                color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"/>
              </IconButton>
          </div>}

          {!editorContext.tree &&
              <div className="tree-info-bx">
                  <h1>
                    {translations[confContext.language].tree.treePlaceholder}
                  </h1>
              </div>
          }
        </div>
      </div>
  );
}




