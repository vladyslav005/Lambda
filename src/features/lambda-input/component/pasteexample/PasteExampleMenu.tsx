import {Button, Menu, MenuItem, MenuTrigger, Popover} from 'react-aria-components';
import "./style.css"
import {IoMdArrowDropdown} from "react-icons/io";
import {MyRipples} from "../../../../common/components/button/IconButton";
import {useContext} from "react";
import {EditorContext} from "../../context/EditorContext";
import {useBuildTree} from "../../hook/BuildTreeHook";
import {useEditorErrorsHook} from "../../hook/EditorErrorsHook";
import examples from "../../data/examples";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";

interface PasteExampleMenuProps {
  style?: React.CSSProperties;
}

export const PasteExampleMenu = (props: PasteExampleMenuProps) => {
  const editorContext = useContext(EditorContext);
  const {buildTree} = useBuildTree();
  const {setEditorErrors} = useEditorErrorsHook()
  const confContext = useContext(ConfigurationContext);

  return (
      <MenuTrigger>
        <Button className="menu-button flex gap-2" aria-label="Menu" style={props.style}>
          <MyRipples during={500} color={'rgba(251,246,246,0.63)'}
                     className={["my-button"].join(" ")}

          >
            {translations[confContext.language].editor.pasteExample}
            <IoMdArrowDropdown size={18}/>
          </MyRipples>
        </Button>
        <Popover>
          <Menu className="menu-bx">

            {examples.map((example, index) => (
                <MenuItem className='menu-item'
                          onAction={async () => {
                            editorContext.setEditorValue(example.code);
                            if (confContext.interactive) {
                              const errors: Error[] | undefined = await buildTree(example.code)
                              setEditorErrors(errors)
                            }
                          }}
                          key={example.name}>
                  {
                    translations[confContext.language]
                        .editor
                        .pasteExampleMenu[example.name as keyof typeof translations.en.editor.pasteExampleMenu]
                  }
                </MenuItem>
            ))}
          </Menu>
        </Popover>
      </MenuTrigger>
  )

}

