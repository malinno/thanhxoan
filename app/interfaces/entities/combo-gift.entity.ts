import { ErpProduct } from './erp-product.entity';

export interface ComboGift {
  id: number;
  product_apply_ids: ErpProduct[];
  description: string;
  is_apply: boolean;
}
