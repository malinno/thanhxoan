import { CrmPosition } from '@app/enums/crm-position.enum';
import { ErpBaseEntity } from './erp-base.entity';
import { CrmTeam } from './crm-team.entity';
import { CrmGroup } from './crm-group.entity';

export interface ErpUser extends ErpBaseEntity {
  username?: string;
  crm_position?: CrmPosition;
  crm_team?: CrmTeam;
  sale_team_id?: CrmTeam;
  crm_group?: CrmGroup;
  crm_group_id?: CrmGroup;
  short_name?: string;
  position: [number, string];
  login: string;
  company: [number, string];
  dms_access?: string;
  image_url?: string;
}
