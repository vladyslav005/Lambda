import {ProofNode} from "../../../../core/tree/TreeGenerator";
import {createContext, useState} from 'react';
import {ErrorMessage} from '../../erroroutput/types/error_types'

export interface EditorContextInterface {
  setEditorValue: (value: any) => void,
  setTree: (tree: ProofNode | undefined) => void,
  setErrors: (errors: string[]) => void,
  editorValue: string,
  tree: ProofNode | undefined,
  errors: string[] | undefined
}

export const EditorContext = createContext<EditorContextInterface>({
      setEditorValue: (value: any) => {
      },
      setTree: (tree: ProofNode | undefined) => {
      },
      setErrors: (errors: string[]) => {
      },
      editorValue: '',
      tree: undefined,
      errors: []
    }
)

interface EditorProviderProps {
  children: React.ReactNode;
}

export const EditorState = (props: EditorProviderProps) => {
  const [editorValue, setEditorValue] = useState<string>('');
  const [tree, setTree] = useState<ProofNode | undefined>(undefined);  // Replace 'any' with your actual type
  const [errors, setErrors] = useState<string[] | undefined>(undefined);


  const contextValue: EditorContextInterface = {
    setEditorValue,
    setTree,
    setErrors,
    editorValue,
    tree,
    errors,
  };

  return (
      <EditorContext.Provider value={contextValue}>
        {props.children}
      </EditorContext.Provider>
  );

}

