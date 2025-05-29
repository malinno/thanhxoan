import { ErpProduct } from './erp-product.entity';

export interface OptionComboGift {
  id: number;
  product_apply_ids: ErpProduct[];
  product_apply_quantity: number;
  combo_maximum: number;
  description: string;
  combo_available: number;
  is_apply: boolean;
  combo_apply: number;
}
