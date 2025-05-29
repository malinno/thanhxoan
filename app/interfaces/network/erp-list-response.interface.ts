import { ErpPaginationOptions } from './erp-pagination-option.interface';

export interface ErpListResponse<T> extends ErpPaginationOptions {
  domain: (string | number | boolean)[][];
  total_count: number;
  items: T[];
}
