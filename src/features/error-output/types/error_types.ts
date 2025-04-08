export enum ErrorType {
  ERROR = 'ERROR',
  INFO = 'INFO',
}

export interface ErrorMessageType {
  type: ErrorType;
  message: string;
  background: string;
  color: string;
}
