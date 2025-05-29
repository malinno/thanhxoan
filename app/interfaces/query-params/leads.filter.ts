import { BaseFilter } from './base.filter';

export interface LeadsFilter extends BaseFilter {
  query?: string;
}
