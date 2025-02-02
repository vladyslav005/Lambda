import {ProofNode} from "../../../core/tree/TreeGenerator";
import {preprocessString} from "../../../core/utils";

export function useExportToLatex() {

  function exportToLatex(tree: ProofNode): string {
    let latex = '\\begin{prooftree} \n';

    const traverseTree = (node: ProofNode, level: number = 0): string => {
      let nodeLatex = '';

      const premisesCount = node.premises ? node.premises.length : 0;

      if (node.premises ) {
        for (let premise of node.premises)
          nodeLatex += traverseTree(premise, level + 1);
        nodeLatex += `  \\infer${premisesCount}[${node.rule}]{${node.conclusion} }\n`;
      } else
        nodeLatex += `  \\hypo{${node.conclusion}}\n`;

      return nodeLatex;
    };

    latex += traverseTree(tree);

    latex += '\\end{prooftree}\n';

    return preprocessString(latex);
  }

  const exportToBussproofs = (tree: ProofNode): string  => {
    let latex = '\\begin{prooftree} \n';

    const traverseTree = (node: ProofNode, level: number = 0): void => {
      const premisesCount = node.premises ? node.premises.length : 0;

      if (node.premises) {

        for (const premise of node.premises) {
          traverseTree(premise);
        }

        latex += '  \\RightLabel{$' + node.rule + '$}\n';
        switch (premisesCount) {
          case 1:
            latex += '  \\UnaryInfC{$' + node.conclusion + '$}\n';
            break;
          case 2:
            latex += '  \\BinaryInfC{$' + node.conclusion + '$}\n';
            break;
          case 3:
            latex += '  \\TrinaryInfC{$' + node.conclusion + '$}\n';
            break;
          case 4:
            latex += '  \\QuaternaryInfC{$' + node.conclusion + '$}\n';
            break;
          case 5:
            latex += '  \\QuinaryInfC{$' + node.conclusion + '$}\n';
            break;
        }

      } else {
        latex += '  \\AxiomC{$' + node.conclusion + '$}\n';
      }
    }

    traverseTree(tree);

    latex += '\\end{prooftree}\n';

    return preprocessString(latex);
  }

  const isTreeExportableToBussproofs = (tree: ProofNode): boolean => {
    let isExportable = true;

    const traverseTree = (node: ProofNode): void  => {
      if (node.premises ) {
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
    exportToBussproofs};

}
