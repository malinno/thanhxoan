import { CheckInOutCategory } from "@app/enums/check-in-out-category.enum";

export type CheckInOutDto = {
  store_id?: number;
  router_plan_id?: number;
  detail_router_plan_id?: number;
  salesperson_id?: number;
  sla_showcase_id?: number;
  create_uid?: number;
  update_uid?: number;
  check_in?: string;
  checkin_longitude?: number;
  checkin_latitude?: number;
  checkin_address?: string;
  check_out?: string;
  checkout_longitude?: number;
  checkout_latitude?: number;
  checkout_address?: string;
  attachment_image_ids?: string[];
  is_open?: boolean;
  note?: string;
  category?: CheckInOutCategory
  pass_checkout_distance_validate?: boolean
};
