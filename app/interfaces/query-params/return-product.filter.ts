import { ErpPaginationOptions } from '../network/erp-pagination-option.interface';

export interface ReturnProductFilter extends ErpPaginationOptions {
  state?: string;
}
