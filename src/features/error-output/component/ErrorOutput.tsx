import {ErrorMessage} from "./ErrorMessage.";
import {ErrorType} from "../types/error_types";
import {useContext} from "react";
import {EditorContext} from "../../lambda-input/context/EditorContext";
import './ErrorOutput.css'

export function ErrorOutput() {
  const editorContext = useContext(EditorContext)


  return (
      <div className="error-output ui-block">

        {(!editorContext.errors || (editorContext.errors?.length === 0)) &&
            <ErrorMessage
                error={{
                  type: ErrorType.INFO,
                  color: "#226303",
                  background: "#e6f9dc",
                  message: 'There you\'ll see the errors'
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