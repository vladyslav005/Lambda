export enum ErrorType {
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  INFO = 'INFO',

}

export interface ErrorMessageType {
  type: ErrorType;
  message: string;
  background: string;
  color: string;
}

// export function getBackgroundColorForError(errorType: ErrorType) {
//   switch (errorType) {
//     case ErrorType.WARNING:
//       return 'red';
//     case ErrorType.ERROR:
//       return '#F9DEDC';
//     case ErrorType.INFO:
//       return 'lightgreen';
//   }
// }
//
//
// export function getTitleColorForError(errorType: ErrorType) {
//   switch (errorType) {
//     case ErrorType.WARNING:
//       return '';
//     case ErrorType.ERROR:
//       return '';
//     case ErrorType.INFO:
//       return '';
//   }
// }
