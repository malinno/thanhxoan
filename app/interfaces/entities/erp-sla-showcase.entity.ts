import { ErpBaseEntity } from './erp-base.entity';

export type SlaShowcaseLine =  {
    id: number
    measure: string,
    sla_exhibition_id: [number, string]
    sla_criteria_id: [number, string]
}

export interface ErpSlaShowcase extends ErpBaseEntity {
  code: string;
  start_date: string;
  end_date: string;
  contact_level_id: [number, string];
  position_id: [string, string];
  line_ids: SlaShowcaseLine[];
}
