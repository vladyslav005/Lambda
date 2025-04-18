import "./Header.css"

// @ts-ignore
import logo from "../../assets/logo.png"
import {PasteExampleMenu} from "../../features/editor/component/pasteexample/PasteExampleMenu";
import React, {useContext, useState} from "react";
import {TutorialsDropdown} from "../../features/tutorial/component/tutorialsdropdown/TutorialsDropdown";
import translations from "../../features/configurations/data/translations";
import {ConfigurationContext} from "../../features/configurations/context/ConfigurationContext";
import {IconButton} from "../components/button/IconButton";
import {ConfigButton} from "../../features/configurations/component/configbutton/ConfigButton";
import {MdClose, MdFeedback, MdMenu} from "react-icons/md";
import {LangSelect} from "../../features/configurations/component/langselect/LangSelect";
import {SwitchTheme} from "../../features/configurations/component/switchtheme/SwitchTheme";

export const Header = () => {
  const confCtx = useContext(ConfigurationContext)

  const [menuOpen, setMenuOpen] = useState(false);

  return (
      <div className={"header-bx flex flex-row justify-between items-center gap-0 xl:gap-2 " + (menuOpen ? "flex-wrap" : "")}>
         <div className="flex items-center grow justify-between flex-nowrap">
          <div className="flex flex-row items-center gap-0 sm:gap-2">

            <img src={logo} alt={"Logo"} className="logo"/>
            <h1 className="name text-s sm:text-xl md:text-2xl">Type Checker</h1>
            <IconButton className="mx-3 feedback-btn"
                onClick={() => {
                    window.open("https://docs.google.com/forms/d/e/1FAIpQLScZPEpHaDug8IzCJHdx6IYVfqtrKoTTHb6ZCk1lInks7poLHw/viewform?usp=dialog", "_blank")
                }}
            >

              <p className={"hidden sm:block"}>
                {translations[confCtx.language].feedback}
              </p>
              <MdFeedback size={24}/>
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
                          color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"/>}
            </IconButton>
          </div>
         </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-row items-center gap-1 xl:gap-8 mx-8">
          <div className="flex items-center gap-2">
            <PasteExampleMenu/>
            <TutorialsDropdown/>
          </div>

          <div className="flex items-center gap-2">
            <LangSelect/>
            <SwitchTheme/>
            <ConfigButton/>
          </div>

        </div>


        {/* Mobile Menu (Dropdown) */}
        {menuOpen && (
            <div className="flex lg:hidden flex-row items-center m-3 gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <PasteExampleMenu/>
                <TutorialsDropdown/>
              </div>

              <div className="flex items-center gap-2">
                <LangSelect/>
                <SwitchTheme/>
                <ConfigButton/>
              </div>

            </div>
        )}
      </div>
  );
};