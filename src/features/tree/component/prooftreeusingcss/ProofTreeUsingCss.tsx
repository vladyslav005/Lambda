import {ProofNode} from "../../../../core/tree/TreeGenerator";
import "./ProofTreeUsingCss.css"
import {ConclusionCenter} from "./ConclusionCenter";


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

          <ConclusionCenter isItLeaf={isItLeaf} isItRoot={isItRoot} node={node}></ConclusionCenter>

          <div className="conclusion-right">
            <p className="rule-name">{node.rule.replaceAll('-', ' – ')}</p>

          </div>
        </div>
      </div>
  );
}
