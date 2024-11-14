import {ErrorType, getBackgroundColorForError} from "../types/error_types";


interface ErrorOutputProps {
  errorType: ErrorType;
  message: string;
}

export function ErrorMessage(props: ErrorOutputProps) {


  return (
      <div className="mx-4 my-4 error-message"
           style={{
             backgroundColor: `${getBackgroundColorForError(props.errorType)}`,
           }}
      >
        <h1 className="mb-1 mx-4 text-1xl font-bold tracking-tight p-1 text-gray-900 dark:text-white">
          {props.errorType}
        </h1>
        <p className="mb-3 mx-4 font-normal text-gray-700 dark:text-gray-500">
          {props.message}
        </p>

      </div>


  )
}