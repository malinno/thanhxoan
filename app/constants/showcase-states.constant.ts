import { ShowcaseState } from '@app/enums/showcase-state.enum';
import { colors } from '@core/constants/colors.constant';

export const SHOWCASE_STATE_MAPPING = {
  [ShowcaseState.draft]: {
    name: 'Nháp',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [ShowcaseState.confirm]: {
    name: 'Đã duyệt',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  [ShowcaseState.cancel]: {
    name: 'Đã huỷ',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
};
