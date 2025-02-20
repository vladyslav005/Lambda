import {createContext, useState} from "react";

export enum Language {
  EN = "en",
  SK = "sk"
}

export interface ConfigurationContextInterface {
  language: Language;
  interactive: boolean;

  setLanguage: (language: Language) => void;
  setInteractive: (interactive: boolean) => void;
}

export const ConfigurationContext = createContext<ConfigurationContextInterface>({
  language: Language.SK,
  interactive: true,

  setInteractive: interactive => {
  },
  setLanguage: (language: Language) => {
  },
})

interface ConfigurationContextProps {
  children?: React.ReactNode;
}

export const ConfigurationContextProvider = ({children}: ConfigurationContextProps) => {

  const [language, setLanguage] = useState(Language.EN);
  const [interactive, setInteractive] = useState(true);

  const initialValue: ConfigurationContextInterface = {
    language: language,
    interactive: interactive,

    setInteractive: setInteractive,
    setLanguage: setLanguage,
  }

  return (
      <ConfigurationContext.Provider value={initialValue}>
        {children}
      </ConfigurationContext.Provider>
  )

}
