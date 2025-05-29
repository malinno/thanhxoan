import { ErpBaseEntity } from "./erp-base.entity";

export interface ResourceCalendar extends ErpBaseEntity {
    hour_from: number
    hour_to: number
}