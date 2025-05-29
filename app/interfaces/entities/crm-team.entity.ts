
import { CrmGroup } from './crm-group.entity';
import { ErpBaseEntity } from './erp-base.entity';

export interface CrmTeam extends ErpBaseEntity {
  sale_team_type?: "sale" | "resale"
  crm_group_id?: CrmGroup
}
