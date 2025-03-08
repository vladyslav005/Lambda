import {Group, Input, Separator, TextField, Toolbar} from 'react-aria-components';
import "./EditorToolbar.css"
import {MdAdd, MdContentCopy, MdContentCut, MdOutlineKeyboardDoubleArrowRight, MdRemove} from "react-icons/md";
import React, {useContext, useState} from "react";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {motion, useAnimationControls} from "framer-motion";
import {EditorContext} from "../../context/EditorContext";
import toast from 'react-hot-toast';
import {IconButton} from "../../../../common/components/button/IconButton";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";
import {LuSeparatorVertical} from "react-icons/lu";


export const EditorToolbar = () => {
  let iconSize = 20
  const controls = useAnimationControls();
  const editorContext = useContext(EditorContext);

  const confContext = useContext(ConfigurationContext);

  const handleClick = () => {
    if (isExpanded) {
      controls.start("initial").then()
      setIsExpanded(false)

    } else {
      controls.start("show").then()
      setIsExpanded(true)
    }
  }
  const [isExpanded, setIsExpanded] = useState(false)
  return (
      <div>
        <motion.div className={"toolbar-wrapper"}
                    variants={{
                      initial: {
                        x: "75%"
                      },
                      show: {
                        x: 0
                      }
                    }}

                    initial="initial"
                    transition={{
                      duration: .5,
                      ease: "easeInOut",
                      times: [0, 1]
                    }}

                    animate={controls}
        >

          <Toolbar className="editor-toolbar" aria-label="Text formatting">
            <IconButton className={"toolbar-button"}
                        onClick={handleClick}
            >
              <HiOutlineDotsHorizontal color="#ffffff"></HiOutlineDotsHorizontal>
            </IconButton>
            <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(editorContext.editorValue).then()
                  toast(translations[confContext.language].toast.editorContentCopy, {duration: 1000,})
                }}
            >
              <MdContentCopy color='#FFFFFF' size={iconSize}/>

            </IconButton>

            <Group aria-label="Font size">
              <IconButton
                  onClick={() => {
                    if (editorContext.fontSize > 2)
                      editorContext.setFontSize(editorContext.fontSize - 2)
                  }}
              >
                <MdRemove color='#FFFFFF' size={iconSize}/>
              </IconButton>
              <TextField className="font-size-field">
                <Input value={editorContext.fontSize} type={"number"} className={"text-input"}/>
              </TextField>
              <IconButton
                  onClick={() => {
                    if (editorContext.fontSize < 100)
                      editorContext.setFontSize(editorContext.fontSize + 2)
                  }}
              >
                <MdAdd color='#FFFFFF' size={iconSize}/>
              </IconButton>
            </Group>
          </Toolbar>
        </motion.div>
      </div>
  )
}