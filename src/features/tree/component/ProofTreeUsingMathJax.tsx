import React from 'react';
import {ProofNode} from "../../../core/tree/TreeGenerator";
import Tex2SVG from "react-hook-mathjax";

export function ProofTreeUsingMathJax({proofTree}: { proofTree: ProofNode }) {
  const proofTreeLatex = `
\\begin{prooftree}
  ${generateProofTreeLatexBussproof(proofTree, undefined)}
  
\\end{prooftree}
  `;

  return (
      <Tex2SVG latex={proofTreeLatex}/>
  );
}

export function generateProofTreeLatexBussproof(node: ProofNode, parent: ProofNode | undefined) {
  // let latex = '';
  // node.conclusion = node.conclusion.replaceAll("->", " \\rightarrow ");
  // if (node.premises && node.premises.length > 1) {
  //
  //   for (const premise of node.premises) {
  //     latex += generateProofTreeLatexBussproof(premise, node);
  //   }
  //
  //   latex += '\n\\RightLabel{$' + node.rule + '$}';
  //   latex += '\n\\BinaryInfC{$' + node.conclusion + '$}';
  //
  // } else if (node.premises && node.premises.length === 1) {
  //   latex += generateProofTreeLatexBussproof(node.premises[0], node);
  //   latex += '\n\\RightLabel{$' + node.rule + '$}';
  //   latex += '\n\\UnaryInfC{$' + node.conclusion + '$}';
  //
  // } else {
  //   latex += '\n\\AxiomC{$' + node.conclusion.replaceAll("->", "\\rightarrow") + '$}';
  // }
  //
  // return latex;
}