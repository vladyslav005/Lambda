import React, {useContext, useEffect} from 'react';
import Editor, {useMonaco} from '@monaco-editor/react';
import {setUpMonacoLanguage} from "../hook/SetUpMonacoLanguage";
import {EditorContext} from "../context/EditorContext";
import {useBuildTree} from "../hook/BuildTreeHook";
import {SyntaxError, TypeError} from "../../../../core/errorhandling/customErrors";
import "./LambdaInput.css"


export function LambdaInput() {
  const monaco = useMonaco();
  const editorContext = useContext(EditorContext);
  const {buildTree} = useBuildTree();


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

    value = value.replaceAll(/^\s*\/\/.*$/gm, "")
    editorContext.setEditorValue(value);

    console.log(value);
    const errors: Error[] | undefined = buildTree(value)
    setEditorErrors(errors)
  }

  // UNDERLINE ERRORS IN EDITOR
  function setEditorErrors(errors: Error[] | undefined) {
    const model = editorContext.editor.getModel();
    const markers: any[] = [];

    editorContext.monaco.editor.setModelMarkers(model, 'lambda-errors', []);

    errors?.forEach((error) => {

      if (error instanceof SyntaxError || error instanceof TypeError) {

        markers.push({
          startLineNumber: error.startLine,
          startColumn: error.startColumn,
          endLineNumber: error.endLine,
          endColumn: error.endColumn + 1,
          message: error.message,
          severity: editorContext.monaco.MarkerSeverity.Error,
        });
      }

    });

    editorContext.monaco.editor.setModelMarkers(model, 'lambda-errors', markers);

  }

  return (
      <div
          className="lambda-input bg-amber-100 ui-block m-0"
      >
        <Editor
            className="h-full"
            language="lambda"
            options={{
              minimap: {enabled: false},
              automaticLayout: true,
              fontSize: 18,
            }}
            onChange={editorOnChange}
            onMount={handleEditorDidMount}
            wrapperProps={{
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }
            }}
        />

      </div>
  );
}



