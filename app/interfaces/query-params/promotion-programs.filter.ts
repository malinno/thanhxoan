import { CustomerCategoryType } from '../entities/customer-category.type';

export interface PromotionProgramsFilter {
  is_dms?: boolean;
  query?: string;
  active?: boolean;
  currency_id?: number | string;
  category?: CustomerCategoryType;
  contact_level?: number | string;
  ngay_bat_dau?: string; // ngay_bat_dau >= ngày bắt đầu trên ctkm
  ngay_ket_thuc?: string; // ngày kết thúc trên ctkm >= ngay_ket_thuc
  partner_id?: number; // ID của khách hàng, hệ thống sẽ tự xử lý logic tương tự trong BE
  gia_tri_toi_thieu_don_hang?: number;
  sale_order_id?: number;
  pos_order_id?: number;
}
