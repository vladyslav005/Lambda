import React, {useContext, useEffect, useState} from 'react';
import Editor, {useMonaco} from '@monaco-editor/react';
import {setUpMonacoLanguage} from "../hook/SetUpMonacoLanguage";
import {EditorContext} from "../context/EditorContext";
import {useBuildTree} from "../hook/BuildTreeHook";
import "./LambdaInput.css"
import {useEditorErrorsHook} from "../hook/EditorErrorsHook";
import {ConfigurationContext, Theme} from "../../configurations/context/ConfigurationContext";
import {IconButton} from "../../../common/components/button/IconButton";
import {VscDebugRerun} from "react-icons/vsc";


export default function LambdaInput() {
  const monaco = useMonaco();
  const editorContext = useContext(EditorContext);
  const confContext = useContext(ConfigurationContext);

  const {buildTree} = useBuildTree();

  const {setEditorErrors} = useEditorErrorsHook();

  const [theme, setTheme] = useState("");

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorContext.setEditor(editor);
    editorContext.setMonaco(monaco);

    const model = editor.getModel();
    if (!model) return;

    let isReplacing = false;

    model.onDidChangeContent(() => {
      if (isReplacing) return;
      isReplacing = true;

      const position = editor.getPosition(); // Get current cursor position
      const value = model.getValue();
      const regex = /->|=>/g;

      let match;
      const edits = [];
      let newCursorPosition = { ...position }; // Default cursor position

      while ((match = regex.exec(value)) !== null) {
        const replacement = match[0] === "->" ? "→" : "⇒";
        const startPos = model.getPositionAt(match.index);
        const endPos = model.getPositionAt(match.index + 2);

        edits.push({
          range: {
            startLineNumber: startPos.lineNumber,
            startColumn: startPos.column,
            endLineNumber: endPos.lineNumber,
            endColumn: endPos.column,
          },
          text: replacement,
          forceMoveMarkers: true,
        });

        if (
            position.lineNumber === endPos.lineNumber &&
            position.column === endPos.column
        ) {
          newCursorPosition = {
            lineNumber: startPos.lineNumber,
            column: startPos.column + 1,
          };
        }
      }

      if (edits.length > 0) {
        editor.executeEdits("auto-replace", edits);

        setTimeout(() => {
          editor.setPosition(newCursorPosition);
          editor.focus();
        }, 0);
      }

      isReplacing = false;
    });
  };



  useEffect(() => {
    if (monaco) {
      try {
        setUpMonacoLanguage(monaco); // set up language and editor settings
      } catch (e) {
        console.error('Error setting up Monaco:', e);
      }
    }
  }, [monaco]);

  useEffect(() => {
    if (monaco) {
      try {
        setTheme(confContext.theme === Theme.Light ? "lambda-theme" : "lambda-theme-dark");
      } catch (e) {
        console.error('Error setting up Monaco:', e);
      }
    }
  }, [confContext.theme, monaco]);


  async function editorOnChange(value: any) {
    if (editorContext.editorValue.trim() === value.trim())
      return;

    editorContext.setEditorValue(value);

    const errors: Error[] | undefined = await buildTree(value)
    setEditorErrors(errors)
  }

  async function buildTreeClickHandler(value: any) {
    console.log(value);
    const errors: Error[] | undefined = await buildTree(value)
    setEditorErrors(errors)
  }

  // @ts-ignore
  return (
      <div
          className="lambda-input ui-block "
      >
        <div className="flex flex-row gap-2"
             style={{
               position: "absolute",
               zIndex: 1000,
               bottom: "1rem",
               right: "1rem",
             }}
        >
          {!confContext.interactive &&
              <IconButton className="build-tree-btn" title={"Run"}
                          onClick={() => buildTreeClickHandler(editorContext.editorValue)}
              >
                  <VscDebugRerun
                      color="#ffffff"
                      size={24}/>
              </IconButton>}
        </div>

        <Editor

            className="h-full"
            language="lambda"
            theme={theme}
            options={{
              minimap: {enabled: true},
              automaticLayout: true,
              fontSize: editorContext.fontSize,
            }}
            value={editorContext.editorValue}
            onChange={
              confContext.interactive
                  ? editorOnChange
                  : (val) => editorContext.setEditorValue(val)}
            onMount={handleEditorDidMount}
            loading={""}
            wrapperProps={{
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                paddingTop: editorContext.fontSize,
              }
            }}
        />

      </div>
  );
}



