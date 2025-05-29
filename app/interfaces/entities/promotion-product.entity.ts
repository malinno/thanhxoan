import { ErpProduct } from "./erp-product.entity";

export interface PromotionProduct {
    id: number;
  product_id: ErpProduct;
  product_apply_quantity: number;
  product_donate_id?: ErpProduct;
  product_donate_quantity: number;
  product_free_id?: ErpProduct;
  product_free_quantity: number;
}