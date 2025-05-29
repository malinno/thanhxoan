import { CustomerCategoryType } from './customer-category.type';
import { ErpBaseEntity } from './erp-base.entity';
import { ErpCountry } from './erp-country.entity';
import { ErpCurrency } from './erp-currencty.entity';
import { ErpDistrict } from './erp-district.entity';
import { ErpProduct } from './erp-product.entity';
import { PromotionProduct } from './promotion-product.entity';

export type PromotionState = 'dang_dien_ra' | 'da_ket_thuc';
export type PromotionType = 'all' | 'fixed' | 'percent' | 'product';

export interface PromotionProgram extends ErpBaseEntity {
  code?: string;
  category?: CustomerCategoryType;
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  trang_thai: PromotionState;
  contact_level?: unknown;
  currency_id?: ErpCurrency;
  gia_tri_toi_thieu_don_hang?: number;
  soluotapdungkh?: number;
  soluotapdungchuongtrinh?: number;
  chietkhaucodinh?: number;
  chietkhauphantram?: number;
  ctkm_sanpham_ids?: PromotionProduct[];
  active?: boolean;
  max_promotion_value?: number;
  typeof_promotion?: PromotionType;
  san_pham_chiet_khau_id?: ErpProduct;
  product_promotion_percent_id?: ErpProduct;
  channel_apply_ids?: unknown;
  crmf99_system_apply_ids?: unknown;
  crm_group_apply_ids?: unknown;
  country_apply_ids: ErpCountry[];
  area_apply_ids?: unknown;
  district_ids: ErpDistrict[];
}
