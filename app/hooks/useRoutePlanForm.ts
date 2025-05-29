import { ROUTE_PLAN_CATEGORIES } from '@app/constants/route-plan-categories.constant';
import {
  IntervalType,
  RoutePlanCategory,
  RoutePlanState,
} from '@app/interfaces/entities/erp-route-plan.entity';
import { RouterStore } from '@app/interfaces/entities/erp-router.entity';
import { ErpState } from '@app/interfaces/entities/erp-state.entity';
import { ValidationError } from '@core/interfaces/ValidationError';
import dayjs from 'dayjs';
import { create } from 'zustand';

export type RoutePlanForm = {
  editable: boolean;
  description?: string;
  router?: [number, string];
  teamId?: [number, string];
  userId?: [number, string];
  groupId?: [number, string];
  from: dayjs.Dayjs;
  to: dayjs.Dayjs;
  state?: RoutePlanState;
  stores?: RouterStore[];
  active?: boolean;
  recurrent?: boolean;
  intervalNumber?: string;
  intervalType?: IntervalType;
  recurrentDate?: dayjs.Dayjs;
  category: [RoutePlanCategory, string];
  states?: [number, string][];
};

export const ROUTE_PLAN_FORM_INITIAL_DATA: RoutePlanForm = {
  editable: true,
  from: dayjs(),
  to: dayjs(),
  category: [ROUTE_PLAN_CATEGORIES[0].id, ROUTE_PLAN_CATEGORIES[0].text],
};

export const useRoutePlanForm = create<{
  data: RoutePlanForm;
  setData: (data: Partial<RoutePlanForm>) => void;
  errors?: ValidationError;
  setErrors: (data: ValidationError) => void;
  reset: () => void;
}>((set, get) => {
  return {
    data: { ...ROUTE_PLAN_FORM_INITIAL_DATA },
    setData: (partial: Partial<RoutePlanForm>) => {
      set({ data: { ...get().data, ...partial } });

      const keys = Object.keys(partial);
      for (const key of keys) {
        const newErrors = { ...get().errors };
        delete newErrors[key];
        set({ errors: newErrors });
      }
    },
    setErrors: (errors: Record<string, any>) =>
      set({ errors }),
    reset: () =>
      set({ errors: undefined, data: { ...ROUTE_PLAN_FORM_INITIAL_DATA } }),
  };
});
