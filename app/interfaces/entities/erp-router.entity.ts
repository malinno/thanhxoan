import { CustomerCategoryType } from './customer-category.type';
import { ErpBaseEntity } from './erp-base.entity';

export type RouterStore = ErpBaseEntity & {
  phone: string;
  street?: string;
  category?: CustomerCategoryType | [CustomerCategoryType, string];
  address_town_id?: [number, string];
  address_district_id?: [number, string];
  address_state_id?: [number, string];
  representative?: string;
  sequence?: number;
};

export interface ErpRouter {
  id: number;
  name: string;
  code: string;
  salesperson_id: [number, string];
  team_id: [number, string];
  cmp_id?: [number, string];
  total_store?: number;
  store_ids?: RouterStore[];
  day_of_week?: string;
}
