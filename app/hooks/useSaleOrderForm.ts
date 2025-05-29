import { JournalType } from '@app/enums/journal-type.enum';
import { ShippingAddressType } from '@app/enums/shipping-address-type.enum';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { create } from 'zustand';
import { TDeliveryAddress } from './usePosOrderForm';
import dayjs from 'dayjs';
import { PromotionProgram } from '@app/interfaces/entities/promotion-program.entity';
import { SaleOrderLine } from '@app/interfaces/entities/sale-order-line.entity';
import { ValidationError } from '@core/interfaces/ValidationError';

export type SaleOrderForm = {
  crmGroup?: [number, string]; // bên bán
  partner?: ErpCustomer; // khách hàng
  deliveryAddress?: TDeliveryAddress;
  receiver?: [number, string]; // người nhận
  saleNote?: string; // ghi chú
  priceList?: [number, string]; // bảng giá
  journal: JournalType; // phương thức thanh toán
  shippingAddressType: ShippingAddressType; // khu vực
  expectedDate?: dayjs.Dayjs; // Ngày giờ muốn nhận hàng
  warehouse?: [number, string]; // kho hàng
  lines: SaleOrderLine[];
  promotionLines: SaleOrderLine[];
  promotionProgram?: PromotionProgram;
  subtotal?: number;
  discount?: number;
  totalBeforeTax?: number;
  tax?: number;
  total?: number;
};

export const SALE_ORDER_FORM_INITIAL_DATA: SaleOrderForm = {
  journal: JournalType.cod,
  shippingAddressType: ShippingAddressType.inner,
  lines: [],
  promotionLines: [],
};

export const useSaleOrderForm = create<{
  data: SaleOrderForm;
  setData: (data: Partial<SaleOrderForm>) => void;
  errors?: ValidationError;
  setErrors: (data: ValidationError) => void;
  reset: () => void;
}>((set, get) => {
  return {
    data: { ...SALE_ORDER_FORM_INITIAL_DATA },
    setData: (partial: Partial<SaleOrderForm>) => {
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
      set({ errors: undefined, data: { ...SALE_ORDER_FORM_INITIAL_DATA } }),
  };
});
