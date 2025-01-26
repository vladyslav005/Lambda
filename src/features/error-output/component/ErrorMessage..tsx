import {ErrorMessageType} from "../types/error_types";


interface ErrorOutputProps {
  error: ErrorMessageType;
}

export function ErrorMessage(props: ErrorOutputProps) {

  return (
      <div className="error-message"
           style={{
             backgroundColor: `${props.error.background}`,
           }}
      >
        <h1 className="mb-1 mx-4 tracking-tight p-1"
            style={{
              fontWeight: "bold",
              color: `${props.error.color}`,
            }}
        >
          {props.error.type}
        </h1>
        <p className="mb-3 mx-4"
           style={{
             color: `${props.error.color}`,
           }}
        >
          {props.error.message}
        </p>

      </div>


  )
}