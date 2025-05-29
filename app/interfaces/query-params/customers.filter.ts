import { CustomerCategoryType } from '../entities/customer-category.type';
import { BaseFilter } from './base.filter';

export interface CustomersFilter extends BaseFilter {
  query?: string;
  category?: CustomerCategoryType;
  business_scope_town_id?: number | string;
  town_id?: number | string;
  crm_lead_crm_group_id?: number | string;
  id?: string // Example: 1,2,3,4,5
  is_confirmed_info?: boolean
}
