import {ErrorMessage} from "./ErrorMessage.";
import {ErrorType} from "../types/error_types";
import {useContext} from "react";
import {EditorContext} from "../../lambda-input/context/EditorContext";
import './ErrorOutput.css'
import {ConfigurationContext} from "../../configurations/context/ConfigurationContext";
import translations from "../../configurations/data/translations";

export function ErrorOutput() {
  const editorContext = useContext(EditorContext)
  const confContext = useContext(ConfigurationContext);

  return (
      <div className="error-output ui-block">
        <div className="w-full flex flex-col items-center justify-center align-middle">
          {(!editorContext.errors || (editorContext.errors?.length === 0)) &&
              <ErrorMessage
                  error={{
                    type: ErrorType.INFO,
                    color: "var(--Log-On-Info-Container, #226303)",
                    background: "var(--Log-Info-Container, #e6f9dc)",
                    message: translations[confContext.language].error.info
                  }}/>
          }


          {editorContext.errors &&
              editorContext.errors.map((error: Error, index) => (
                  <ErrorMessage
                      key={index}
                      error={{
                        type: ErrorType.ERROR,
                        color: "var(--Log-On-Error-Container, #852221)",
                        background: "var(--Log-Error-Container, #F9DEDC)",
                        message: error.message
                      }}
                  />
              ))
          }
        </div>
      </div>
  )

}