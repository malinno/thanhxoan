import { ErpBaseEntity } from './erp-base.entity';

export type TimekeepingExplanationState =
  | '0_new'
  | '1_confirmed'
  | '2_approved_first'
  | '3_approved_second'
  | '4_rejected'
  | '5_canceled';

type TEmployee = ErpBaseEntity & {
  employee_code: string;
};

export interface TTimekeepingExplanationLine {
  category: 'normal';
  date: Date;
  check_in: number;
  check_out: number;
  checkin_location: string;
  checkout_location: string;
  explanation_reason_id: boolean;
}

export interface TimekeepingExplanation {
  id: number;
  employee_id: TEmployee;
  job_id: ErpBaseEntity;
  department_id: ErpBaseEntity;
  cmp_group_id: ErpBaseEntity;
  system_id: ErpBaseEntity;
  parent_id: ErpBaseEntity;
  description: string;
  is_not_route_plan?: boolean;
  state: TimekeepingExplanationState;
  line_ids?: TTimekeepingExplanationLine[];
}
