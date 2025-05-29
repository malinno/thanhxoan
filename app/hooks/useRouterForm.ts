import { RouterStore } from '@app/interfaces/entities/erp-router.entity';
import { ValidationError } from '@core/interfaces/ValidationError';
import { create } from 'zustand';

export type TRouterForm = {
  id?: number;
  name?: string;
  salesperson_id?: [number, string];
  team_id?: [number, string];
  cmp_id?: [number, string];
  day_of_week?: number;
  store_ids: RouterStore[];
};

export const INITIAL_DATA: TRouterForm = {
  store_ids: []
};

export const useRouterForm = create<{
  data: TRouterForm;
  setData: (data: Partial<TRouterForm>) => void;
  errors?: ValidationError;
  setErrors: (data: ValidationError) => void;
  reset: () => void;
}>((set, get) => {
  return {
    data: { ...INITIAL_DATA },
    setData: (partial: Partial<TRouterForm>) => {
      set({ data: { ...get().data, ...partial } });

      const keys = Object.keys(partial);
      for (const key of keys) {
        const newErrors = { ...get().errors };
        delete newErrors[key];
        set({ errors: newErrors });
      }
    },
    setErrors: (error: Record<string, any>) =>
      set({ errors: { ...get().errors, ...error } }),
    reset: () => set({ errors: undefined, data: { ...INITIAL_DATA } }),
  };
});
