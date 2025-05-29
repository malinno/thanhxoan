import { PosOrderState } from '@app/enums/pos-order-state.enum';
import { BaseFilter } from './base.filter';

export interface PosOrdersFilter extends BaseFilter {
  state?: PosOrderState;
  query?: string;
  partner_id?: number;
  from_date?: string;
  to_date?: string;
}
