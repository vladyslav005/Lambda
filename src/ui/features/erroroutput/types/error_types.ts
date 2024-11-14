export enum ErrorType {
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  INFO = 'INFO',

}


export interface ErrorMessage {
  type: ErrorType;
  message: string;
}

export function getBackgroundColorForError(errorType: ErrorType) {
  switch (errorType) {
    case ErrorType.WARNING:
      return 'red';
    case ErrorType.ERROR:
      return 'orange';
    case ErrorType.INFO:
      return 'lightgreen';
  }

}
