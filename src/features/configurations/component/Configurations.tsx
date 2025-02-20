import React, {useContext} from "react";
import "./style.css"
import {IconButton} from "../../../common/components/button/IconButton";
import {Switch} from "react-aria-components";
import {ConfigurationContext, Language} from "../context/ConfigurationContext";
import translations from "../data/translations";

export const Configurations = () => {
  const configurationContext = useContext(ConfigurationContext);

  return (
      <div className="configurations ui-block">
        <Switch
            defaultSelected={configurationContext.interactive}
            onChange={(isChecked) => {
              configurationContext.setInteractive(isChecked)
            }}
        >
          <div className="indicator"/>
          {translations[configurationContext.language].conf.interactiveMode}
        </Switch>

        <div>
          <IconButton
              className={`lang-btn sk ${configurationContext.language === Language.SK ? "lang-btn-selected" : ""}`}
              onClick={() => {
                configurationContext.setLanguage(Language.SK)
              }}
          >
            SK
          </IconButton>
          <IconButton
              className={`lang-btn en ${configurationContext.language === Language.EN ? "lang-btn-selected" : ""}`}
              onClick={() => {
                configurationContext.setLanguage(Language.EN)
              }}
          >
            EN
          </IconButton>
        </div>
      </div>
  )
}