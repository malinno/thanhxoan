import { BaseFilter } from './base.filter';

export interface RoutersFilter extends BaseFilter {
  query?: string;
}
