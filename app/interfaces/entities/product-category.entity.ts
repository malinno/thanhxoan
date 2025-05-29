import { ErpBaseEntity } from './erp-base.entity';

export interface ProductCategory extends ErpBaseEntity {
  complete_name: string;
  category_type?: string;
}
