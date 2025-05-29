import { BaseFilter } from './base.filter';

export interface UsersFilter extends BaseFilter {
  query?: string;
  parent_id?: number;
  ids?: number[]
}
