import { SaleOrderState } from '@app/enums/sale-order.state.enum';
import { BaseFilter } from './base.filter';

export interface SaleOrdersFilter extends BaseFilter {
  summary_state?: SaleOrderState;
  query?: string;
  partner_id?: number
}
