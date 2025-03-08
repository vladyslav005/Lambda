import {Button, Dialog, DialogTrigger, Input, Popover,} from "react-aria-components";
import {IoMdArrowDropdown, IoMdSearch} from "react-icons/io";
import {useContext, useRef, useState} from "react";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";
import Topics from "../../data/infoTopics";
import './TutorialsDropdown.css'
import {MyRipples} from "../../../../common/components/button/IconButton";
import "../../data/tutorials/style.css"

interface TutorialsDropdownProps {
  style?: React.CSSProperties;
}

export const TutorialsDropdown = (props: TutorialsDropdownProps) => {
  const confContext = useContext(ConfigurationContext);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
      <DialogTrigger>
        <Button className="menu-button flex gap-2" aria-label="Menu" style={props.style}>
          <MyRipples during={500} color={'rgba(251,246,246,0.63)'}
                     className={["my-button"].join(" ")}

          >
            {translations[confContext.language].helpBar.tutorial}
            <IoMdArrowDropdown size={18}/>
          </MyRipples>
        </Button>

        <Popover className="menu-bx tutorials-popover" style={{zIndex: 999}}>
          <Dialog>
            <div className="search">
              <Input
                  ref={inputRef}
                  className="search-input"
                  type="text"
                  placeholder={translations[confContext.language].helpBar.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
              <IoMdSearch
                  style={{
                    position: "absolute",
                    right: "1rem",
                  }}
                  size={20}
              />
            </div>
            <Topics searchQuery={searchQuery}/>
          </Dialog>
        </Popover>
      </DialogTrigger>
  );
};