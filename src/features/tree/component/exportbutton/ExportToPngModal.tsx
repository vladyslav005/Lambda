import {
  Checkbox,
  Color,
  Dialog,
  Label,
  Modal,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack
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

interface ExportToEbpModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const ExportToPngModal = (props: ExportToEbpModalProps) => {
  const editorContext = useContext(EditorContext);

  const [showAliases, setShowAliases] = useState(false)
  const pngDivRef = useRef(null);
  const [pngWidth, setPngWidth] = useState(500)
  const [pngHeight, setPngHeight] = useState(300)
  const [pngBackgroundColor, setPngBackgroundColor] = useState<string>("#ffffff")
  const [pngFontColor, setPngFontColor] = useState<string>("#000000")
  const [isImageLoading, setIsImageLoading] = useState(false)

  const {handleDownloadPng} = useExportToImage();


  return (
      <Modal isDismissable isOpen={props.isOpen} onOpenChange={props.setIsOpen}>
        <Dialog className="outline-0" style={{position: "relative"}}>

          {isImageLoading &&<div className={"loading-overlay"}>
            <img src={rollingGif}/>
          </div>}

          <Toaster
              toastOptions={{
                position: "top-center",
                style: {
                  color: "#49454F",
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
                top: "0.3rem",
                right: "1rem",
              }}
              onClick={() => props.setIsOpen(false)}
          >
            <IoMdClose size={20}/>
          </IconButton>
          <div className="help-modal-content export-modal-content">

            <h1 className="modal-title">Preview</h1>

            <div className="png-bx w-full">
              <div ref={pngDivRef}
                   style={{
                     backgroundColor: pngBackgroundColor,
                     height: pngHeight,
                     width: pngWidth,
                   }}
              >
                <MapInteractionCSS>
                  {editorContext.tree && <ProofTreeComponentUsingCss showAliases={showAliases} color={pngFontColor}
                                                                     node={editorContext.tree}/>}
                </MapInteractionCSS>

              </div>
            </div>


            <div className="my-6 flex flex-row justify-between ">

              <div className="flex flex-col gap-4">
                <Slider defaultValue={pngWidth} maxValue={2048}
                        onChange={(width: number) => setPngWidth(width)}

                >
                  <Label>Width (px)</Label>
                  <SliderOutput/>
                  <SliderTrack>
                    <SliderThumb/>
                  </SliderTrack>
                </Slider>

                <Slider defaultValue={pngHeight} maxValue={2048}
                        onChange={(height: number) => setPngHeight(height)}
                >
                  <Label>Height (px)</Label>
                  <SliderOutput/>
                  <SliderTrack>
                    <SliderThumb/>
                  </SliderTrack>
                </Slider>

                {editorContext.aliasesPresent && <Checkbox
                    style={{}}
                    onChange={(isChecked) => setShowAliases(isChecked)}
                >
                    <div className="checkbox">
                        <svg viewBox="0 0 18 18" aria-hidden="true">
                            <polyline points="1 9 7 14 15 4"/>
                        </svg>
                    </div>
                    Show aliases
                </Checkbox>}

              </div>

              <div className="flex flex-col justify-evenly ">
                <MyColorPicker defaultValue={pngFontColor} label={"Font color"}
                               onChange={(color: Color) => setPngFontColor(color.toString())}
                ></MyColorPicker>

                <MyColorPicker defaultValue={pngBackgroundColor} label={"Fill color"}
                               onChange={(color: Color) => setPngBackgroundColor(color.toString())}
                ></MyColorPicker>
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
                        toast("Image downloaded", {duration: 1000});
                      }, 500);
                    }}

                >
                  <p>Download image</p>

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