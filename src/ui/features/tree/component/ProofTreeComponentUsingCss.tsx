import {ProofNode} from "../../../../core/tree/TreeGenerator";
import {MathComponent} from "mathjax-react";


export function ProofTreeComponentUsingCss({node}: { node: ProofNode }) {
  const isItRoot = node.root ? "root" : "not-root";
  const isItLeaf = node.premises === undefined ? 'leaf-node' : 'not-leaf-node';

  return (
      <div className="proof-node">

        {/* Recursively render premises horizontally */}

        {node.premises && (
            <div className={`premises`}>
              {node.premises.map((premise, index) => (
                  <>
                    <ProofTreeComponentUsingCss node={premise}/>
                    {node.premises !== undefined && index !== node.premises.length - 1 && (
                        <div className="inter-proof"></div>
                    )}
                  </>
              ))}
            </div>
        )}

        {/* Render conclusion and rule */}
        <div className={`conclusion ${isItRoot} ${isItLeaf}`}>
          <div className="conclusion-left">
          </div>
          <div className={`conclusion-center ${isItLeaf} ${isItRoot}`}>
            <MathComponent tex={node.conclusion.replaceAll("->", " \\rightarrow ")}/>
          </div>
          <div className="conclusion-right">
            <p className="rule-name">{node.rule}</p>

          </div>
        </div>
      </div>
  );
}