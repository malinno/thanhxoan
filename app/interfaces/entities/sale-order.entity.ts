import { SaleOrderState } from '@app/enums/sale-order.state.enum';
import { ErpBaseEntity } from './erp-base.entity';
import { SaleOrderLine } from './sale-order-line.entity';
import { PromotionProgram } from './promotion-program.entity';
import { ErpWarehouse } from './erp-warehouse.entity';
import { PriceList } from './pricelist.entity';
import { JournalType } from '@app/enums/journal-type.enum';
import { ShippingAddressType } from '@app/enums/shipping-address-type.enum';

export interface SaleOrder extends ErpBaseEntity {
  id: number;
  name: string;
  partner_id: [number, string];
  partner_code: string;
  user_id: [number, string];
  team_id: [number, string];
  crmf99_system_id: [number, string];
  receiver_name: string;
  delivery_address_id: [number, string];
  phone: string;
  partner_address_details: string;
  country_type_id: [number, string];
  crm_group_id: [number, string];
  town_id: [number, string];
  district_id: [number, string];
  state_id: [number, string];
  create_date: string;
  partner_created_datetime: string;
  commitment_date: string;
  expected_date: string;
  latest_done_pick_datetime?: string;
  summary_state: SaleOrderState;
  salesperson_note?: string;
  pricelist_id?: PriceList;
  warehouse_id?: ErpWarehouse;
  order_line: SaleOrderLine[];
  tongtruocchietkhau: number;
  chietkhautongdon: number;
  amount_un_additional_fixed_amount_discount: number;
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  ctkm_id?: PromotionProgram;
  journal_name: JournalType;
  shipping_address_type: ShippingAddressType;
}
