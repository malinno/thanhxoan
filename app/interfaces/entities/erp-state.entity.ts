import { ErpBaseEntity } from './erp-base.entity';

export interface ErpState extends ErpBaseEntity {
  code?: string;
  code_int?: number;
  normalized_name?: string;
  country_type_code?: string;
  active?: boolean;
}
