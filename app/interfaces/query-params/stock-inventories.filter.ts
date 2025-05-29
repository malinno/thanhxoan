import { StockInventoryState } from '@app/enums/stock-inventory-state.enum';

export interface StockInventoriesFilter {
  query?: string;
  agency_id?: string | number;
  state?: StockInventoryState;
  from_date?: string;
  to_date?: string;
  start_date?: string;
  checkin_out_id?: string | number;
}
