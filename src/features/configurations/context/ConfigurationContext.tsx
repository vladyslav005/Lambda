import {createContext, useState} from "react";

export enum Language {
  EN = "en",
  SK = "sk",
  UA = "ua"
}

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export interface ConfigurationContextInterface {
  language: Language;
  interactive: boolean;
  theme: Theme;

  setLanguage: (language: Language) => void;
  setInteractive: (interactive: boolean) => void;
  setTheme: (theme: Theme) => void;
}

export const ConfigurationContext = createContext<ConfigurationContextInterface>({
  language: Language.SK,
  interactive: true,
  theme: Theme.Light,

  setInteractive: interactive => {},
  setLanguage: (language: Language) => {},
  setTheme: (theme: Theme) => {}
})

interface ConfigurationContextProps {
  children?: React.ReactNode;
}

export const ConfigurationContextProvider = ({children}: ConfigurationContextProps) => {

  const [language, setLanguage] = useState(Language.EN);
  const [interactive, setInteractive] = useState(true);
  const [theme, setTheme] = useState(Theme.Light);

  const setThemeHandler = (theme: Theme) => {
    setTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
  }

  const initialValue: ConfigurationContextInterface = {
    language: language,
    interactive: interactive,
    theme: theme,

    setInteractive: setInteractive,
    setLanguage: setLanguage,
    setTheme: setThemeHandler,
  }

  return (
      <ConfigurationContext.Provider value={initialValue}>
        {children}
      </ConfigurationContext.Provider>
  )

}
