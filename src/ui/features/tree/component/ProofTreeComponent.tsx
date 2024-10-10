import {ProofNode} from "../../../../core/tree/TreeGenerator";
import {MathComponent} from "mathjax-react";


export function ProofTreeComponent({ node }: { node: ProofNode }) {
    return (
        <div className="proof-node">
            {/* Recursively render premises horizontally */}
            {node.premises && (
                <div className="premises">
                    {node.premises.map((premise, index) => (
                        <div key={index} className="premise">

                            <ProofTreeComponent node={premise}/>
                            <div className="line"></div>
                        </div>

                    ))}
                </div>
            )}
            {/* Render conclusion and rule */}
            <div className="conclusion">
                <div className="line"></div>
                {/*<span className="rule-name">{node.rule}</span>*/}

                <div className="conclusion-text">
                    <MathComponent tex={node.conclusion}/>
                </div>

            </div>
        </div>
    );
}