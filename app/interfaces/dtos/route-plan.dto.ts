import {
  IntervalType,
  RoutePlanCategory,
} from '../entities/erp-route-plan.entity';
import { ErpBaseLineDto } from './erp-base-line.dto';

export interface RoutePlanDto {
  from_date: string;
  to_date: string;
  description?: string;
  router_id?: number;
  user_id?: number;
  team_id?: number;
  crm_group_id?: number;
  recurrent?: boolean;
  interval_number?: number;
  interval_type?: IntervalType;
  recurrent_date?: string;
  category?: RoutePlanCategory;
  store_ids?: ErpBaseLineDto<number>;
  state_ids?: ErpBaseLineDto<number>;
}

export interface CreateRoutePlanDto extends RoutePlanDto {
  create_uid: number;
}

export interface UpdateRoutePlanDto extends Partial<RoutePlanDto> {
  update_uid: number;
}
