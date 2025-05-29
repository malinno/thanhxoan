export type ValidationError<T = Record<string, any>> = {
  [key in keyof T]?: string | undefined;
};
