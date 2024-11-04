import {ErrorMessage} from "./ErrorMessage.";
import {ErrorType} from "../types/error_types";
import {useContext} from "react";
import {EditorContext} from "../../lambdainput/context/EditorContext";


export function ErrorOutput() {
  const editorContext = useContext(EditorContext)



  return (
      <div className="error-output ui-block bg-white"
           style={{
             display: "flex",
             flexDirection: "column",
             // justifyContent: 'center',
             alignItems: 'center',
           }}
      >
        ERRORS

        <ErrorMessage message={'There you\'ll see the error output'} errorType={ErrorType.INFO} ></ErrorMessage>

        {editorContext.errors &&
            editorContext.errors.map((error : Error, index) => (
                <ErrorMessage
                    key={index}
                    message={error.message}
                    errorType={ErrorType.ERROR}
                />
            ))
        }


      </div>
  )

}