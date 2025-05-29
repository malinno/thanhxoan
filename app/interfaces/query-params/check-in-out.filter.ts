import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';
import { CheckInState, SlaState } from '@app/enums/check-in-state.enum';
import { BaseFilter } from './base.filter';

export interface CheckInOutFilter extends BaseFilter {
  query?: string;
  salesperson_id?: number | string;
  store_id?: number;
  store_ids?: string; // example: 1,2,3,4,5
  router_plan_id?: number;
  detail_router_plan_id?: number;
  category?: CheckInOutCategory;
  sla_state?: SlaState;
  state?: CheckInState;
  from_date?: string;
  to_date?: string;
}
