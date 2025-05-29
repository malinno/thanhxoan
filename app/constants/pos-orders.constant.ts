import { PosOrderState } from '@app/enums/pos-order-state.enum';
import { colors } from '@core/constants/colors.constant';

type TPosOrderState = {
  id: PosOrderState;
  text: string;
};

export const POS_ORDER_STATES: TPosOrderState[] = [
  {
    id: PosOrderState.quotation,
    text: 'Báo giá',
  },
  {
    id: PosOrderState.to_approved,
    text: 'Chờ duyệt',
  },
  {
    id: PosOrderState.confirm,
    text: 'Đã xác nhận',
  },
  {
    id: PosOrderState.approved,
    text: 'Đã duyệt',
  },
  {
    id: PosOrderState.to_shipping,
    text: 'Chờ giao',
  },
  {
    id: PosOrderState.shipping,
    text: 'Đang giao',
  },
  {
    id: PosOrderState.sale,
    text: 'Hoàn thành',
  },
  {
    id: PosOrderState.cancel,
    text: 'Đã huỷ',
  },
];

export const POS_ORDER_STATE_MAPPING = {
  [PosOrderState.quotation]: {
    name: 'Báo giá',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  [PosOrderState.to_approved]: {
    name: 'Chờ duyệt',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  [PosOrderState.confirm]: {
    name: 'Đã xác nhận',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [PosOrderState.approved]: {
    name: 'Đã duyệt',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [PosOrderState.to_shipping]: {
    name: 'Chờ giao',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [PosOrderState.shipping]: {
    name: 'Đang giao',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [PosOrderState.sale]: {
    name: 'Hoàn thành',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [PosOrderState.cancel]: {
    name: 'Huỷ',
    backgroundColor: colors.colorDCDCDC,
    textColor: colors.color161616,
  },
};
