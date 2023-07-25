import { errorPTSMessages } from '../enums/error-messages-pts.enum';

export function getPtsErrorMessage(error: string): string {
  if (error in errorPTSMessages) {
    return errorPTSMessages[error];
  }
  const firstLetter = error.charAt(0).toUpperCase();
  const text = error.slice(1);

  return firstLetter + text.toLowerCase();
}
