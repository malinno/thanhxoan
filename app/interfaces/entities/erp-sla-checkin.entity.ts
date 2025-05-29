import { ErpBaseEntity } from './erp-base.entity';

export interface ErpSlaCheckin extends ErpBaseEntity {
  contact_level: false;
  crm_position_ids: false;
  from_date: string;
  to_date: string;
  is_open: boolean;
  min_time: number;
  max_time: number;
  checkin_deviation: number;
  checkout_deviation: number;
  number_of_image: number;
}
