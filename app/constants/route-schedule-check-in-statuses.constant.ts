import { RoutePlanScheduleCheckInStatus } from '@app/enums/route-schedule-check-in-status.enum';
import { colors } from '@core/constants/colors.constant';
import images from '@images';

export const ROUTE_SCHEDULE_CHECK_IN_STATUSES = {
  [RoutePlanScheduleCheckInStatus.uncheck]: {
    statusDisplay: 'Chưa check in',
    statusBackgroundColor: colors.color16161633,
    statusTextColor: colors.color16161680,
    actionBtnIcon: images.route.checkInOutlined,
    actionBtnColor: colors.colorFF9F0E,
    backgroundColor: colors.white,
    dividerColor: colors.colorE3E5E8,
  },
  [RoutePlanScheduleCheckInStatus.checking_in]: {
    statusDisplay: 'Đang check in',
    statusBackgroundColor: colors.color0047B133,
    statusTextColor: colors.color0047B1,
    actionBtnIcon: images.route.checkOutOutlined,
    actionBtnColor: colors.red,
    backgroundColor: colors.white,
    dividerColor: colors.colorE3E5E8,
  },
  [RoutePlanScheduleCheckInStatus.checked]: {
    statusDisplay: 'Đã check in',
    statusBackgroundColor: colors.color2DBD2A,
    statusTextColor: colors.white,
    actionBtnIcon: images.route.checkInOutlined,
    actionBtnColor: colors.colorFF9F0E,
    backgroundColor: colors.color00A3FF1C,
    dividerColor: colors.white,
  },
};
