import { BasePagination } from "./base-pagination";

export interface BaseFilter extends BasePagination {
    is_super?: boolean;
}