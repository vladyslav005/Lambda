import {ProofNode} from "../../../../core/tree/TreeGenerator";
import {ProofTreeComponent} from "./ProofTreeComponent";

export function ProofTree({ root }: { root : ProofNode }) {
    return (
        <div className="proof-tree content-around">
           <ProofTreeComponent node={root} />
        </div>
    );
}