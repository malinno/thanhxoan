import { ErpBaseEntity } from './erp-base.entity';
import { ErpCustomer } from './erp-customer.entity';
import { ErpProduct } from './erp-product.entity';

export interface AvailableInventoryReport {
  product_id: ErpProduct;
  categ_id: ErpBaseEntity;
  uom_id: ErpBaseEntity;
  agency_id: ErpCustomer;
  qty_beginning_period: number;
  qty_export: number;
  qty_ending_period: number;
}
