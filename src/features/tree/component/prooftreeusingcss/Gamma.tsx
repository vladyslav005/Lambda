import {ProofNode} from "../../../../core/tree/TreeGenerator";
import {MathComponent} from "mathjax-react";
import {preprocessString} from "../../../../core/utils";
import {MouseEventHandler, useEffect, useState} from "react";


interface GammaProps {
  node: ProofNode;
  showAliases: boolean;
  treeHasChanged: boolean;
  setTreeHasChanged: (state: boolean) => void;
  showGammaDefinition: boolean;
  handleMouseLeave: () => void;
  canMutateTree?: boolean;
}

export const Gamma = (props: GammaProps) => {

  const [gammaUnwrapped, setGammaUnwrapped] = useState(false);

  useEffect(() => {
    if (props.node.isGammaUnwrapped && props.node.isGammaUnwrapped !== props.showGammaDefinition) {
      setGammaUnwrapped(props.node.isGammaUnwrapped);
    } else
      setGammaUnwrapped(props.showGammaDefinition)
  }, [props.showGammaDefinition])


  const prepareGamma = (): string => {
    let gamma = ""
    const ctxEx = props.node.ctxExtension;
    if (gammaUnwrapped) {
      gamma = !props.showAliases
          ? "\\{ " + ctxEx.unwrapped + " \\}"
          : "\\{ " + ctxEx.unwrappedWithAlias + " \\}"
    } else {
      if (ctxEx.isTaken) {
        gamma = ctxEx.declaration
      } else {
        gamma = !props.showAliases
            ? ctxEx.wrapped
            : ctxEx.wrappedWithAlias
      }
    }

    return gamma;
  }

  const clickHandler = (e: any) => {
    e.stopPropagation();
    props.setTreeHasChanged(!props.treeHasChanged);
    if (props.canMutateTree) {
      props.node.isGammaUnwrapped = !gammaUnwrapped;
    }
    setGammaUnwrapped(!gammaUnwrapped);
    props.handleMouseLeave();

  }
  return (
      <>
        {prepareGamma() !== "" && <div className="gamma"
                                       title={gammaUnwrapped ? "Wrap Gamma" : "Unwrap Gamma"}
                                       onClick={clickHandler}
                                       onTouchStart={clickHandler}
        >
            <MathComponent tex={preprocessString(prepareGamma())}/>
        </div>}
      </>
  )
}