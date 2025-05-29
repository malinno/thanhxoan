import { JournalType } from '@app/enums/journal-type.enum';
import { ShippingAddressType } from '@app/enums/shipping-address-type.enum';
import { ErpBaseLineDto } from './erp-base-line.dto';

export interface SaleOrderLineDto {
  product_id?: number;
  product_uom_qty?: number;
  price_unit?: number;
  discount?: number;
}

export interface SaleOrderDto {
  crm_group_id: number;
  partner_id: number;
  partner_address_details: string;
  receiver_name: string;
  delivery_address_id: number;
  journal_name: JournalType;
  shipping_address_type: ShippingAddressType;
  pricelist_id: number;
  warehouse_id: number;
  user_id: number;
  is_package_viewable: boolean;
  salesperson_note?: string;
  expected_date?: string;
  order_line?: ErpBaseLineDto<SaleOrderLineDto>;
  ctkm_id?: number | false;
}

export interface CreateSaleOrderDto extends SaleOrderDto {
  create_uid: number;
}

export interface UpdateSaleOrderDto extends Partial<SaleOrderDto> {
  update_uid: number;
}
