import { ErpBaseEntity } from './erp-base.entity';
import { ErpDistrict } from './erp-district.entity';
import { ErpState } from './erp-state.entity';

export interface ErpWarehouse extends ErpBaseEntity {
  code: string;
  active?: boolean;
  default_shipping_address_type?: boolean;
  use_pos?: boolean;
  pos_name?: string;
  pos_code?: string;
  default_pickup_type?: string;
  region?: string;
  is_kho_hang_goi_y?: boolean;
  distributor_partner_id?: boolean;
  distributor_address?: boolean;
  tinh_thanh_uu_tien_ids?: ErpState[];
  quanhuyenuutien_ids?: ErpDistrict[];
}
