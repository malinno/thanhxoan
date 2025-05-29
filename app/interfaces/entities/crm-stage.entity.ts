import { ErpBaseEntity } from './erp-base.entity';

export interface CrmStage extends ErpBaseEntity {
  is_apply_dms: boolean;
  fold: boolean;
  requirements: unknown;
  team_id: unknown;
}
