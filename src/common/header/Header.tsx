import "./Header.css"

// @ts-ignore
import logo from "../../assets/logo.png"
import {PasteExampleMenu} from "../../features/lambda-input/component/pasteexample/PasteExampleMenu";
import React, {useContext, useState} from "react";
import {TutorialsDropdown} from "../../features/helpbar/component/tutorialsdropdown/TutorialsDropdown";
import translations from "../../features/configurations/data/translations";
import {ConfigurationContext, Language} from "../../features/configurations/context/ConfigurationContext";
import {IconButton} from "../components/button/IconButton";
import {ConfigButton} from "../../features/configurations/component/configbutton/ConfigButton";
import {MdClose, MdFeedback, MdMenu} from "react-icons/md";
import {LangSelect} from "../../features/configurations/component/langselect/LangSelect";
import {SwitchTheme} from "../../features/configurations/component/switchtheme/SwitchTheme";

export const Header = () => {
  const confCtx = useContext(ConfigurationContext)

  const [menuOpen, setMenuOpen] = useState(false);

  return (
      <div className="header-bx flex flex-row justify-between items-center gap-2 flex-wrap">
        <div className="flex flex-row items-center gap-2">
          <img src={logo} alt={"Logo"} className="logo"/>
          <h1 className="name">Type Checker</h1>
        </div>


        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-row items-center gap-1 xl:gap-8 mx-8">
          <div className="flex items-center gap-2">
            <PasteExampleMenu />
            <TutorialsDropdown />
          </div>

          <div className="flex items-center gap-2">
            <LangSelect/>
            <SwitchTheme/>
            <ConfigButton />
          </div>

          <IconButton className="feedback-btn" onClick={() => window.open("http://google.com", "_blank")}>
            {translations[confCtx.language].feedback}
            <MdFeedback size={24}  />
          </IconButton>
        </div>

        {/* Mobile Burger Button */}
        <div className="block lg:hidden mx-8">
          <IconButton
              className=""
              onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ?
                <MdClose size={28}
                   color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"/> :
                <MdMenu size={28}
                   color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))" />}
          </IconButton>
        </div>
        {/* Mobile Menu (Dropdown) */}
        {menuOpen && (
            <div className="flex lg:hidden flex-row items-center m-3 gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <PasteExampleMenu />
                <TutorialsDropdown />
              </div>

              <div className="flex items-center gap-2">
                <LangSelect/>
                <SwitchTheme/>
                <ConfigButton />
              </div>

              <IconButton className="feedback-btn" onClick={() => window.open("http://google.com", "_blank")}>
                {translations[confCtx.language].feedback}
                <MdFeedback size={24} />
              </IconButton>
            </div>
        )}
      </div>
  );
};