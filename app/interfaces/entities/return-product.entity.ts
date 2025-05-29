import { ReturnProductState } from '@app/enums/return-product.enum';
import { ErpBaseEntity } from './erp-base.entity';
import { ErpCustomer } from './erp-customer.entity';
import { ErpWarehouse } from './erp-warehouse.entity';
import { PriceList } from './pricelist.entity';

export interface ReturnProduct extends ErpBaseEntity {
  partner_id: ErpCustomer;
  warehouse_id: ErpWarehouse;
  reason_return_id: ErpBaseEntity;
  description?: string;
  pricelist_id: PriceList;
  proposal_line_ids: ProposalLine[];
  state: ReturnProductState;
  create_uid?: Record<string, any>;
  create_date?: string;
}

export interface ProposalLine extends ErpBaseEntity {
  product_id: ErpProduct;
  is_gift: boolean;
  product_uom: ErpBaseEntity;
  product_uom_qty: number;
  product_uom_returned_qty: number;
  product_uom_order_qty: number;
  product_uom_paid_qty: number;
  discount: number;
  tax_id: ErpAccountTax[];
  ghichu: string;
}

export interface ErpProduct extends ErpBaseEntity {
  default_code: string;
}

export interface ErpAccountTax {
  id: number;
  name: string;
  amount_type: 'percent' | 'fixed';
  amount: number;
  type_tax_use: 'purchase' | 'sale';
  tax_scope: boolean;
  active: boolean;
}

export interface ErpReasonReturn extends ErpBaseEntity {
  category: string;
}
