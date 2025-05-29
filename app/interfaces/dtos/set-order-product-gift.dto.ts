import { TComboGiftItemDto } from "./combo-gift-item.dto";
import { TOptionComboGiftItemDto } from "./option-combo-gift-item.dto";

export interface SetOrderProductGiftDto {
    combo_gift_ids: TComboGiftItemDto[];
    options_combo_gift_ids: TOptionComboGiftItemDto[];
    ctkm_id: number;
    wizard_id: number;
  }