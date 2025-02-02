import {Button, Dialog, Menu, MenuItem, MenuTrigger, Modal, Popover} from "react-aria-components";
import {IconButton} from "../../../../common/components/button/IconButton";
import {MdContentCopy, MdDownload} from "react-icons/md";
import React, {useContext, useRef, useState} from "react";
import {IoMdClose} from "react-icons/io";
import {useExportToLatex} from "../../hook/ExportToLatexHook";
import {EditorContext} from "../../../lambda-input/context/EditorContext";
import "./style.css"
import toast, {Toaster} from "react-hot-toast";

interface ExportButtonProps {
  style?: React.CSSProperties;
}

export const ExportButton = (props: ExportButtonProps) => {
  const [bussproofsModal, setBussproofsModal] = useState(false)
  const [ebproofModal, setEbproofModal] = useState(false)


  const bussproofsLatex = useRef("");
  const ebproofLatex = useRef("");


  const editorContext = useContext(EditorContext);

  const {
    exportToLatex,
    isTreeExportableToBussproofs,
    exportToBussproofs
  } = useExportToLatex();

  const switchEbproofModal = () => {
    setEbproofModal(!ebproofModal);
  }


  const switchBussproofsModal = () => {
    setBussproofsModal(!bussproofsModal);
  }

  return (
      <>
      <MenuTrigger>
        <IconButton
            style={{
              ...props.style,
              backgroundColor: "rgb(115,102,149)",
              borderRadius : 16
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

            <MenuItem className="menu-item disabled-item"
                       onAction={() => {
                         ebproofLatex.current = `${editorContext.tree ? exportToLatex(editorContext.tree) : " "}`
                         setEbproofModal(true)
                       }}
            >LaTeX using ebproof</MenuItem>

          </Menu>
        </Popover>
      </MenuTrigger>

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
              onClick={()=> setBussproofsModal(false) }
          >
            <IoMdClose size={20}/>
          </IconButton>
          <div className="help-modal-content export-modal-content" >

            <h1 className="modal-title">Preview</h1>

            <pre  className="latex-code">

              {`${bussproofsLatex.current}`}

            </pre>

            <div className="my-4 flex flex-row-reverse ">

              <IconButton
                style={{
                  backgroundColor: "rgb(115,102,149)",
                  borderRadius : 16,
                  color:"white",
                  fontWeight: 500,
                }}

                  onClick={() => {
                    navigator.clipboard.writeText(bussproofsLatex.current)
                    toast('LaTex code copied to clipboard', {duration: 1000,})
                  }}
              >
                <p>Copy to clipboard</p>

                <MdContentCopy size={18} />
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
              onClick={()=> setEbproofModal(false) }
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
                  borderRadius : 16,
                  color:"white",
                  fontWeight: 500,

                }}

                onClick={() => {
                  navigator.clipboard.writeText(bussproofsLatex.current)
                  toast('LaTex code copied to clipboard', {duration: 1000,})
                }}
              >
                <p>Copy to clipboard</p>

                <MdContentCopy size={18} />
              </IconButton>
            </div>
          </div>
          <div className="h-1"></div>

        </Dialog>
      </Modal>
      </>
  )
}