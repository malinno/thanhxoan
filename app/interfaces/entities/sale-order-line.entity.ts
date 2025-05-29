import { ErpProduct } from './erp-product.entity';

export interface SaleOrderLine {
  id?: number;
  product_id: ErpProduct;
  product_uom?: [number, string];
  proposal_bonus_monthly_id?: unknown;
  proposal_bonus_quarterly_id?: unknown;
  product_free_qty?: number;
  product_uom_qty: number;
  ti_gia?: number;
  price_unit: number;
  fixed_amount_discount: number;
  price_subtotal: number;
  thanh_tien_noi_dia?: number;
  tax_id?: boolean;
  is_sanpham_khuyen_mai?: boolean;
  is_gift?: boolean;
  is_bonus?: boolean;
  is_delivery?: boolean;
  customer_lead?: number;
  discount?: number; // giảm giá phần trăm
}
