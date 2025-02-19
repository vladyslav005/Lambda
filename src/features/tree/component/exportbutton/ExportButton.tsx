import {Menu, MenuItem, MenuTrigger, Popover} from "react-aria-components";
import {IconButton} from "../../../../common/components/button/IconButton";
import {MdDownload} from "react-icons/md";
import React, {useContext, useEffect, useState} from "react";
import {useExportToLatex} from "../../hook/ExportToLatexHook";
import {EditorContext} from "../../../lambda-input/context/EditorContext";
import "./style.css"
import {ExportToTexModal} from "./ExportToTexModal";
import {ExportToPngModal} from "./ExportToPngModal";

interface ExportButtonProps {
  style?: React.CSSProperties;
  useAliases: boolean;
  treeWidth: number;
  treeHeight: number;
}

const ExportButton = (props: ExportButtonProps) => {
  const editorContext = useContext(EditorContext);

  const [bussproofsModal, setBussproofsModal] = useState(false)
  const [ebproofModal, setEbproofModal] = useState(false)

  const [bussproofsLatex, setBussproofsLatex] = useState("")
  const [ebproofLatex, setEbproofLatex] = useState("")

  const [pngModal, setPngModal] = useState(false)

  const {
    exportToLatex,
    isTreeExportableToBussproofs,
    exportToBussproofs
  } = useExportToLatex();

  const [showAliases, setShowAliases] = useState(props.useAliases)

  useEffect(() => {
    if ((bussproofsModal || ebproofModal)) {
      setBussproofsLatex(
          `${editorContext.tree && isTreeExportableToBussproofs(editorContext.tree)
              ? exportToBussproofs(editorContext.tree, showAliases)
              : "not exported"}`)
      setEbproofLatex(`${editorContext.tree ? exportToLatex(editorContext.tree, showAliases) : " "}`)
    }
  }, [showAliases, bussproofsModal, ebproofModal,
    editorContext.tree, isTreeExportableToBussproofs, exportToBussproofs, exportToLatex]);

  return (
      <>
        <MenuTrigger>
          <IconButton className="export-button"
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
                              setBussproofsModal(true)
                            }}
                  >LaTeX using bussproofs</MenuItem>}

              <MenuItem className="menu-item"
                        onAction={() => {
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

        <ExportToPngModal
            treeWidth={props.treeWidth} treeHeight={props.treeHeight}
            isOpen={pngModal} setIsOpen={setPngModal}/>

        <ExportToTexModal
            showAliases={showAliases} setShowAliases={setShowAliases}
            isOpen={ebproofModal} setIsOpen={setEbproofModal}
            tex={ebproofLatex}/>

        <ExportToTexModal
            showAliases={showAliases} setShowAliases={setShowAliases}
            isOpen={bussproofsModal} setIsOpen={setBussproofsModal}
            tex={bussproofsLatex}/>
      </>
  )
}

export default ExportButton;