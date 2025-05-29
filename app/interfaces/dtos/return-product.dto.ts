import { ErpBaseLineData } from '../network/erp-base-line-dto.type';

export interface CreateReturnProductDto {
  partner_id?: number;
  reason_return_id?: number;
  description?: string;
  pricelist_id?: number;
  warehouse_id?: number;
  phantramchietkhautongdon?: number;
  proposal_line_ids?: ErpBaseLineData<ProposalLineFormData>[];
}
interface ProposalLineFormData {
  product_id: number;
  is_gift: boolean;
  product_uom_returned_qty: number;
  discount: number;
  tax_id: any[];
  price_unit?: number;
  price_subtotal?: number;
  ghichu?: string;
}
