import { CustomerCategoryType } from './customer-category.type';
import { ErpBaseEntity } from './erp-base.entity';
import { ErpTag } from './erp-tag.entity';

export type ErpLeadNote = {
  create_date: string;
  content: string;
  create_by: [number, string];
};

export type ErpLeadPartner = ErpBaseEntity & {
  category: CustomerCategoryType;
  new_opening: string;
  phone: string;
  representative: string;
  street?: string;
  street2?: string;
  address_town_id: [number, string];
  address_district_id: [number, string];
  address_state_id: [number, string];
  product_category_id: [number, string];
};

export type LeadState = 'new' | 'qualified' | 'proposition' | 'failed' | 'won'

export interface ErpLead extends ErpBaseEntity {
  partner?: ErpLeadPartner;
  phone: string;
  address_full?: string;
  street: string;
  address_town_id: [number, string];
  address_district_id: [number, string];
  address_state_id: [number, string];
  product_category_id: [number, string];
  tags: ErpTag[];
  created_date: string;
  date_open: string;
  source_id: [number, string];
  user_id: [number, string];
  team_id: [number, string];
  crm_group_id: [number, string];
  created_by: [number, string];
  histories?: ErpLeadNote[];
  create_date: string;
  stage_id: [number, string];
  state: LeadState;
  note?: ErpLeadNote;
}
