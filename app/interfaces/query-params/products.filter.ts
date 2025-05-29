import { BaseFilter } from './base.filter';

export interface ProductsFilter extends BaseFilter {
  query?: string;
  name?: string;
  id?: number;
  barcode?: string;
  default_code?: string;
  pricelist_id?: number;
  product_ids?: number[];
  enable_sale_search?: boolean;
}
