import {useContext} from "react";
import {EditorContext} from "../context/EditorContext";


export function useBuildTree() {
  const editorContext = useContext(EditorContext);

  const buildTree = async (value: string | undefined): Promise<Error[] | undefined> => {
    const {InputAnalyzer} = await import("../../../core/AnalyzeInput");

    const analyzer = new InputAnalyzer();

    try {
      editorContext.setTree(undefined);

      if (!value || (value && value.trim() === "")) {
        editorContext.setErrors([])
        return undefined;
      }

      const proofTree = analyzer.analyzeInput(value);

      if (proofTree) {
        editorContext.setTree(proofTree);
        editorContext.setAliasesPresent(proofTree.aliasesPresent ? proofTree.aliasesPresent : false);
      }
      editorContext.setErrors([]);

    } catch (error: any) {

      editorContext.setErrors([error]);
      console.warn(error)
      return [error]; // return list if errors

    }

    return undefined; // return undefined if there were no errors
  }

  return {buildTree};
}