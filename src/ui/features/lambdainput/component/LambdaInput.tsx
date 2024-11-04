import React, {useContext, useEffect, useRef, useState} from 'react';
import Editor, {useMonaco} from '@monaco-editor/react';
import {setUpMonacoLanguage} from "../hook/SetUpMonacoLanguage";
import {EditorContext} from "../context/EditorContext";
import {useBuildTree} from "../hook/BuildTreeHook";
import {SyntaxError, TypeError} from "../../../../core/errorhandling/customErrors";


export function LambdaInput() {
  const monaco = useMonaco();
  const editorContext = useContext(EditorContext);
  const {buildTree} = useBuildTree();

  const handleEditorDidMount = (editor : any, monaco: any) => {
    editorContext.setEditor(editor);
    editorContext.setMonaco(monaco);

  };

  const getExpressionTillFirstParen = (lineContent : any, column : any) => {

  };

  useEffect(() => {
    if (monaco) {
      try {
        setUpMonacoLanguage(monaco);
        monaco.editor.setTheme("lambda-theme");
      } catch (e) {
        console.error('Error setting up Monaco:', e);
      }
    }
  }, [monaco]);

  function buttonClickHandler(e: any) {
    buildTree(editorContext.editorValue)
  }


  function editorOnChange(value : any, event : any) {
    editorContext.setEditorValue(value);
    const errors = buildTree(value)

    // UNDERLINE ERRORS
    const model = editorContext.editor.getModel();
    const markers : any[] = [];

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
          style={{
            position: 'relative',
            flexGrow: 1,
          }}
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

        {/*<button*/}
        {/*    className="build-button bg-transparent hover:bg-green-500 text-green-700 font-semibold*/}
        {/*            hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"*/}
        {/*    style={{*/}
        {/*      position: 'absolute',*/}
        {/*      bottom: '10px',*/}
        {/*      left: '20px',*/}
        {/*      zIndex: 1*/}
        {/*    }}*/}
        {/*    onClick={buttonClickHandler}*/}
        {/*>*/}
        {/*  Build tree*/}
        {/*</button>*/}
      </div>
  );
}



