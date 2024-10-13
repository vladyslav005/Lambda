import {editor} from "monaco-editor";
import {ProofNode} from "../../../../core/tree/TreeGenerator";
import {createContext, useState} from 'react';


export interface EditorContextInterface {
    setEditorValue : ( value : any) => void,
    setTree : (tree: ProofNode) => void,
    setErrors :( errors : string[]) => void,
    editorValue : string,
    tree: ProofNode | undefined,
    errors : string[] | undefined
}

export const EditorContext = createContext<EditorContextInterface>({
        setEditorValue  : ( value : any) => {},
        setTree : (tree : ProofNode) => {},
        setErrors :( errors : string[]) => {},
        editorValue : '',
        tree:  undefined,
        errors: undefined
    }
)

interface EditorProviderProps {
    children: React.ReactNode;
}

export const EditorState = (props: EditorProviderProps) => {
    const [editorValue, setEditorValue] = useState<string>('');
    const [tree, setTree] = useState<any>(null);  // Replace 'any' with your actual type
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

