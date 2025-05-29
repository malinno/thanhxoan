import { BaseFilter } from './base.filter';

export interface AgenciesFilter extends BaseFilter {
  query?: string;
}
