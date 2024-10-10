import {ProofNode} from "../../../../core/tree/TreeGenerator";
import {ProofTreeComponent} from "./ProofTreeComponent";

export function ProofTree({ root }: { root : ProofNode }) {
    return <ProofTreeComponent node={root} />;
}