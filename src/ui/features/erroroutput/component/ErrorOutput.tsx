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
            editorContext.errors.map((error : string, index) => (
                <ErrorMessage
                    key={index}
                    message={error}
                    errorType={ErrorType.ERROR}
                />
            ))
        }


      </div>
  )

}