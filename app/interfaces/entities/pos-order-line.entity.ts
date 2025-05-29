import { ErpProduct } from './erp-product.entity';

export interface PosOrderLine {
  id?: number;
  product_id: ErpProduct;
  product_uom?: [number, string];
  product_free_qty?: number;
  product_uom_qty: number;
  ti_gia?: number;
  price_unit: number;
  fixed_amount_discount: number;
  price_subtotal: number;
  thanh_tien_noi_dia?: number;
  tax_id?: boolean;
  is_dong_ctkm_tang_kem?: boolean;
  is_dong_ctkm_chiet_khau?: boolean;
  is_sanpham_khuyen_mai?: boolean;
  is_delivery?: boolean;
  is_dongchietkhautongdon?: boolean;
  discount?: number;
}
