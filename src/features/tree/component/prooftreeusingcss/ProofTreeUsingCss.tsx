import {ProofNode} from "../../../../core/tree/TreeGenerator";
import "./ProofTreeUsingCss.css"
import {ConclusionCenter} from "./ConclusionCenter";
import {Ref, useState} from "react";

interface ProofTreeUsingCssProps {
  node: ProofNode,
  color?: string,
  showAliases: boolean
  treeRef? : Ref<HTMLDivElement>;
}

export function ProofTreeComponentUsingCss(
    {node, color, showAliases, treeRef}: ProofTreeUsingCssProps,) {
  const isItRoot = node.root ? "root" : "not-root";
  const isItLeaf = node.premises === undefined ? 'leaf-node' : 'not-leaf-node';

  const [isExpanded, setIsExpanded] = useState(false)

  return (
      <div ref={isItRoot && treeRef ? treeRef : undefined} className="proof-node" style={{color: color ? color : "black"}}>

        {node.premises && !isExpanded && (
            <div className={`premises`}
                 style={{borderColor: color ? color : "black"}}
            >
              {node.premises.map((premise, index) => (
                  <>
                    <ProofTreeComponentUsingCss showAliases={showAliases} color={color} node={premise}/>
                    {node.premises !== undefined && index !== node.premises.length - 1 && (
                        <div className="inter-proof"></div>
                    )}
                  </>
              ))}
            </div>
        )}

        {node.expandedPremises && isExpanded && (
            <div className={`premises`}
                 style={{borderColor: color ? color : "black"}}
            >
              {node.expandedPremises.map((premise, index) => (
                  <>
                    <ProofTreeComponentUsingCss showAliases={showAliases} color={color} node={premise}/>
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
              showAliases={showAliases}
              color={color}
          ></ConclusionCenter>

          <div className="conclusion-right">
            <p className="rule-name">{node.rule.replaceAll('-', ' – ')}</p>

          </div>
        </div>
      </div>
  );
}
