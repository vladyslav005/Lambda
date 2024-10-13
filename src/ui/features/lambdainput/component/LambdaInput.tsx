import React, {useContext, useEffect} from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { setUpMonacoLanguage } from "../hook/SetUpMonacoLanguage";
import {EditorContext} from "../context/EditorContext";
import {CharStream, CommonTokenStream} from "antlr4";
import LambdaCalcLexer from "../../../../core/antlr/LambdaCalcLexer";
import LambdaCalcParser from "../../../../core/antlr/LambdaCalcParser";
import TypeChecker from "../../../../core/typechecker/TypeChecker";
import {TreeGenerator} from "../../../../core/tree/TreeGenerator";


export function LambdaInput() {
    const monaco = useMonaco(); // Ensures monaco is ready before usage
    const editorContext = useContext(EditorContext);

    useEffect(() => {
        if (monaco) {
            try {
                setUpMonacoLanguage(monaco);
                monaco.editor.setTheme("lambda-theme");
            } catch (e) {
                console.log('Error setting up Monaco:', e);
            }
        }
    }, [monaco]);

    function buttonClickHandler(e: any) {
        console.log(editorContext.editorValue);

        const input = editorContext.editorValue

        const lexer = new LambdaCalcLexer(new CharStream(input));

        const tokens = new CommonTokenStream(lexer);

        const parser = new LambdaCalcParser(tokens);

        const typeChecker = new TypeChecker()

        const tree = parser.expression();


        const typeCheck = typeChecker.visit(tree)



        const globalContext = typeChecker.globalContext;

        const treeGenerator = new TreeGenerator(globalContext);
        treeGenerator.visit(tree)
        if ( treeGenerator.proofTree)
            editorContext.setTree(treeGenerator.proofTree)


    }


    return (
        <div
            className="lambda-input bg-amber-100 ui-block m-0"
            style={{
                position: 'relative',
                flexGrow: 2,
            }}
        >
            <Editor
                className="h-full"
                language="lambda"
                options={{
                    minimap: { enabled: false },
                    automaticLayout: true,
                    fontSize: 14,
                }}
                onChange={(value, event) => editorContext.setEditorValue(value)}
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

            <button
                className="bg-transparent hover:bg-green-500 text-green-700 font-semibold
                    hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '20px',
                    zIndex: 1
                }}
                onClick={buttonClickHandler}
            >
                Build tree
            </button>
        </div>
    );
}




