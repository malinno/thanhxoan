import { ComboGift } from '@app/interfaces/entities/combo-gift.entity';
import { ErpProduct } from '@app/interfaces/entities/erp-product.entity';
import { OptionComboGift } from '@app/interfaces/entities/option-combo-gift.entity';
import { ProductGift } from '@app/interfaces/entities/product-gift.entity';
import { create } from 'zustand';

export type TOptionComboGift = Omit<OptionComboGift, 'product_apply_ids'> & {
  quantity: number;
};

export type TOptionComboGiftLine = {
  applyProduct: ErpProduct;
  purchaseQty?: number;
  redeemedQty?: number;
  items: TOptionComboGift[];
};

export type TComboGiftLine = ComboGift & {
  selected?: boolean;
};

export type TPromotionGiftForm = Partial<ProductGift> & {
  options_combo_gifts: TOptionComboGiftLine[];
  combo_gifts: TComboGiftLine[];
};

const INITIAL_FORM = {
  options_combo_gifts: [],
  combo_gifts: []
}

export const usePromotionGiftPickerForm = create<{
  data: TPromotionGiftForm;
  setData: (data: Partial<TPromotionGiftForm>) => void;
  reset: () => void;
}>((set, get) => {
  return {
    data: {...INITIAL_FORM},
    setData: (partial: Partial<TPromotionGiftForm>) => {
      set({ data: { ...get().data, ...partial } });
    },
    reset: () => set({ data: {...INITIAL_FORM} }),
  };
});
