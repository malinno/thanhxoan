import { BankAccountForm } from '@app/screens/bank/types/bank-account-form.type';
import { ValidationError } from '@core/interfaces/ValidationError';
import { create } from 'zustand';

export const useBankAccountForm = create<{
  data: BankAccountForm;
  setData: (data: Partial<BankAccountForm>) => void;
  errors?: ValidationError;
  setErrors: (data: ValidationError) => void;
  reset: () => void;
}>((set, get) => {
  return {
    data: {},
    setData: (partial: Partial<BankAccountForm>) => {
      set({ data: { ...get().data, ...partial } });

      const keys = Object.keys(partial);
      for (const key of keys) {
        const newErrors = { ...get().errors };
        delete newErrors[key];
        set({ errors: newErrors });
      }
    },
    setErrors: (error: ValidationError) =>
      set({ errors: { ...get().errors, ...error } }),
    reset: () => set({ errors: undefined, data: {} }),
  };
});
