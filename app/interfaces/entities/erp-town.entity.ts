import { ErpBaseEntity } from './erp-base.entity';

export interface ErpTown extends ErpBaseEntity {
  code: string;
  country_type_code: string;
  code_int: number;
  is_refreshed: boolean;
  normalized_name: string;
  pos_code: boolean;
  service_name: string;
  district_id: [number, string];
  state_id: [number, string];
  area_id: string;
  active: boolean;
}
