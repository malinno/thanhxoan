import { CompanyType } from '@app/enums/company-type.enum';
import { CustomerCategoryType } from '@app/interfaces/entities/customer-category.type';
import { ErpTag } from '@app/interfaces/entities/erp-tag.entity';
import { ValidationError } from '@core/interfaces/ValidationError';
import dayjs from 'dayjs';
import { create } from 'zustand';

export type ClientForm = {
  id?: number;
  type: CompanyType;
  name?: string;
  representative?: string;
  address?: string;
  phone?: string;
  taxCode?: string;
  email?: string;
  image?: string;
  coords?: {
    lat: number;
    lng: number;
  };
  tags?: ErpTag[];
  source?: [number, string];
  productCategory?: [number, string];
  distributionChannel?: [number, string];
  superior?: [number, string];
  category?: [CustomerCategoryType, string];
  state?: [number, string];
  district?: [number, string];
  town?: [number, string];
  contactLevel?: [number, string];
  debtLimit?: number;
  numberOfDaysDebt?: number;
  userId?: [number, string];
  teamId?: [number, string];
  groupId?: [number, string];
  routes?: [number, string][];
  isFetchingGeolocation?: boolean;
  visitFrequency?: [number, string];
  visitFromDate?: dayjs.Dayjs;
};

export const CUSTOMER_FORM_INITIAL_DATA: ClientForm = {
  type: CompanyType.person,
  name: '',
  representative: '',
  address: '',
  phone: '',
  tags: [],
  category: ['agency', 'Đại lý'],
};

export const useCustomerForm = create<{
  data: ClientForm;
  setData: (data: Partial<ClientForm>) => void;
  errors?: ValidationError;
  setErrors: (data: ValidationError) => void;
  reset: () => void;
}>((set, get) => {
  return {
    data: { ...CUSTOMER_FORM_INITIAL_DATA },
    setData: (partial: Partial<ClientForm>) => {
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
    reset: () =>
      set({ errors: undefined, data: { ...CUSTOMER_FORM_INITIAL_DATA } }),
  };
});
