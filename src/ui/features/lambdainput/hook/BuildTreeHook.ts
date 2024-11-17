import {useContext} from "react";
import {EditorContext} from "../context/EditorContext";
import {InputAnalyzer} from "../../../../core/AnalyzeInput";
import {ConfigurationHandler} from "react-native-mathjax-html-to-svg/mathjax/input/tex/Configuration";
import set = ConfigurationHandler.set;

const analyzer = new InputAnalyzer();

export function useBuildTree() {
  const editorContext = useContext(EditorContext);

  function buildTree(value: string | undefined): Error[] | undefined {
    try {
      editorContext.setTree(undefined);

      if (!value || (value && value.trim() === "")) {
        editorContext.setErrors([])
        return undefined;
      }

      analyzer.analyzeInput(value)
      analyzer.checkTypes()

      const proofTree = analyzer.generateProofTree()

      if (proofTree) {
        editorContext.setTree(proofTree);
      }
      editorContext.setErrors([]);

      analyzer.clearContext()

    } catch (error: any) {

      editorContext.setErrors([error]);
      console.warn(error)
      return [error]; // return list if errors

    }

    return undefined; // return undefined if there were no errors
  }

  return {buildTree};
}