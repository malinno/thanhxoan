import { CompanyType } from '@app/enums/company-type.enum';
import { ErpBaseEntity } from './erp-base.entity';
import { CustomerCategoryType } from './customer-category.type';
import { ContactType } from '@app/enums/contact-type.enum';
import { ErpTag } from './erp-tag.entity';
import { VisitFrequency } from './visit-frequency.entity';
import { PartnerAccountBank } from './partner-account-bank.entity';

export interface ErpCustomer extends ErpBaseEntity {
  phone: string;
  email?: string;
  street?: string;
  street2?: string;
  address_town_id: [number, string];
  address_district_id: [number, string];
  address_state_id: [number, string];
  representative?: string;
  category: [CustomerCategoryType, string];
  contact_level: [number, string];
  superior_id: [number, string];
  distribution_channel_id: [number, string];
  crm_lead_user_id: [number, string];
  crm_lead_team_id: [number, string];
  crm_lead_crm_group_id: [number, string];
  debt_limit: number;
  number_of_days_debt: number;
  category_id: ErpTag[];
  company_type: CompanyType;
  partner_latitude?: number;
  partner_longitude?: number;
  checkin_last_days?: number;
  order_last_days?: number;
  image_1920?: string;
  image_url?: string;
  type: ContactType;
  function?: string;
  comment?: string;
  title?: string;
  tax_code?: string;
  source_id?: [number, string];
  product_category_id?: [number, string];
  route_id?: ErpBaseEntity[];
  total_orders?: number;
  is_customer?: boolean;
  frequency_visit_id?: VisitFrequency;
  visit_from_date?: string;
  res_partner_f99id?: string;
  partner_account_bank_ids?: PartnerAccountBank[]
  is_confirmed_info?: boolean
}