import { TimekeepingExplanationState } from '@app/interfaces/entities/timekeeping-explanation.entity';
import { colors } from '@core/constants/colors.constant';

type TDisplayTimekeepingExplanation = {
  displayText: string;
  textColor: string;
  backgroundColor: string;
};

type TExplanationStateOption = {
  id: TimekeepingExplanationState;
  text: string;
};

export const TIMEKEEPING_EXPLANATION_STATES: TExplanationStateOption[] = [
  {
    id: '0_new',
    text: 'Mới',
  },
  {
    id: '1_confirmed',
    text: 'Đã xác nhận',
  },
  {
    id: '2_approved_first',
    text: 'Phê duyệt lần 1',
  },
  {
    id: '3_approved_second',
    text: 'Phê duyệt',
  },
  {
    id: '4_rejected',
    text: 'Từ chối',
  },
  {
    id: '5_canceled',
    text: 'Huỷ',
  },
];

export const TIMEKEEPING_EXPLANATION_STATE_MAPPING: Record<
  TimekeepingExplanationState,
  TDisplayTimekeepingExplanation
> = {
  '0_new': {
    displayText: 'Mới',
    textColor: colors.color8C6D00,
    backgroundColor: colors.colorFFECA7,
  },
  '1_confirmed': {
    displayText: 'Đã xác nhận',
    textColor: colors.color2651E5,
    backgroundColor: colors.colorEAF4FB,
  },
  '2_approved_first': {
    displayText: 'Phê duyệt 1',
    textColor: colors.color2651E5,
    backgroundColor: colors.colorEAF4FB,
  },
  '3_approved_second': {
    displayText: 'Phê duyệt',
    textColor: colors.color2651E5,
    backgroundColor: colors.colorEAF4FB,
  },
  '4_rejected': {
    displayText: 'Từ chối',
    textColor: colors.color2651E5,
    backgroundColor: colors.colorEAF4FB,
  },
  '5_canceled': {
    displayText: 'Huỷ',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
};
