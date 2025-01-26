import {Button, Group, Input, TextField, Toolbar} from 'react-aria-components';
import "./EditorToolbar.css"
import {MdAdd, MdContentCopy, MdContentCut, MdRemove} from "react-icons/md";
import React, {useContext, useState} from "react";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {motion, useAnimationControls} from "framer-motion";
import {EditorContext} from "../context/EditorContext";
import toast from 'react-hot-toast';

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
      <div className="toolbar-wrapper">
        <motion.div
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
            <Button className={"toolbar-button"}
                    onPress={handleClick}
            >
              <HiOutlineDotsHorizontal></HiOutlineDotsHorizontal>
            </Button>
            <Button
                onPress={() => {
                  navigator.clipboard.writeText(editorContext.editorValue)
                  toast('Editor content copied to clipboard', {duration: 1000,})
                }}
            >
              <MdContentCopy size={iconSize}/>
            </Button>

            <Button
                onPress={() => {
                  navigator.clipboard.writeText(editorContext.editorValue)
                  editorContext.setEditorValue("")
                  editorContext.setTree(undefined)
                  editorContext.setErrors([])
                  toast('Editor content copied to clipboard', {duration: 1000,})
                }}
            >
              <MdContentCut size={iconSize}/>
            </Button>
            <Group aria-label="Font size">
              <Button
                  onPress={() => {
                    editorContext.setFontSize(editorContext.fontSize - 2)
                  }}
              >
                <MdRemove size={iconSize + 5}/>
              </Button>
              <TextField className="font-size-field">
                <Input value={editorContext.fontSize} type={"number"} className={"text-input"}/>
              </TextField>
              <Button
                  onPress={() => {
                    editorContext.setFontSize(editorContext.fontSize + 2)
                  }}
              >
                <MdAdd size={iconSize + 5}/>
              </Button>
            </Group>
          </Toolbar>
        </motion.div>
      </div>
  )
}