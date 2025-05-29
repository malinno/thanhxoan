import { JournalType } from '@app/enums/journal-type.enum';
import { ShippingAddressType } from '@app/enums/shipping-address-type.enum';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { PosOrderLine } from '@app/interfaces/entities/pos-order-line.entity';
import { PromotionProgram } from '@app/interfaces/entities/promotion-program.entity';
import { ValidationError } from '@core/interfaces/ValidationError';
import dayjs from 'dayjs';
import { create } from 'zustand';

export type TDeliveryAddress = {
  id?: number;
  receiverName?: string;
  addressDetail?: string;
  phone?: string;
};

export type PosOrderForm = {
  id?: number;
  distributor?: [number, string]; // bên bán
  partner?: ErpCustomer; // khách hàng
  deliveryAddress?: TDeliveryAddress;
  saleNote?: string; // ghi chú
  priceList?: [number, string]; // bảng giá
  journal: JournalType; // phương thức thanh toán
  shippingAddressType: ShippingAddressType; // khu vực
  deliveryExpectedDate?: dayjs.Dayjs;
  lines: PosOrderLine[];
  promotionLines: PosOrderLine[];
  promotionProgram?: PromotionProgram;
  subtotal?: number;
  discount?: number;
  totalBeforeTax?: number;
  tax?: number;
  total?: number;
  percentageDiscountAmount: number;
};

export const POS_ORDER_FORM_INITIAL_DATA: PosOrderForm = {
  journal: JournalType.cod,
  shippingAddressType: ShippingAddressType.inner,
  lines: [],
  promotionLines: [],
  percentageDiscountAmount: 0
};

export const usePosOrderForm = create<{
  data: PosOrderForm;
  setData: (data: Partial<PosOrderForm>) => void;
  errors?: ValidationError;
  setErrors: (data: ValidationError) => void;
  reset: () => void;
}>((set, get) => {
  return {
    data: { ...POS_ORDER_FORM_INITIAL_DATA },
    setData: (partial: Partial<PosOrderForm>) => {
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
      set({ errors: undefined, data: { ...POS_ORDER_FORM_INITIAL_DATA } }),
  };
});
