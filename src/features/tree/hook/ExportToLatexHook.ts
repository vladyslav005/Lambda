import {CtxStackElement, ProofNode} from "../../../core/tree/TreeGenerator";
import {preprocessString, preprocessTex} from "../../../core/utils";

export function useExportToLatex(currentStep: number, stepByStepModeEnabled: boolean) {

  const prepareGamma = (node: ProofNode, showAliases: boolean): string => {
    let gamma = ""

    const ctxEx = node.ctxExtension
    if (node.isGammaUnwrapped) {
      gamma = !showAliases
          ? "\\{ " + ctxEx.unwrapped + " \\}"
          : "\\{ " + ctxEx.unwrappedWithAlias + " \\}"
    } else {
      if (ctxEx.isTaken) {
        gamma = ctxEx.declaration
      } else {
        gamma = !showAliases
            ? ctxEx.wrapped
            : ctxEx.wrappedWithAlias
      }
    }

    return gamma;
  }

  function exportToLatex(tree: ProofNode, showAliases: boolean): string {
    let latex = '\\begin{prooftree}\n';

    const traverseTree = (node: ProofNode): string => {
      let nodeLatex = '';

      const premises: ProofNode[] | undefined =
          node.isExpanded && node.expandedPremises ? node.expandedPremises : node.premises;

      const premisesCount = premises ? premises.length : 0;
      let nodeConclusion = showAliases ? node.wrappedConclusionWithAlias : node.wrappedConclusion;
      nodeConclusion = nodeConclusion.replaceAll(/\$/g, prepareGamma(node, showAliases));

      if (premises) {
        let i = 0;
        for (; i < premisesCount; i++) {
          if (!stepByStepModeEnabled || !currentStep || ((premises[i].nodeNumber ?? 0) < currentStep))
            nodeLatex += traverseTree(premises[i]);
          else {
            break;
          }
        }
        nodeLatex += `\t\\infer${i}[${node.rule}]{${nodeConclusion} }\n`;
      } else
        nodeLatex += `\t\\hypo{${nodeConclusion}}\n`;

      return nodeLatex;
    };

    latex += traverseTree(tree);

    latex += '\\end{prooftree}\n';

    return preprocessTex(preprocessString(latex));
  }

  const exportToBussproofs = (tree: ProofNode, showAliases: boolean): string => {
    let latex = '\\begin{prooftree}\n';

    const traverseTree = (node: ProofNode, level: number = 0): void => {
      const premises: ProofNode[] | undefined =
          node.isExpanded && node.expandedPremises ? node.expandedPremises : node.premises;

      const premisesCount = premises ? premises.length : 0;
      let nodeConclusion = showAliases ? node.wrappedConclusionWithAlias : node.wrappedConclusion;
      nodeConclusion = nodeConclusion.replaceAll(/\$/g, prepareGamma(node, showAliases));

      if (premises) {
        let i = 0;
        for (; i < premisesCount; i++) {
          if (!stepByStepModeEnabled || !currentStep || ((premises[i].nodeNumber ?? 0) < currentStep))
            traverseTree(premises[i]);
          else {
            break;
          }
        }

        latex += '\t\\RightLabel{$' + node.rule + '$}\n';
        switch (i) {
          case 0:
            latex += '\t\\AxiomC{}\n';
            latex += '\t\\UnaryInfC{$' + nodeConclusion + '$}\n';
            break;
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

    return preprocessTex(preprocessString(latex));
  }

  const isTreeExportableToBussproofs = (tree: ProofNode): boolean => {
    let isExportable = true;

    const traverseTree = (node: ProofNode): void => {
      const premises: ProofNode[] | undefined =
          node.isExpanded && node.expandedPremises ? node.expandedPremises : node.premises;

      if (premises) {
        if (premises.length > 5)
          isExportable = false;

        for (let premise of premises) {
          traverseTree(premise);
        }
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
