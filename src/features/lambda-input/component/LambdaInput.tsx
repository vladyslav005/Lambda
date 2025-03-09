import React, {useContext, useEffect} from 'react';
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

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorContext.setEditor(editor);
    editorContext.setMonaco(monaco);

    const model = editor.getModel();
    if (!model) return;

    model.onDidChangeContent(() => {
      const value = model.getValue();
      const newValue = value
          .replace(/->/g, "→")
          .replace(/=>/g, "⇒");

      if (value !== newValue) {
        editor.executeEdits("", [
          {
            range: model.getFullModelRange(),
            text: newValue,
          },
        ]);
      }
    });
  };


  useEffect(() => {
    if (monaco) {
      try {
        setUpMonacoLanguage(monaco); // set up language and editor settings
        monaco.editor.setTheme(confContext.theme === Theme.Light ? "lambda-theme" : "dark-lambda-theme");

      } catch (e) {
        console.error('Error setting up Monaco:', e);
      }
    }
  }, [monaco]);


  useEffect(() => {
    if (monaco) {
      try {
        monaco.editor.setTheme(confContext.theme === Theme.Light ? "lambda-theme" : "lambda-theme-dark");
      } catch (e) {
        console.error('Error setting up Monaco:', e);
      }
    }
  }, [confContext.theme]);


  async function editorOnChange(value: any) {
    if (editorContext.editorValue.trim() === value.trim())
      return;

    editorContext.setEditorValue(value);

    console.log(value);
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
        {/*<EditorToolbar></EditorToolbar>*/}

        <div className="flex flex-row gap-2 items-center"
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
            language="lambda"
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
                height: '100%',
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



