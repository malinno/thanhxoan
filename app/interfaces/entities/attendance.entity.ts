import { ErpBaseEntity } from './erp-base.entity';
import { ResourceCalendar } from './resource-calendar.entity';

export type AttendanceEmployee = ErpBaseEntity & {
  job_id: ErpBaseEntity;
  department_id: ErpBaseEntity;
  parent_id: ErpBaseEntity;
};

export interface Attendance {
  id: number;
  check_in_date: string;
  employee_id: AttendanceEmployee;
  worked_days_rate: number;
  check_in_hour: number;
  check_out_hour: number;
  late_attendance_hours: number;
  early_leave_hours: number;
  worked_hours: number;
  valid_worked_hours: number;
  resource_calendar_id: ResourceCalendar;
}
