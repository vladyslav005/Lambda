import './LangSelect.css'
import {IconButton} from "../../../../common/components/button/IconButton";
import {ConfigurationContext, Language} from "../../context/ConfigurationContext";
import React, {useContext} from "react";


export const LangSelect = () => {
  const confCtx = useContext(ConfigurationContext)


  return (
      <div>
        <IconButton
            className={`lang-btn sk ${confCtx.language === Language.SK ? "lang-btn-selected" : ""}`}
            onClick={() => confCtx.setLanguage(Language.SK)}
        >
          SK
        </IconButton>
        <IconButton
            className={`lang-btn ua ${confCtx.language === Language.UA ? "lang-btn-selected" : ""}`}
            onClick={() => confCtx.setLanguage(Language.UA)}
        >
          UA
        </IconButton>
        <IconButton
            className={`lang-btn en ${confCtx.language === Language.EN ? "lang-btn-selected" : ""}`}
            onClick={() => confCtx.setLanguage(Language.EN)}
        >
          EN
        </IconButton>
      </div>
  )
}