import { ErpBaseEntity } from './erp-base.entity';

export interface ErpDistrict extends ErpBaseEntity {
  code: string;
  active: boolean;
  code_int: number;
  normalized_name: string;
  country_type_code: string;
  state_id: [number, string];
}

