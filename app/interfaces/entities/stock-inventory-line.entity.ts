import { ErpProduct } from './erp-product.entity';

export interface StockInventoryLine {
  id: number;
  product_id: ErpProduct;
  barcode?: string;
  agency_id: [number, string];
  lot_id?: [number, string];
  uom_id: [number, string];
  product_qty?: number
  count_qty?: number
  diff_qty?: number
  note?: string;
  expiry_date?: string;
}
