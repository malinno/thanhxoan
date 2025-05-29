import { ErpBaseEntity } from './erp-base.entity';
import { PriceListItem } from './pricelist-item.entity';

export interface PriceList extends ErpBaseEntity {
  ngaylenso?: string;
  crm_group_ids?: ErpBaseEntity[];
  country_type_ids?: ErpBaseEntity[];
  item_ids?: PriceListItem[];
}
