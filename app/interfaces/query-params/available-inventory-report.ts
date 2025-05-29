import { BaseFilter } from "./base.filter";

export interface AvailableInventoryReportFilter extends BaseFilter {
    query?: string
    start_date?: string
    end_date?: string
    product_ids?: number[]
    agency_ids?: number[]
}