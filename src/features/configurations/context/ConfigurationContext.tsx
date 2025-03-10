import {createContext, useEffect, useState} from "react";

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

  setInteractive: interactive => {
  },
  setLanguage: (language: Language) => {
  },
  setTheme: (theme: Theme) => {
  }
})

interface ConfigurationContextProps {
  children?: React.ReactNode;
}

export const ConfigurationContextProvider = ({children}: ConfigurationContextProps) => {

  const [language, setLanguage] = useState(Language.EN);
  const [interactive, setInteractive] = useState(true);
  const [theme, setTheme] = useState(Theme.Light);


  const setInteractiveHandler = (value: boolean) => {
    setInteractive(value);
    localStorage.setItem('interactive', value.toString());
  }

  const setThemeHandler = (theme: Theme) => {
    setTheme(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute("data-theme", theme);
  }

  const setLanguageHandler = (language: Language) => {
    setLanguage(language);
    localStorage.setItem('language', language.toString());
  }

  useEffect(() => {
    setThemeHandler(localStorage.getItem("theme") as Theme ?? Theme.Light);
    const interactivePersisted = localStorage.getItem("interactive") ?? 'true'
    if (interactivePersisted === 'true')
      setInteractiveHandler(true);
    else setInteractiveHandler(false);

    setLanguageHandler(localStorage.getItem("language") as Language ?? Language.EN);

  }, [])

  const initialValue: ConfigurationContextInterface = {
    language: language,
    interactive: interactive,
    theme: theme,

    setInteractive: setInteractiveHandler,
    setLanguage: setLanguageHandler,
    setTheme: setThemeHandler,
  }

  return (
      <ConfigurationContext.Provider value={initialValue}>
        {children}
      </ConfigurationContext.Provider>
  )

}
