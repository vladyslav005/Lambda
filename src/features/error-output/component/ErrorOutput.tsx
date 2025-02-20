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

        {(!editorContext.errors || (editorContext.errors?.length === 0)) &&
            <ErrorMessage
                error={{
                  type: ErrorType.INFO,
                  color: "#226303",
                  background: "#e6f9dc",
                  message: translations[confContext.language].error.info
                }}/>
        }


        {editorContext.errors &&
            editorContext.errors.map((error: Error, index) => (
                <ErrorMessage
                    key={index}
                    error={{
                      type: ErrorType.ERROR,
                      color: "#852221",
                      background: "#F9DEDC",
                      message: error.message
                    }}
                />
            ))
        }

      </div>
  )

}