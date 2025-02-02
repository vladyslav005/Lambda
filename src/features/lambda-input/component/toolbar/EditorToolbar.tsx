import {Group, Input, TextField, Toolbar} from 'react-aria-components';
import "./EditorToolbar.css"
import {MdAdd, MdContentCopy, MdContentCut, MdRemove} from "react-icons/md";
import React, {useContext, useState} from "react";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {motion, useAnimationControls} from "framer-motion";
import {EditorContext} from "../../context/EditorContext";
import toast from 'react-hot-toast';
import {IconButton} from "../../../../common/components/button/IconButton";

interface EditorToolbarProps {

}

export const EditorToolbar = () => {
  let iconSize = 20
  const controls = useAnimationControls();
  const editorContext = useContext(EditorContext);


  const handleClick = () => {
    if (isExpanded) {
      controls.start("initial")
      setIsExpanded(false)

    } else {
      controls.start("show")
      setIsExpanded(true)
    }
  }
  const [isExpanded, setIsExpanded] = useState(false)
  return (
      <div>
        <motion.div className={"toolbar-wrapper"}
                    variants={{
                      initial: {
                        x: "80%"
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
              <HiOutlineDotsHorizontal></HiOutlineDotsHorizontal>
            </IconButton>
            <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(editorContext.editorValue)
                  toast('Editor content copied to clipboard', {duration: 1000,})
                }}
            >
              <MdContentCopy size={iconSize}/>

            </IconButton>

            <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(editorContext.editorValue)
                  editorContext.setEditorValue("")
                  editorContext.setTree(undefined)
                  editorContext.setErrors([])
                  toast('Editor content copied to clipboard', {duration: 1000,})
                }}
            >
              <MdContentCut size={iconSize}/>
            </IconButton>
            <Group aria-label="Font size">
              <IconButton
                  onClick={() => {
                    if (editorContext.fontSize > 2)
                      editorContext.setFontSize(editorContext.fontSize - 2)
                  }}
              >
                <MdRemove size={iconSize}/>
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
                <MdAdd size={iconSize}/>
              </IconButton>
            </Group>
          </Toolbar>
        </motion.div>
      </div>
  )
}