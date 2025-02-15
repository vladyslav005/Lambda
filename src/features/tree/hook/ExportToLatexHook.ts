import {ProofNode} from "../../../core/tree/TreeGenerator";
import {preprocessString} from "../../../core/utils";

export function useExportToLatex() {

  function exportToLatex(tree: ProofNode, showAliases: boolean): string {
    let latex = '\\begin{prooftree} \n';

    const traverseTree = (node: ProofNode, level: number = 0): string => {
      let nodeLatex = '';

      const premisesCount = node.premises ? node.premises.length : 0;
      const nodeConclusion = showAliases ? node.wrappedConclusionWithAlias : node.wrappedConclusion;

      if (node.premises) {
        for (let premise of node.premises)
          nodeLatex += traverseTree(premise, level + 1);
        nodeLatex += `\t\\infer${premisesCount}[${node.rule}]{${nodeConclusion} }\n`;
      } else
        nodeLatex += `\t\\hypo{${nodeConclusion}}\n`;

      return nodeLatex;
    };

    latex += traverseTree(tree);

    latex += '\\end{prooftree}\n';

    return preprocessString(latex);
  }

  //todo : aliases show
  const exportToBussproofs = (tree: ProofNode, showAliases: boolean): string => {
    let latex = '\\begin{prooftree} \n';

    const traverseTree = (node: ProofNode, level: number = 0): void => {
      const premisesCount = node.premises ? node.premises.length : 0;
      const nodeConclusion = showAliases ? node.wrappedConclusionWithAlias : node.wrappedConclusion;

      if (node.premises) {

        for (const premise of node.premises) {
          traverseTree(premise);
        }

        latex += '\t\\RightLabel{$' + node.rule + '$}\n';
        switch (premisesCount) {
          case 1:
            latex += '\t\\UnaryInfC{$' + nodeConclusion + '$}\n';
            break;
          case 2:
            latex += '\t\\BinaryInfC{$' + nodeConclusion + '$}\n';
            break;
          case 3:
            latex += '\t\\TrinaryInfC{$' + nodeConclusion + '$}\n';
            break;
          case 4:
            latex += '\t\\QuaternaryInfC{$' + nodeConclusion + '$}\n';
            break;
          case 5:
            latex += '\t\\QuinaryInfC{$' + nodeConclusion + '$}\n';
            break;
        }

      } else {
        latex += '\t\\AxiomC{$' + nodeConclusion + '$}\n';
      }
    }

    traverseTree(tree);

    latex += '\\end{prooftree}\n';

    return preprocessString(latex);
  }

  const isTreeExportableToBussproofs = (tree: ProofNode): boolean => {
    let isExportable = true;

    const traverseTree = (node: ProofNode): void => {
      if (node.premises) {
        if (node.premises.length > 5)
          isExportable = false;

        for (let premise of node.premises)
          traverseTree(premise);
      }
    }

    traverseTree(tree);

    return isExportable;
  }

  return {
    exportToLatex,
    isTreeExportableToBussproofs,
    exportToBussproofs
  };

}
