import {Dialog, Modal, Switch} from "react-aria-components";
import toast, {Toaster} from "react-hot-toast";
import {IconButton} from "../../../../common/components/button/IconButton";
import {IoMdClose} from "react-icons/io";
import {MdContentCopy} from "react-icons/md";
import React, {useContext, useEffect, useState} from "react";
import {EditorContext} from "../../../editor/context/EditorContext";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";
import {Context} from "../../../../core/context/Context";
import {preprocessString, preprocessTex} from "../../../../core/utils";


interface ExportToEbpModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tex: string;
  showAliases: boolean;
  setShowAliases: (showAliases: boolean) => void;
}

export const ExportToTexModal = (props: ExportToEbpModalProps) => {
  const editorContext = useContext(EditorContext);
  const confContext = useContext(ConfigurationContext)

  const [gammaTex, setGammaTex] = useState("")

  const generateGammaTex = () => {
    return preprocessTex(preprocessString(
        `$\\Gamma = \\{${!props.showAliases
            ? editorContext.globalCtx?.toStringWithoutAliases(editorContext.aliasCtx ?? new Context())
            : editorContext.globalCtx?.toStringWithAliases(editorContext.aliasCtx ?? new Context())
        }\\}$`
    ))
  }

  useEffect(() => {
    setGammaTex(generateGammaTex())
  }, [editorContext.globalCtx, props.showAliases])

  return (
      <Modal className="outline-0" isDismissable isOpen={props.isOpen} onOpenChange={props.setIsOpen}>
        <Dialog>
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
                top: "0.3rem",
                right: "1rem",
              }}
              onClick={() => props.setIsOpen(false)}
          >
            <IoMdClose color="var(--M3-sys-light-on-surface, var(--Schemes-On-Surface, #1D1B20))" size={20}/>
          </IconButton>
          <div className="help-modal-content export-modal-content">
            <h1 className="modal-title">{translations[confContext.language].tree.preview}</h1>

            <div className="latex-code mb-4 relative">
              <IconButton
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(gammaTex).then()
                    toast(translations[confContext.language].toast.texCopy, {duration: 1000,})
                  }}
              >
                <MdContentCopy size={20}/>
              </IconButton>
              <pre>
                {gammaTex}
              </pre>
            </div>

            <div className="latex-code">
              <pre>
                {`${props.tex}`}
              </pre>
            </div>

            <div className="my-4 flex flex-row justify-between">
              {editorContext.aliasesPresent && <Switch
                  style={{}}
                  onChange={(isChecked) => props.setShowAliases(isChecked)}
              >
                  <div className="indicator"/>
                {translations[confContext.language].tree.showAlias}
              </Switch>}

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
                    toast(translations[confContext.language].toast.texCopy, {duration: 1000,})
                  }}
              >
                <p>{translations[confContext.language].tree.exportTexCopy}</p>

                <MdContentCopy size={18}/>
              </IconButton>

            </div>
          </div>
          <div className="h-1"></div>

        </Dialog>
      </Modal>
  )
}