import { CompanyType } from '@app/enums/company-type.enum';
import { CustomerCategoryType } from '../entities/customer-category.type';
import { CustomerContactDto } from './customer-contact.dto';
import { ErpBaseLineDto } from './erp-base-line.dto';

export interface AccountBankDto {
  bank_id?: number;
  bank_branch?: string;
  account_owner?: string;
  account_number?: string;
}

export interface CustomerDto {
  company_type?: CompanyType;
  representative?: string;
  name?: string;
  phone?: string;
  tax_code?: string;
  email?: string;
  app_image_url?: string;
  category?: CustomerCategoryType;
  street2?: string;
  address_state_id?: number;
  address_district_id?: number;
  address_town_id?: number;
  partner_latitude?: number;
  partner_longitude?: number;
  distribution_channel_id?: number;
  crm_lead_user_id?: number;
  crm_lead_team_id?: number;
  crm_lead_crm_group_id?: number;
  superior_id?: number;
  contact_level?: number;
  child_ids?: ErpBaseLineDto<CustomerContactDto>;
  source_id?: number;
  product_category_id?: number;
  category_id?: ErpBaseLineDto<number>;
  route_id?: ErpBaseLineDto<number>;
  frequency_visit_id?: number;
  visit_from_date?: string;
  partner_account_bank_ids?: ErpBaseLineDto<AccountBankDto>;
}

export interface CreateCustomerDto extends CustomerDto {
  create_uid: number;
}

export interface UpdateCustomerDto extends Partial<CustomerDto> {
  update_uid: number;
}
