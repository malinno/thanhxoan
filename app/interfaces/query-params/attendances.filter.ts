import { BaseFilter } from './base.filter';

export interface AttendancesFilter extends BaseFilter {
  query?: string;
  from_date?: string;
  to_date?: string;
  full_attendance?: boolean;
  employee_id?: number
}
