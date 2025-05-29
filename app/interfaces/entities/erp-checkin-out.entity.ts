import { CheckInState, SlaState } from '@app/enums/check-in-state.enum';
import { ErpBaseEntity } from './erp-base.entity';
import { ErpCustomer } from './erp-customer.entity';
import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';

export interface ErpCheckInOut extends ErpBaseEntity {
  store_id: ErpCustomer;
  address_town_id: [number, string];
  address_district_id: [number, string];
  address_state_id: [number, string];
  salesperson_id: [number, string];
  team_id: [number, string];
  cmp_id: [number, string];
  router_plan_id: [number, string];
  detail_router_plan_id: [number, string];
  sla_ref_id: [number, string];
  note?: string;
  state: CheckInState;
  visiting_time: number;
  check_in: string;
  checkin_longitude: number;
  checkin_latitude: number;
  checkin_address: string;
  checkin_distance: number;
  check_out: string;
  checkout_longitude: number;
  checkout_latitude: number;
  checkout_address: string;
  checkout_distance: number;
  visiting_rate: string;
  ev_distance_deviation_rate: string;
  ev_distance_deviation_checkout_rate: string;
  images_count_rate: string;
  attachment_image_ids: [];
  is_open?: boolean;
  sla_state?: SlaState;
  category?: CheckInOutCategory;
}
