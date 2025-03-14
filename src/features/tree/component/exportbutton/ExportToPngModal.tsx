import {
  Color,
  Dialog,
  Label,
  Modal,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  Switch
} from "react-aria-components";
import toast, {Toaster} from "react-hot-toast";
import {IconButton} from "../../../../common/components/button/IconButton";
import {IoMdClose, IoMdDownload} from "react-icons/io";
import {MapInteractionCSS} from "react-map-interaction";
import {ProofTreeComponentUsingCss} from "../prooftreeusingcss/ProofTreeUsingCss";
import {MyColorPicker} from "../colorpicker/ColorPicker";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useExportToImage} from "../../hook/ExportToImageHook";
import {EditorContext} from "../../../lambda-input/context/EditorContext";

// @ts-ignore
import rollingGif from "../../../../assets/rolling.gif"
import {AiOutlineAim} from "react-icons/ai";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";

interface ExportToEbpModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  treeWidth: number;
  treeHeight: number;
}

export const ExportToPngModal = (props: ExportToEbpModalProps) => {
  const confContext = useContext(ConfigurationContext)

  const editorContext = useContext(EditorContext);

  const [showAliases, setShowAliases] = useState(false)
  const [showGammaDefinition, setShowGammaDefinition] = useState(false)

  const pngDivRef = useRef(null);
  const [pngWidth, setPngWidth] = useState(600)
  const [pngHeight, setPngHeight] = useState(300)
  const [pngBackgroundColor, setPngBackgroundColor] = useState<string>("#ffffff")
  const [pngFontColor, setPngFontColor] = useState<string>("#000000")
  const [isImageLoading, setIsImageLoading] = useState(false)

  const {handleDownloadPng} = useExportToImage();

  const [treeWidth, setTreeWidth] = useState(props.treeWidth);
  const [treeHeight, setTreeHeight] = useState(props.treeHeight);
  const pngBoxRef = useRef<HTMLDivElement | null>(null);
  const treeRef = useRef<HTMLDivElement | null>(null);

  const [treeHasChanged, setTreeHasChanged] = useState(false)

  const [map, setMap] = useState({
    value: {
      scale: 1,
      translation: {x: 0, y: 0}
    }
  });

  const centerTree = () => {
    let scale = map.value.scale;
    if (Math.abs(treeWidth - pngWidth) > 0 || Math.abs(treeHeight - pngHeight) > 0)
      scale = Math.min(pngWidth / (treeWidth + 100), pngHeight / (treeHeight + 50));

    const centeredX = (pngWidth - (treeWidth + 75) * scale) / 2;
    const centeredY = (pngHeight - (treeHeight) * scale) / 2

    setMap({
      value: {
        scale: scale,
        translation: {x: centeredX, y: centeredY},
      }
    });
  }

  useEffect(() => {
    setTreeWidth(props.treeWidth);
    setTreeHeight(props.treeHeight);
    setPngHeight(props.treeHeight);
    setPngWidth(props.treeWidth + 90);
  }, [props.treeWidth, props.treeHeight]);

  useEffect(() => {
    if (treeRef.current) {
      const observer = new ResizeObserver(() => {
        if (treeRef.current) {
          setTreeWidth(treeRef.current.getBoundingClientRect().width / map.value.scale);
          setTreeHeight(treeRef.current.getBoundingClientRect().height / map.value.scale);
        }
      });

      observer.observe(treeRef.current);
      return () => observer.disconnect();
    }
  }, [treeHasChanged, showGammaDefinition, showAliases, map.value.scale]);

  return (
      <Modal isDismissable isOpen={props.isOpen} onOpenChange={props.setIsOpen}>
        <Dialog>

          {isImageLoading && <div className={"loading-overlay"}>
              <img alt="" src={rollingGif}/>
          </div>}

          <Toaster
              toastOptions={{
                position: "top-center",
                style: {
                  background: "var(--Schemes-Surface-Variant, #E7E0EC)",
                  color: "var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))",
                  fontFamily: "Roboto",
                  fontSize: "var(--Body-Medium-Size, 14px)",
                  fontStyle: "normal",
                  fontWeight: "400",
                  lineHeight: "var(--Body-Medium-Line-Height, 20px)",
                  letterSpacing: "var(--Body-Medium-Tracking, 0.25px)",
                  zIndex: 1000000,
                }
              }}
          />
          <div className="h-1"></div>
          <IconButton
              style={{
                position: "absolute",
                top: "0.4rem",
                right: "1rem",
                zIndex: 100000,
              }}
              onClick={() => props.setIsOpen(false)}
          >
            <IoMdClose color="var(--M3-sys-light-on-surface, var(--Schemes-On-Surface, #1D1B20))" size={20}/>
          </IconButton>

          <div className="help-modal-content flex flex-col relative export-modal-content justify-between">

            <h1 className="modal-title">{translations[confContext.language].tree.preview}</h1>

            <div ref={pngBoxRef} className="png-bx relative">
              <div className="png-div" ref={pngDivRef}
                   style={{
                     backgroundColor: pngBackgroundColor,
                     height: pngHeight,
                     width: pngWidth,
                     position: "relative",
                     right: "0",
                     top: "0",
                   }}
              >
                <MapInteractionCSS
                    value={map.value}
                    onChange={(value) => setMap({value})}
                >
                  {editorContext.tree &&
                      <ProofTreeComponentUsingCss
                          showGammaDefinition={showGammaDefinition}
                          canMutateTree={false}
                          treeRef={treeRef}
                          treeHasChanged={treeHasChanged} setTreeHasChanged={setTreeHasChanged}
                          showAliases={showAliases} color={pngFontColor}
                          node={editorContext.tree}/>}
                </MapInteractionCSS>

              </div>
            </div>

            <div className="my-6 flex flex-row flex-wrap justify-between gap-4">
              <div className="flex flex-col justify-between gap-4">
                <Slider defaultValue={pngWidth} maxValue={4096}
                        onChange={(width: number) => setPngWidth(width)}
                >
                  <Label>{translations[confContext.language].tree.width} (px)</Label>
                  <SliderOutput/>
                  <SliderTrack>
                    <SliderThumb/>
                  </SliderTrack>
                </Slider>

                <Slider defaultValue={pngHeight} maxValue={1024}
                        onChange={(height: number) => setPngHeight(height)}
                >
                  <Label>{translations[confContext.language].tree.height} (px)</Label>
                  <SliderOutput/>
                  <SliderTrack>
                    <SliderThumb/>
                  </SliderTrack>
                </Slider>

                {editorContext.aliasesPresent && <Switch
                    style={{}}
                    onChange={(isChecked) => setShowAliases(isChecked)}
                >
                    <div className="indicator"/>
                  {translations[confContext.language].tree.showAlias}
                </Switch>}
                {editorContext.globalCtx && !editorContext.globalCtx.isEmpty() && <Switch
                    defaultSelected={showGammaDefinition}
                    onChange={(isChecked) => setShowGammaDefinition(isChecked)}
                >
                    <div className="indicator"/>
                    Show Gamma definition

                </Switch>}

              </div>

              <div className="flex flex-col justify-between gap-4">
                <div>
                  <MyColorPicker defaultValue={pngFontColor} label={translations[confContext.language].tree.fontColor}
                                 onChange={(color: Color) => setPngFontColor(color.toString())}
                  ></MyColorPicker>
                </div>

                <div>
                  <MyColorPicker defaultValue={pngBackgroundColor}
                                 label={translations[confContext.language].tree.fillColor}
                                 onChange={(color: Color) => setPngBackgroundColor(color.toString())}
                  ></MyColorPicker>
                </div>

                <div className="flex flex-row items-center ">
                  <AiOutlineAim size={26}
                                color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"
                                style={{cursor: "pointer"}} onClick={() => centerTree()}></AiOutlineAim>
                  <IconButton className={"center-tree-btn"} onClick={() => centerTree()}>
                    {translations[confContext.language].tree.centerTree}
                  </IconButton>
                </div>
              </div>

              <div className="flex justify-end items-end">
                <IconButton
                    style={{
                      backgroundColor: "rgb(115,102,149)",
                      borderRadius: 16,
                      color: "white",
                      fontWeight: 500,
                      height: "fit-content",
                    }}

                    onClick={async () => {
                      setIsImageLoading(true);

                      setTimeout(async () => {
                        await handleDownloadPng(pngDivRef);

                        setIsImageLoading(false);
                        toast(translations[confContext.language].toast.imgDownload, {duration: 1000});
                      }, 500);
                    }}

                >
                  <p>{translations[confContext.language].tree.exportImg}</p>

                  <IoMdDownload size={18}/>
                </IconButton>
              </div>
            </div>
          </div>

          <div className="h-1"></div>

        </Dialog>
      </Modal>
  )
}