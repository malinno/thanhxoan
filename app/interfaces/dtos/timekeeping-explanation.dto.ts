import {
  TimekeepingExplanationState,
  TTimekeepingExplanationLine,
} from '../entities/timekeeping-explanation.entity';
import { ErpBaseLineDto } from './erp-base-line.dto';

export type TimekeepingExplanationLineDto = {
  [key in keyof TTimekeepingExplanationLine]?: any;
};

export type CreateTimekeepingExplanationDto = {
  employee_id: number;
  description: string;
  state?: TimekeepingExplanationState;
  count_state?: any;
  attendance_id?: number;
  cico_explanation_id?: number;
  line_ids?: ErpBaseLineDto<TimekeepingExplanationLineDto>;
};

export type UpdateTimekeepingExplanationDto =
  Partial<CreateTimekeepingExplanationDto>;

export type TimekeepingExplanationStateDto =
  | 'confirm'
  | 'approve'
  | 'reject'
  | 'cancel'
  | 'reset_to_new';
