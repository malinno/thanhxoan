import { ErpBaseEntity } from './erp-base.entity';
import { ErpCustomer } from './erp-customer.entity';
import { IntervalType } from './erp-route-plan.entity';

export interface VisitFrequency extends ErpBaseEntity {
  description?: string;
  interval_number: number;
  interval_type?: IntervalType;
  recurrent_date?: string;
  partner_ids: ErpCustomer[];
}
