import { CustomerCategoryType } from './customer-category.type';
import { ErpBaseEntity } from './erp-base.entity';
import { ErpCustomer } from './erp-customer.entity';

type RouteScheduleStore = Omit<ErpCustomer, 'partner_latitude' | 'category'> & {
  category?: CustomerCategoryType
  partner_latitude: number;
  partner_longitude: number;
};

export interface ErpRouteSchedule extends ErpBaseEntity {
  description?: string;
  router_id: [number, string];
  team_id: [number, string];
  user_id: [number, string];
  crm_group_id: [number, string];
  store_id: RouteScheduleStore;
  from_date: string;
  to_date: string;
  state: string;
  active: boolean;
  address_town_id: [number, string];
  address_district_id: [number, string];
  address_state_id: [number, string];
  create_uid: [number, string];
  router_plan_id: [number, string];
  checkin_status: 'unchecked' | 'checked';
  checkin_last_days: number;
  last_checkin?: {
    id: number;
    name: string;
    check_in: string;
    check_out?: string;
  };
}
