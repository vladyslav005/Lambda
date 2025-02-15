import {
  Checkbox,
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
import {ExportToTexModal} from "./ExportToTexModal";
import {ExportToPngModal} from "./ExportToPngModal";

//TODO: optimize for mobile
interface ExportButtonProps {
  style?: React.CSSProperties;
  useAliases: boolean;
}

export const ExportButton = (props: ExportButtonProps) => {
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
    setBussproofsLatex(
        `${editorContext.tree && isTreeExportableToBussproofs(editorContext.tree)
            ? exportToBussproofs(editorContext.tree, showAliases)
            : "not exported"}`)
    setEbproofLatex(`${editorContext.tree ? exportToLatex(editorContext.tree, showAliases) : " "}`)
  }, [showAliases]);

  // useEffect(() => {
  //   setShowAliases(props.useAliases)
  // }, [props.useAliases]);

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
                      onAction={() => {setBussproofsModal(true)}}
                  >LaTeX using bussproofs</MenuItem>}

              <MenuItem className="menu-item"
                  onAction={() => {setEbproofModal(true)}}
              >LaTeX using ebproof</MenuItem>
              <MenuItem className="menu-item"
                  onAction={() => {setPngModal(true)}}
              >PNG</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>

        <ExportToPngModal isOpen={pngModal} setIsOpen={setPngModal} />

        <ExportToTexModal
            showAliases={showAliases} setShowAliases={setShowAliases}
            isOpen={ebproofModal} setIsOpen={setEbproofModal}
            tex={ebproofLatex} />

        <ExportToTexModal
            showAliases={showAliases} setShowAliases={setShowAliases}
            isOpen={bussproofsModal} setIsOpen={setBussproofsModal}
            tex={bussproofsLatex} />
      </>
  )
}