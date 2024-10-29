import React from 'react';
import {ProofNode} from "../../../../core/tree/TreeGenerator";
import Tex2SVG from "react-hook-mathjax";

export function ProofTreeUsingMathJax({proofTree}: { proofTree: ProofNode }) {
  const proofTreeLatex = `
\\begin{prooftree}
  ${generateProofTreeLatex(proofTree, undefined)}
  
\\end{prooftree}
  `;

  // console.log(proofTreeLatex);
  // console.log(JSON.stringify(proofTree, undefined, 4))

  return (
      <Tex2SVG latex={proofTreeLatex}/>
  );
}

function generateProofTreeLatex(node: ProofNode, parent: ProofNode | undefined): string {
  let latex = '';
  node.conclusion = node.conclusion.replaceAll("->", " \\rightarrow ");
  if (node.premises && node.premises.length > 1) {

    for (const premise of node.premises) {
      latex += generateProofTreeLatex(premise, node);
    }

    latex += '\n\\RightLabel{$' + node.rule + '$}';
    latex += '\n\\BinaryInfC{$' + node.conclusion + '$}';

  } else if (node.premises && node.premises.length === 1) {
    latex += generateProofTreeLatex(node.premises[0], node);
    latex += '\n\\RightLabel{$' + node.rule + '$}';
    latex += '\n\\UnaryInfC{$' + node.conclusion + '$}';

  } else {
    latex += '\n\\AxiomC{$' + node.conclusion.replaceAll("->", "\\rightarrow") + '$}';
  }

  return latex;
}