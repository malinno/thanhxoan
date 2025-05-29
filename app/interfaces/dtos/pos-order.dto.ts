import { JournalType } from '@app/enums/journal-type.enum';
import { ShippingAddressType } from '@app/enums/shipping-address-type.enum';
import { ErpBaseLineDto } from './erp-base-line.dto';
import { TOptionComboGiftItemDto } from './option-combo-gift-item.dto';
import { TComboGiftItemDto } from './combo-gift-item.dto';

export interface PosOrderLineDto {
  product_id?: number;
  product_uom_qty?: number;
  price_unit?: number;
  discount?: number;
}

export interface PosOrderDto {
  distributor_id: number;
  partner_id: number;
  receiver_name: string;
  delivery_address_id: number;
  journal_name: JournalType;
  shipping_address_type: ShippingAddressType;
  pricelist_id?: number;
  delivery_expected_date?: string;
  salesperson_note?: string;
  order_line?: ErpBaseLineDto<PosOrderLineDto>;
  ctkm_id?: number | false;
}

export interface CreatePosOrderDto extends PosOrderDto {
  create_uid: number;
}

export interface UpdatePosOrderDto extends Partial<PosOrderDto> {
  update_uid: number;
  is_update_ctkm?: boolean;
  phantramchietkhautongdon?: number;
}

export interface UpdatePosOrderStateReasonDto {
  reason_id?: number;
  explain_reason?: string;
}
