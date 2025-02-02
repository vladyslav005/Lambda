import {
  Color,
  Dialog,
  Label,
  Menu,
  MenuItem,
  MenuTrigger,
  Modal,
  Popover,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack
} from "react-aria-components";
import {IconButton} from "../../../../common/components/button/IconButton";
import {MdContentCopy, MdDownload} from "react-icons/md";
import React, {useContext, useEffect, useRef, useState} from "react";
import {IoMdClose, IoMdDownload} from "react-icons/io";
import {useExportToLatex} from "../../hook/ExportToLatexHook";
import {EditorContext} from "../../../lambda-input/context/EditorContext";
import "./style.css"
import toast, {Toaster} from "react-hot-toast";
import {useExportToImage} from "../../hook/ExportToImageHook";
import {MapInteractionCSS} from "react-map-interaction";
import {ProofTreeComponentUsingCss} from "../prooftreeusingcss/ProofTreeUsingCss";
import {MyColorPicker} from "../colorpicker/ColorPicker";

//TODO: optimize for mobile
interface ExportButtonProps {
  style?: React.CSSProperties;
}

export const ExportButton = (props: ExportButtonProps) => {
  const editorContext = useContext(EditorContext);

  const [bussproofsModal, setBussproofsModal] = useState(false)
  const [ebproofModal, setEbproofModal] = useState(false)
  const bussproofsLatex = useRef("");
  const ebproofLatex = useRef("");

  const {
    exportToLatex,
    isTreeExportableToBussproofs,
    exportToBussproofs
  } = useExportToLatex();


  const pngDivRef = useRef(null);
  const [pngModal, setPngModal] = useState(false)
  const [pngWidth, setPngWidth] = useState(500)
  const [pngHeight, setPngHeight] = useState(300)
  const [pngBackgroundColor, setPngBackgroundColor] = useState<string>("#ffffff")
  const [pngFontColor, setPngFontColor] = useState<string>("#000000")
  const [isImageLoading, setIsImageLoading] = useState(false)

  const {handleDownloadPng} = useExportToImage();


  useEffect(() => {
    document.body.style.cursor = isImageLoading ? "wait" : "default";
    return () => {
      document.body.style.cursor = "default";
    };
  }, [isImageLoading]);

  return (
      <>
        <MenuTrigger>
          <IconButton
              style={{
                ...props.style,
                backgroundColor: "rgb(115,102,149)",
                borderRadius: 16
              }}

          >
            <MdDownload size={28} color="#ffff"/>
          </IconButton>

          <Popover>
            <Menu className="menu-bx">
              {editorContext.tree && isTreeExportableToBussproofs(editorContext.tree) &&
                  <MenuItem className="menu-item"
                            onAction={() => {
                              bussproofsLatex.current = (`${editorContext.tree && isTreeExportableToBussproofs(editorContext.tree)
                                  ? exportToBussproofs(editorContext.tree)
                                  : "not exported"}`)
                              setBussproofsModal(true)

                            }}
                  >LaTeX using bussproofs</MenuItem>
              }

              <MenuItem className="menu-item"
                        onAction={() => {
                          ebproofLatex.current = `${editorContext.tree ? exportToLatex(editorContext.tree) : " "}`
                          setEbproofModal(true)
                        }}
              >LaTeX using ebproof</MenuItem>
              <MenuItem className="menu-item"
                        onAction={() => {
                          setPngModal(true)
                        }}
              >PNG</MenuItem>

            </Menu>
          </Popover>
        </MenuTrigger>

        <Modal isDismissable isOpen={pngModal} onOpenChange={setPngModal}>
          <Dialog className="outline-0" style={{position: "relative"}}>
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
                onClick={() => setPngModal(false)}
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
                    {editorContext.tree && <ProofTreeComponentUsingCss color={pngFontColor} node={editorContext.tree}/>}
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

        <Modal isDismissable isOpen={bussproofsModal} onOpenChange={setBussproofsModal}>
          <Dialog className="outline-0" style={{position: "relative"}}>
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
                onClick={() => setBussproofsModal(false)}
            >
              <IoMdClose size={20}/>
            </IconButton>
            <div className="help-modal-content export-modal-content">

              <h1 className="modal-title">Preview</h1>

              <pre className="latex-code">

              {`${bussproofsLatex.current}`}

            </pre>

              <div className="my-4 flex flex-row-reverse ">

                <IconButton
                    style={{
                      backgroundColor: "rgb(115,102,149)",
                      borderRadius: 16,
                      color: "white",
                      fontWeight: 500,
                    }}

                    onClick={() => {
                      navigator.clipboard.writeText(bussproofsLatex.current)
                      toast('LaTex code copied to clipboard', {duration: 1000,})
                    }}
                >
                  <p>Copy to clipboard</p>

                  <MdContentCopy size={18}/>
                </IconButton>
              </div>
            </div>
            <div className="h-1"></div>

          </Dialog>
        </Modal>

        <Modal isDismissable isOpen={ebproofModal} onOpenChange={setEbproofModal}>
          <Dialog className="outline-0" style={{position: "relative"}}>
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
                onClick={() => setEbproofModal(false)}
            >
              <IoMdClose size={20}/>
            </IconButton>
            <div className="help-modal-content export-modal-content">
              <h1 className="modal-title">Preview</h1>

              <pre className="latex-code">
              {`${ebproofLatex.current}`}
            </pre>

              <div className="my-4 flex flex-row-reverse ">
                <IconButton
                    style={{
                      backgroundColor: "rgb(115,102,149)",
                      borderRadius: 16,
                      color: "white",
                      fontWeight: 500,

                    }}

                    onClick={() => {
                      navigator.clipboard.writeText(bussproofsLatex.current)
                      toast('LaTex code copied to clipboard', {duration: 1000,})
                    }}
                >
                  <p>Copy to clipboard</p>

                  <MdContentCopy size={18}/>
                </IconButton>
              </div>
            </div>
            <div className="h-1"></div>

          </Dialog>
        </Modal>
      </>
  )
}