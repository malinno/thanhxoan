
import { TimekeepingExplanationState } from '../entities/timekeeping-explanation.entity';
import { BaseFilter } from './base.filter';

export interface TimekeepingExplanationsFilter extends BaseFilter {
  query?: string;
  state?: TimekeepingExplanationState;
  employee_id?: number;
  attendance_id?: number | number[]
}
