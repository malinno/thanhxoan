import {
  RoutePlanCategory,
  RoutePlanState,
} from '../entities/erp-route-plan.entity';
import { BaseFilter } from './base.filter';

export interface RoutePlansListFilter extends BaseFilter {
  state?: RoutePlanState;
  category?: RoutePlanCategory;
  query?: string;
  from_date?: string;
  to_date?: string;
  salesperson_id?: number;
}
