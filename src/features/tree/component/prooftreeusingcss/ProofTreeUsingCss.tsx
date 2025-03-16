import {ProofNode} from "../../../../core/tree/TreeGenerator";
import "./ProofTreeUsingCss.css"
import {ConclusionCenter} from "./ConclusionCenter";
import React, {Ref, useState} from "react";

interface ProofTreeUsingCssProps {
  node: ProofNode,
  color?: string,
  showAliases: boolean
  treeRef?: Ref<HTMLDivElement>;
  treeHasChanged: boolean;
  setTreeHasChanged: (state: boolean) => void;
  canMutateTree?: boolean;
  isExpandedPremise?: boolean;
  parentIsExpanded?: boolean;
  parentSetIsExpanded?: (expanded: boolean) => void;
  showGammaDefinition: boolean;
  stepNumber?: number;
  stepByStepModeEnabled: boolean;
}

export function ProofTreeComponentUsingCss(
    {
      parentSetIsExpanded,
      parentIsExpanded,
      isExpandedPremise,
      node,
      color,
      showAliases,
      treeRef,
      treeHasChanged,
      setTreeHasChanged,
      canMutateTree,
      showGammaDefinition,
      stepNumber,
      stepByStepModeEnabled,
    }: ProofTreeUsingCssProps,) {
  const isItRoot = node.root ? "root" : "not-root";
  const isItLeaf = node.premises === undefined ? 'leaf-node' : 'not-leaf-node';

  const [isExpanded, setIsExpanded_] = useState(false)

  const setIsExpanded = (value: boolean) => {
    if (node.expandedPremises !== undefined) {
      setIsExpanded_(value);
      if (canMutateTree)
        node.isExpanded = value;
    }
  }


  return (
      <>
        {(!stepByStepModeEnabled || !stepNumber || ((node.nodeNumber ?? 0) < stepNumber)) &&
            <div ref={isItRoot && treeRef ? treeRef : undefined} className="proof-node"
                 style={{color: color ? color : "black"}}>
              {node.premises && !isExpanded && (
                  <div className={`premises`}
                       style={{borderColor: color ? color : "black"}}
                  >
                    {node.premises.map((premise, index) => (
                        <React.Fragment key={index}>
                          <ProofTreeComponentUsingCss
                              stepByStepModeEnabled={stepByStepModeEnabled}
                              stepNumber={stepNumber}
                              showGammaDefinition={showGammaDefinition}
                              key={`${premise.rule}-${premise.tokenLocation.join("-")}-${index}`}
                              canMutateTree={canMutateTree}
                              setTreeHasChanged={setTreeHasChanged} treeHasChanged={treeHasChanged}
                              showAliases={showAliases} color={color} node={premise}/>
                          {node.premises !== undefined && index !== node.premises.length - 1 && (
                              <div className="inter-proof"></div>
                          )}
                        </React.Fragment>
                    ))}
                  </div>
              )}

              {node.expandedPremises && isExpanded && (
                  <div className={`premises`}
                       style={{
                         borderColor: color ? color : "black",
                         borderBottom: "none"
                       }}
                  >
                    {node.expandedPremises.map((premise, index) => (
                        <React.Fragment key={index}>
                          <ProofTreeComponentUsingCss
                              stepByStepModeEnabled={stepByStepModeEnabled}
                              stepNumber={stepNumber}
                              showGammaDefinition={showGammaDefinition}
                              key={index}
                              isExpandedPremise={true}
                              parentIsExpanded={isExpanded}
                              parentSetIsExpanded={setIsExpanded}
                              canMutateTree={canMutateTree}
                              treeHasChanged={treeHasChanged} setTreeHasChanged={setTreeHasChanged}
                              showAliases={showAliases} color={color} node={premise}/>
                          {node.expandedPremises !== undefined && index !== node.expandedPremises.length - 1 && (
                              <div className="inter-proof"></div>
                          )}
                        </React.Fragment>
                    ))}
                  </div>
              )}

              {!isExpanded && <div className={`conclusion ${isItRoot} ${isItLeaf}`}>
                  <div className="conclusion-left">
                  </div>

                  <ConclusionCenter
                      showGammaDefinition={showGammaDefinition}
                      isExpandedPremise={isExpandedPremise ?? false}
                      parentIsExpanded={parentIsExpanded}
                      parentSetIsExpanded={parentSetIsExpanded}
                      isExpanded={isExpanded}
                      setIsExpanded={setIsExpanded}
                      isItLeaf={isItLeaf}
                      isItRoot={isItRoot}
                      node={node}
                      showAliases={showAliases}
                      color={color}
                      treeHasChanged={treeHasChanged}
                      setTreeHasChanged={setTreeHasChanged}
                  ></ConclusionCenter>

                  <div className="conclusion-right">
                      <p className="rule-name">{node.rule.replaceAll('-', ' – ')}</p>

                  </div>
              </div>}
            </div>}
      </>
  );
}
