import {ProofNode} from "../../../../core/tree/TreeGenerator";
import "./ProofTreeUsingCss.css"
import {ConclusionCenter} from "./ConclusionCenter";
import {useState} from "react";


export function ProofTreeComponentUsingCss({node}: { node: ProofNode }) {
  const isItRoot = node.root ? "root" : "not-root";
  const isItLeaf = node.premises === undefined ? 'leaf-node' : 'not-leaf-node';

  const [isExpanded, setIsExpanded] = useState(false)

  return (
      <div className="proof-node">

        {node.premises && !isExpanded && (
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

        {node.expandedPremises && isExpanded && (
            <div className={`premises`}>
              {node.expandedPremises.map((premise, index) => (
                  <>
                    <ProofTreeComponentUsingCss node={premise}/>
                    {node.expandedPremises !== undefined && index !== node.expandedPremises.length - 1 && (
                        <div className="inter-proof"></div>
                    )}
                  </>
              ))}
            </div>
        )}

        <div className={`conclusion ${isItRoot} ${isItLeaf}`}>
          <div className="conclusion-left">
          </div>

          <ConclusionCenter
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              isItLeaf={isItLeaf}
              isItRoot={isItRoot}
              node={node}
          ></ConclusionCenter>

          <div className="conclusion-right">
            <p className="rule-name">{node.rule.replaceAll('-', ' – ')}</p>

          </div>
        </div>
      </div>
  );
}
