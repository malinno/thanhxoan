import { RouterStore } from '../entities/erp-router.entity';
import { ErpBaseLineDto } from './erp-base-line.dto';

export type RouterStoreLineDto = {
  [key in keyof RouterStore]?: any;
}

export interface RouterDto {
  name?: string;
  day_of_week?: string;
  salesperson_id: number;
  team_id: number;
  store_ids?: ErpBaseLineDto<RouterStoreLineDto>;
}

export interface CreateRouterDto extends RouterDto {
  create_uid: number;
}

export interface UpdateRouterDto extends RouterDto {
  update_uid: number;
}
