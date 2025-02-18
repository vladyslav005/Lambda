import {Button, Menu, MenuItem, MenuTrigger, Popover} from 'react-aria-components';
import "./style.css"
import {IoMdArrowDropdown} from "react-icons/io";
import {MyRipples} from "../../../../common/components/button/IconButton";
import {useContext} from "react";
import {EditorContext} from "../../context/EditorContext";
import {useBuildTree} from "../../hook/BuildTreeHook";
import {useEditorErrorsHook} from "../../hook/EditorErrorsHook";
import examples from "../../data/examples";

interface PasteExampleMenuProps {
  style?: React.CSSProperties;
}

export const PasteExampleMenu = (props: PasteExampleMenuProps) => {

  const editorContext = useContext(EditorContext);
  const {buildTree} = useBuildTree();
  const {setEditorErrors} = useEditorErrorsHook()


  return (
      <MenuTrigger>
        <Button className="menu-button flex gap-2" aria-label="Menu" style={props.style}>
          <MyRipples during={500} color={'rgba(251,246,246,0.63)'}
                     className={["my-button"].join(" ")}

          >
            Paste example
            <IoMdArrowDropdown size={18}/>
          </MyRipples>
        </Button>
        <Popover>
          <Menu className="menu-bx">

            {examples.map((example, index) => (
                <MenuItem className='menu-item' onAction={async () => {
                  editorContext.setEditorValue(example.code);
                  const errors: Error[] | undefined = await buildTree(example.code)
                  setEditorErrors(errors)
                }}
                          key={example.name}>{example.name}</MenuItem>
            ))}
          </Menu>
        </Popover>
      </MenuTrigger>
  )

}

