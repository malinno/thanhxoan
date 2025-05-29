import { RoutePlanState } from '@app/interfaces/entities/erp-route-plan.entity';
import { colors } from '@core/constants/colors.constant';

type TRoutePlanState = {
  id: RoutePlanState;
  text: string;
};

export const ROUTE_PLAN_STATES: TRoutePlanState[] = [
  {
    id: '2_approved',
    text: 'Đã duyệt',
  },
  {
    id: '1x_to_approve',
    text: 'Chờ duyệt',
  },
  {
    id: '1_new',
    text: 'Mới',
  },
  {
    id: '3_cancel',
    text: 'Huỷ',
  },
];

export const ROUTE_PLAN_STATE_MAPPING = {
  '1_new': {
    name: 'Mới',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  '1x_to_approve': {
    name: 'Chờ duyệt',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  '2_approved': {
    name: 'Đã duyệt',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  '3_cancel': {
    name: 'Đã huỷ',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
};
