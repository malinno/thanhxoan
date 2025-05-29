import { ErpBaseEntity } from "./erp-base.entity";


export interface CrmGroup extends ErpBaseEntity {
  group_type?: 'f2b' | 'b2b';
  is_app_b2b?: boolean;
}
