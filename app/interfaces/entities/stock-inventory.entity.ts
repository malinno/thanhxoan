import { StockInventoryState } from '@app/enums/stock-inventory-state.enum';
import { ErpBaseEntity } from './erp-base.entity';

export interface StockInventory extends ErpBaseEntity {
  content?: string;
  agency_id: [number, string];
  user_id: [number, string];
  checkin_out_id: unknown;
  start_date: string;
  state: StockInventoryState;
  date: string;
  count_products: number;
}
