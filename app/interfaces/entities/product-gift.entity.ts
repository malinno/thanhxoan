import { ComboGift } from './combo-gift.entity';
import { ErpBaseEntity } from './erp-base.entity';
import { OptionComboGift } from './option-combo-gift.entity';

export interface ProductGift {
  wizard_id: number;
  promotion_id: ErpBaseEntity;
  combo_gift_ids?: ComboGift[];
  option_combo_gift_ids?: OptionComboGift[];
  pos_order_id?: number;
  sale_order_id?: number
}
