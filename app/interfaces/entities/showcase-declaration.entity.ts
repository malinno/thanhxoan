import { ShowcaseState } from '@app/enums/showcase-state.enum';
import { ErpBaseEntity } from './erp-base.entity';
import { ErpCustomer } from './erp-customer.entity';

export type ShowcaseImageValidation = {
  id: number;
  dsd_id: number;
  group_exhibition_id: [number, string];
  images_ids: string[];
};

export interface ErpShowcaseDeclaration extends ErpBaseEntity {
  note?: string;
  date_created: string;
  state: ShowcaseState;
  active: boolean;
  salesperson_id: [number, string];
  team_id: [number, string];
  router_id: [number, string];
  store_id: ErpCustomer;
  checkin_id: boolean;
  sla_showcase_id: [number, string];
  detail_router_plan_id: [number, string];
  router_plan_id: [number, string];
  images_validation_ids: ShowcaseImageValidation[];
}
