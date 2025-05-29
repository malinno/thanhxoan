import { ErpBaseEntity } from './erp-base.entity';

export interface ErpTag extends ErpBaseEntity {
    color?: string;
    isActive?: boolean;
}
