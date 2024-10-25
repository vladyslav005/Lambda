import {useContext} from "react";
import {EditorContext} from "../context/EditorContext";
import {InputAnalyzer} from "../../../../core/AnalyzeInput";

const analyzer = new InputAnalyzer();

export function useBuildTree() {
  const editorContext = useContext(EditorContext);

  function buildTree(value : string | undefined) {
    try {
      editorContext.setTree(undefined);

      if (!value) {
        throw new Error("Input is empty");
      }

      analyzer.analyzeInput(value)
      analyzer.checkTypes()

      const proofTree = analyzer.generateProofTree()

      if (proofTree) {
        editorContext.setTree(proofTree);
      }
      editorContext.setErrors([]);

      analyzer.clearContext()

    } catch (error : any) {
      editorContext.setErrors([error.toString()]);
      console.warn(error)
    }
  }

  return {buildTree};
}