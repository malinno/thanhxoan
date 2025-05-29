import { ErpBaseEntity } from './erp-base.entity';

export interface PaymentTermLine {
  id: number;
  sequence: number;
  value: string;
  value_amount: number;
  days: number;
  option: string;
  day_of_the_month: number;
}

export interface AccountPaymentTerm extends ErpBaseEntity {
  note: string;
  line_ids: PaymentTermLine[];
}
