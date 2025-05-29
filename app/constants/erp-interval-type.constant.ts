import { IntervalType } from "@app/interfaces/entities/erp-route-plan.entity";

export const DISPLAY_INTERVAL_TYPE: Record<string, string> = {
  'days': 'ngày',
  'weeks': 'tuần',
  'months': 'tháng',
  'years': 'năm',
};
// type RoutePlanInterval = {
//   id: IntervalType;
//   text: string;
// };

// export const INTERVAL_TYPES: RoutePlanInterval[] = [
//   {
//     id: 'days',
//     text: 'Ngày',
//   },
//   {
//     id: 'distributor',
//     text: 'Nhà phân phối',
//   },
//   {
//     id: 'agency',
//     text: 'Đại lý',
//   },
// ];