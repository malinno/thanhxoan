type TSaveOrderArguments<T> = {
  autoCreateConfirmMessage?: string;
  onSuccess?: (result: T) => void;
  onFailure?: (err: any) => void;
};
