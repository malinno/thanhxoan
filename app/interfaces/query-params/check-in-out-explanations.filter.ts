import { CheckIOExplanationStatus } from '@app/enums/check-io-explanation-status.enum';
import { BaseFilter } from './base.filter';

export interface CheckInOutExplanationsFilter extends BaseFilter {
  query?: string;
  status?: CheckIOExplanationStatus
  salesperson_id?: number;
}
