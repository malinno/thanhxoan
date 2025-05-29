import { BaseFilter } from "./base.filter";

export interface EmployeeMapsFilter extends BaseFilter {
    query?: string;
    parent_id?: string | number
    user_id?: string | number | Array<(string | number)>
    state?: 'online' | 'offline'
}