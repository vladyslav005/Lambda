import {useContext} from "react";
import {EditorContext} from "../context/EditorContext";
import {InputAnalyzer} from "../../../../core/AnalyzeInput";

const analyzer = new InputAnalyzer();

export function useBuildTree() {
    const editorContext =  useContext(EditorContext);

    function buildTree() {
        try {
            editorContext.setTree(undefined);
            analyzer.analyzeInput(editorContext.editorValue)
            analyzer.checkTypes()

            const proofTree = analyzer.generateProofTree()

            if (proofTree) {
                editorContext.setTree(proofTree);
            }

            analyzer.clearContext()

        } catch (error) {
            console.warn(error)
        }
    }

    return {buildTree};
}