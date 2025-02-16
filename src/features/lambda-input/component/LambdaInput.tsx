import React, {useContext, useEffect} from 'react';
import Editor, {useMonaco} from '@monaco-editor/react';
import {setUpMonacoLanguage} from "../hook/SetUpMonacoLanguage";
import {EditorContext} from "../context/EditorContext";
import {useBuildTree} from "../hook/BuildTreeHook";
import "./LambdaInput.css"
import {EditorToolbar} from "./toolbar/EditorToolbar";
import {PasteExampleMenu} from "./pasteexample/PasteExampleMenu";
import {useEditorErrorsHook} from "../hook/EditorErrorsHook";


export default function LambdaInput() {
  const monaco = useMonaco();
  const editorContext = useContext(EditorContext);
  const {buildTree} = useBuildTree();

  const {setEditorErrors} = useEditorErrorsHook()


  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorContext.setEditor(editor);
    editorContext.setMonaco(monaco);
  };

  useEffect(() => {
    if (monaco) {
      try {
        setUpMonacoLanguage(monaco); // set up language and editor settings
        monaco.editor.setTheme("lambda-theme");
      } catch (e) {
        console.error('Error setting up Monaco:', e);
      }
    }
  }, [monaco]);

  function editorOnChange(value: any, event: any) {
    if (editorContext.editorValue.trim() === value.trim())
      return;

    editorContext.setEditorValue(value);

    console.log(value);
    const errors: Error[] | undefined = buildTree(value)
    setEditorErrors(errors)
  }

  return (
      <div
          className="lambda-input ui-block "
      >
        <EditorToolbar></EditorToolbar>

        <PasteExampleMenu
            style={{
              position: "absolute",
              zIndex: 1000,
              bottom: "1rem",
              right: "1rem",
            }}
        />

        <Editor
            className="h-full"
            language="lambda"
            options={{
              minimap: {enabled: false},
              automaticLayout: true,
              fontSize: editorContext.fontSize,
            }}
            value={editorContext.editorValue}
            onChange={editorOnChange}
            onMount={handleEditorDidMount}
            loading={""}
            wrapperProps={{
              style: {
                position: 'absolute',
                top: 16,
                left: 0,
                right: 0,
                bottom: 0,
              }
            }}
        />

      </div>
  );
}



