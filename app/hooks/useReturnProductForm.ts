import { ReturnProductState } from '@app/enums/return-product.enum';
import { ErpProduct } from '@app/interfaces/entities/return-product.entity';
import { ValidationError } from '@core/interfaces/ValidationError';
import { create } from 'zustand';

type SelectData = {
  id: number;
  name: string;
};
export type ReturnDataForm = {
  partner_id?: SelectData;
  reason_return_id?: SelectData;
  description?: string;
  pricelist_id?: SelectData;
  warehouse_id?: SelectData;
  phantramchietkhautongdon?: number;
  // proposal_line_ids?: ErpBaseLineData<ProposalLineFormData>[];
  proposal_line_ids?: ProposalLineFormData[];
  state?: ReturnProductState;
};
export type ProposalLineFormData = {
  product_id: ErpProduct;
  is_gift: boolean;
  product_uom_qty: number;
  discount: number;
  tax_id: SelectData[];
  price_unit?: number;
  price_subtotal?: number;
  ghichu?: string;
};

export const RETURN_DATA_FORM_INITIAL_DATA: ReturnDataForm = {
  state: ReturnProductState.draft,
};

export const useReturnProductForm = create<{
  data: ReturnDataForm;
  setData: (data: Partial<ReturnDataForm>) => void;
  errors?: ValidationError;
  setErrors: (data: ValidationError) => void;
  reset: () => void;
}>((set, get) => {
  return {
    data: { ...RETURN_DATA_FORM_INITIAL_DATA },
    setData: (partial: Partial<ReturnDataForm>) => {
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
    reset: () =>
      set({ errors: undefined, data: { ...RETURN_DATA_FORM_INITIAL_DATA } }),
  };
});
