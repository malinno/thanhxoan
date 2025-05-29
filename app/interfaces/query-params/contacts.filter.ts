import { BaseFilter } from './base.filter';

export interface ContactsFilter extends BaseFilter {
  query?: string;
}
