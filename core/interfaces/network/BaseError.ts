export interface BaseError<T = any> {
  error: T;
  defaultMessage?: string;
  defaultStatusCode?: number;
}