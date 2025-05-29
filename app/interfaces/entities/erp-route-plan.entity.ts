import { RouterStore } from './erp-router.entity';
import { ErpState } from './erp-state.entity';

export type RoutePlanState = '1_new' | '1x_to_approve' | '2_approved' | '3_cancel';
export type IntervalType = 'days' | 'weeks' | 'months' | 'years';
export type RoutePlanCategory = 'plan' | 'audit';

export interface ErpRoutePlan {
  id: number;
  code: string;
  description: string;
  router_id?: [number, string];
  team_id?: [number, string];
  user_id?: [number, string];
  crm_group_id?: [number, string];
  from_date: string;
  to_date: string;
  state: RoutePlanState;
  store_ids?: RouterStore[];
  active?: boolean;
  recurrent?: boolean;
  interval_number?: number;
  interval_type?: IntervalType;
  recurrent_date?: string;
  total_store?: number;
  category?: RoutePlanCategory;
  state_ids?: ErpState[];
}
