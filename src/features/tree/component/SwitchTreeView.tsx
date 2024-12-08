import React from "react";
import {TreeView} from "./TreeFlat";

interface SwitchTreeViewProps {
  setTreeView: (newView: TreeView) => void;
  treeView: TreeView;
}


export function SwitchTreeView(props: SwitchTreeViewProps) {

  return (
      <div className="switch-tree-container"
           style={{}}
      >

        <button className="switch-tree-button"
                onClick={() => props.setTreeView(TreeView.INTERACTIVE)}
                style={{
                  backgroundColor: props.treeView === TreeView.INTERACTIVE ? '#ccc' : 'transparent',
                }}
        >
          Interactive tree
        </button>

        <button className="switch-tree-button"
                onClick={() => props.setTreeView(TreeView.LATEX)}
                style={{
                  backgroundColor: props.treeView === TreeView.LATEX ? '#ccc' : 'transparent',
                }}
        >
          Tree using latex
        </button>
      </div>
  )


}