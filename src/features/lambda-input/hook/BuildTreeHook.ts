import {useContext} from "react";
import {EditorContext} from "../context/EditorContext";
import {ProofNode} from "../../../core/tree/TreeGenerator";


export function useBuildTree() {
  const editorContext = useContext(EditorContext);

  const buildTree = async (value: string | undefined): Promise<Error[] | undefined> => {
    const {InputAnalyzer} = await import("../../../core/AnalyzeInput");

    const analyzer = new InputAnalyzer();

    try {
      editorContext.setTree(undefined);
      editorContext.setGlobalCtx(undefined);
      editorContext.setAliasCtx(undefined);
      if (!value || (value && value.trim() === "")) {
        editorContext.setErrors([])
        return undefined;
      }

      const proofTree = analyzer.analyzeInput(value);

      if (proofTree) {
        editorContext.setNodeNumber(setNodeNumbers(proofTree));
        editorContext.setTree(proofTree);
        editorContext.setAliasesPresent(proofTree.aliasesPresent ?? false);
        editorContext.setGlobalCtx(proofTree.globalCtx ?? undefined);
        editorContext.setAliasCtx(proofTree.aliasCtx ?? undefined);
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

function setNodeNumbers(node: ProofNode): number {
  let total = 0;
  const traverseTree = (node: ProofNode): void => {

    const premises: ProofNode[] | undefined =
        node.isExpanded && node.expandedPremises ? node.expandedPremises : node.premises;

    node.nodeNumber = total++;
    if (premises) {

      for (let premise of premises)
        traverseTree(premise);
    }

  };

  traverseTree(node)

  return total;
}