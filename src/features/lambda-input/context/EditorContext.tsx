import {ProofNode} from "../../../core/tree/TreeGenerator";
import React, {createContext, useState} from 'react';


// CONTEXT TO STORE EDITOR VALUE AND OTHER SHARED VARIABLES

export interface EditorContextInterface {
  setEditorValue: (value: any) => void,
  setTree: (tree: ProofNode | undefined) => void,
  setErrors: (errors: Error[]) => void,
  editorValue: string,
  setEditor: (editor: any) => void,
  setMonaco: (monaco: any) => void,
  setFontSize: (fontSize: any) => void,
  setAliasesPresent: (value: boolean) => void,
  setGlobalCtx: (globalCtx: string) => void,
  setGlobalCtxWithAliases: (globalCtx: string) => void,

  globalCtxWithAliases: string,
  globalCtx: string,
  aliasesPresent: boolean
  fontSize: number,
  tree: ProofNode | undefined,
  errors: Error[] | undefined,
  editor: any,
  monaco: any
}

export const EditorContext = createContext<EditorContextInterface>({
      setEditorValue: (value: any) => {},
      setTree: (tree: ProofNode | undefined) => {},
      setErrors: (errors: Error[]) => {},
      setEditor: (editor: any) => {},
      setMonaco: (monaco: any) => {},
      setFontSize: (newSize: number) => {},
      setAliasesPresent: (value: boolean) => {},
      setGlobalCtx: (globalCtx: string) => {},
      setGlobalCtxWithAliases: (globalCtx: string) => {},

      globalCtxWithAliases: '',
      globalCtx: '',
      aliasesPresent: false,
      fontSize: 18,
      editorValue: '',
      tree: undefined,
      errors: [],
      editor: undefined,
      monaco: undefined,
    }
)

interface EditorProviderProps {
  children: React.ReactNode;
}

export const EditorContextProvider = (props: EditorProviderProps) => {
  const [editorValue, setEditorValue] = useState<string>('');
  const [tree, setTree] = useState<ProofNode | undefined>(undefined);
  const [errors, setErrors] = useState<Error[] | undefined>(undefined);
  const [monaco, setMonaco] = useState<any>();
  const [editor, setEditor] = useState<any>();
  const [fontSize, setFontSize] = useState(18)
  const [aliasesPresent, setAliasesPresent] = useState(false)
  const [globalCtx, setGlobalCtx] = useState('');
  const [globalCtxWithAliases, setGlobalCtxWithAliases] = useState('')

  const contextValue: EditorContextInterface = {
    setEditorValue,
    setTree,
    setErrors,
    setEditor,
    setMonaco,
    setFontSize,
    setAliasesPresent,
    setGlobalCtx,
    setGlobalCtxWithAliases,
    globalCtxWithAliases,
    globalCtx,
    aliasesPresent,
    fontSize,
    editorValue,
    tree,
    errors,
    editor,
    monaco,
  };

  return (
      <EditorContext.Provider value={contextValue}>
        {props.children}
      </EditorContext.Provider>
  );

}

