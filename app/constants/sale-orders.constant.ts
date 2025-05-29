import { SaleOrderState } from '@app/enums/sale-order.state.enum';
import { colors } from '@core/constants/colors.constant';
import { Route } from 'react-native-tab-view';

export type TSaleOrdersRoute = Route & {
  statues?: SaleOrderState[];
};

export type TSaleOrderState = {
  id: SaleOrderState;
  text: string;
};

export const SALE_ORDER_STATES: TSaleOrderState[] = [
  {
    id: SaleOrderState.rfq,
    text: 'Báo giá',
  },
  {
    id: SaleOrderState.paid,
    text: 'Đã thanh toán',
  },
  {
    id: SaleOrderState.verified,
    text: 'Đã xác thực',
  },
  {
    id: SaleOrderState.confirmed,
    text: 'Đã xác nhận',
  },
  {
    id: SaleOrderState.shipping,
    text: 'Đang giao',
  },
  {
    id: SaleOrderState.reshipping,
    text: 'Đang giao lại',
  },
  {
    id: SaleOrderState.returning,
    text: 'Đang hoàn',
  },
  {
    id: SaleOrderState.returned,
    text: 'Đã hoàn',
  },
  {
    id: SaleOrderState.completed,
    text: 'Thành công',
  },
  {
    id: SaleOrderState.cancel,
    text: 'Đã huỷ',
  },
];

export const SALE_ORDER_STATE_MAPPING = {
  [SaleOrderState.rfq]: {
    name: 'Báo giá',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  [SaleOrderState.paid]: {
    name: 'Đã thanh toán',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  [SaleOrderState.verified]: {
    name: 'Đã xác thực',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  [SaleOrderState.confirmed]: {
    name: 'Đã xác nhận',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [SaleOrderState.chogiao]: {
    name: 'Chờ giao',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [SaleOrderState.shipping]: {
    name: 'Đang giao',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [SaleOrderState.to_reship]: {
    name: 'Yêu cầu giao lại',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  
  [SaleOrderState.chogiaolai]: {
    name: 'Chờ giao lại',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [SaleOrderState.reshipping]: {
    name: 'Đang giao lại',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [SaleOrderState.returning]: {
    name: 'Đang hoàn',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [SaleOrderState.returned]: {
    name: 'Đã hoàn',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [SaleOrderState.completed]: {
    name: 'Thành công',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [SaleOrderState.cancel]: {
    name: 'Huỷ',
    backgroundColor: colors.colorDCDCDC,
    textColor: colors.color161616,
  },
};

export const SALE_ORDER_TAB_ROUTES: TSaleOrdersRoute[] = [
  {
    key: 'all',
    title: 'Tất cả',
  },
  {
    key: 'rfq',
    title: 'Báo giá',
    statues: [SaleOrderState.rfq],
  },
  {
    key: 'paid',
    title: 'Thanh toán',
    statues: [
      SaleOrderState.verified,
      SaleOrderState.paid,
      SaleOrderState.confirmed,
    ],
  },
  {
    key: 'complete',
    title: 'Hoàn thành',
    statues: [SaleOrderState.completed],
  },
  {
    key: 'return',
    title: 'Hoàn hàng',
    statues: [SaleOrderState.returning, SaleOrderState.returned],
  },
  {
    key: 'cancel',
    title: 'Huỷ',
    statues: [SaleOrderState.cancel],
  },
  {
    key: 'reship',
    title: 'Giao lại',
    statues: [
      SaleOrderState.to_reship,
      SaleOrderState.chogiao,
      SaleOrderState.shipping,
      SaleOrderState.chogiaolai,
      SaleOrderState.reshipping,
    ],
  },
];
