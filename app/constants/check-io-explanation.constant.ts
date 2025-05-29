import { CheckIOExplanationStatus } from '@app/enums/check-io-explanation-status.enum';
import { colors } from '@core/constants/colors.constant';

export const CHECK_IO_EXPLANATION_STATUSES = [
  {
    id: CheckIOExplanationStatus.new,
    text: 'Mới',
  },
  {
    id: CheckIOExplanationStatus.confirmed,
    text: 'Đã xác nhận',
  },
  {
    id: CheckIOExplanationStatus.approved_first,
    text: 'Phê duyệt 1',
  },
  {
    id: CheckIOExplanationStatus.approved_second,
    text: 'Phê duyệt 2',
  },
  {
    id: CheckIOExplanationStatus.rejected,
    text: 'Từ chối',
  },
  {
    id: CheckIOExplanationStatus.canceled,
    text: 'Huỷ',
  },
];

export const CHECK_IO_EXPLANATION_STATUS_MAPPING = {
  [CheckIOExplanationStatus.new]: {
    displayText: 'Mới',
    textColor: colors.color8C6D00,
    backgroundColor: colors.colorFFECA7,
  },
  [CheckIOExplanationStatus.approved_first]: {
    displayText: 'Phê duyệt 1',
    textColor: colors.color2651E5,
    backgroundColor: colors.colorEAF4FB,
  },
  [CheckIOExplanationStatus.approved_second]: {
    displayText: 'Phê duyệt 2',
    textColor: colors.color2651E5,
    backgroundColor: colors.colorEAF4FB,
  },
  [CheckIOExplanationStatus.confirmed]: {
    displayText: 'Đã xác nhận',
    textColor: colors.color2651E5,
    backgroundColor: colors.colorEAF4FB,
  },
  [CheckIOExplanationStatus.rejected]: {
    displayText: 'Từ chối',
    textColor: colors.color2651E5,
    backgroundColor: colors.colorEAF4FB,
  },
  [CheckIOExplanationStatus.canceled]: {
    displayText: 'Huỷ',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
};
