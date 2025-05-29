import { ErpBaseEntity } from './erp-base.entity';
import { PriceList } from './pricelist.entity';

export interface ErpProduct extends ErpBaseEntity {
  default_code?: string;
  barcode?: string;
  uom_id?: [number, string];
  list_price?: number;
  active?: boolean;
  categ_id?: [number, string];
  image_1920?: string;
  pricelist_ids?: PriceList[];
  current_free_qty?: number;
}
