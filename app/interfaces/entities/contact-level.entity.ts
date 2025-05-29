import { CustomerCategoryType } from './customer-category.type';
import { ErpBaseEntity } from './erp-base.entity';

export interface ContactLevel extends ErpBaseEntity {
  active?: boolean;
  category?: CustomerCategoryType;
  parent_id?: ContactLevel;
}
