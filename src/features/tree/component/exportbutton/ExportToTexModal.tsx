import {Checkbox, Dialog, Modal} from "react-aria-components";
import toast, {Toaster} from "react-hot-toast";
import {IconButton} from "../../../../common/components/button/IconButton";
import {IoMdClose} from "react-icons/io";
import {MdContentCopy} from "react-icons/md";
import React, {useContext} from "react";
import {EditorContext} from "../../../lambda-input/context/EditorContext";


interface ExportToEbpModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tex: string;
  showAliases: boolean;
  setShowAliases: (showAliases: boolean) => void;
}

export const ExportToTexModal = (props: ExportToEbpModalProps) => {
  const editorContext = useContext(EditorContext);

  return (
      <Modal isDismissable isOpen={props.isOpen} onOpenChange={props.setIsOpen}>
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
              onClick={() => props.setIsOpen(false)}
          >
            <IoMdClose size={20}/>
          </IconButton>
          <div className="help-modal-content export-modal-content">
            <h1 className="modal-title">Preview</h1>

            <pre className="latex-code">
              {`${props.tex}`}
            </pre>

            <div className="my-4 flex flex-row justify-between">
              {editorContext.aliasesPresent && <Checkbox
                  style={{}}
                  onChange={(isChecked) => props.setShowAliases(isChecked)}
                  defaultSelected={props.showAliases}
              >
                  <div className="checkbox">
                      <svg viewBox="0 0 18 18" aria-hidden="true">
                          <polyline points="1 9 7 14 15 4"/>
                      </svg>
                  </div>
                  Use aliases
              </Checkbox>}

              {!editorContext.aliasesPresent && <div></div>}

              <IconButton
                  style={{
                    backgroundColor: "rgb(115,102,149)",
                    borderRadius: 16,
                    color: "white",
                    fontWeight: 500,
                  }}

                  onClick={() => {
                    navigator.clipboard.writeText(props.tex)
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
  )
}