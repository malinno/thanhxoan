import { ErpBaseEntity } from './erp-base.entity';
import { ErpCurrency } from './erp-currencty.entity';
import { ErpProduct } from './erp-product.entity';

export interface PriceListItem extends ErpBaseEntity {
  product_id: ErpProduct;
  min_quantity: number;
  fixed_price: number;
  compute_price: 'fixed';
  date_start?: string;
  date_end?: string;
  currency_id?: ErpCurrency;
}
