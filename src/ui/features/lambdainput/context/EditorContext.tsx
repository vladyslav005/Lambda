import {ProofNode} from "../../../../core/tree/TreeGenerator";
import React, {createContext, useState} from 'react';
import {ErrorMessage} from '../../erroroutput/types/error_types'


// CONTEXT TO STORE EDITOR VALUE AND OTHER SHARED VARIABLES

export interface EditorContextInterface {
  setEditorValue: (value: any) => void,
  setTree: (tree: ProofNode | undefined) => void,
  setErrors: (errors: Error[]) => void,
  editorValue: string,
  setEditor: (editor: any) => void,
  setMonaco: (monaco: any) => void,

  tree: ProofNode | undefined,
  errors: Error[] | undefined,
  editor : any,
  monaco : any
}

export const EditorContext = createContext<EditorContextInterface>({
      setEditorValue: (value: any) => {},
      setTree: (tree: ProofNode | undefined) => {},
      setErrors: (errors: Error[]) => {},
      setEditor: (editor: any) => {},
      setMonaco: (monaco: any) => {},
      editorValue: '',
      tree: undefined,
      errors: [],
      editor : undefined,
      monaco : undefined,
    }
)

interface EditorProviderProps {
  children: React.ReactNode;
}

export const EditorState = (props: EditorProviderProps) => {
  const [editorValue, setEditorValue] = useState<string>('');
  const [tree, setTree] = useState<ProofNode | undefined>(undefined);  // Replace 'any' with your actual type
  const [errors, setErrors] = useState<Error[] | undefined>(undefined);
  const [monaco, setMonaco] = useState<any>();
  const [editor, setEditor] = useState<any>();


  const contextValue: EditorContextInterface = {
    setEditorValue,
    setTree,
    setErrors,
    setEditor,
    setMonaco,
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

