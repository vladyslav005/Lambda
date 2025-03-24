import React, {useContext} from "react";
import {ConfigurationContext, Theme} from "../../context/ConfigurationContext";
import {IconButton} from "../../../../common/components/button/IconButton";
import {IoIosMoon, IoIosSunny} from "react-icons/io";
import './SwitchTheme.css'

export const SwitchTheme = () => {
  const confCtx = useContext(ConfigurationContext)

  const clickHandler = () => {
    if (confCtx.theme === Theme.Light) {
      confCtx.setTheme(Theme.Dark);
    } else {
      confCtx.setTheme(Theme.Light);
    }
  }

  return (
      <div>
        <IconButton
            className="toggle-theme-button"
            onClick={clickHandler}
        >
          {confCtx.theme === Theme.Dark && <IoIosSunny
              color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"
              size={26}/>}
          {confCtx.theme === Theme.Light && <IoIosMoon
              color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"
              size={26}/>}

        </IconButton>
      </div>
  )
}
