import { CheckInState, SlaState } from '@app/enums/check-in-state.enum';
import { colors } from '@core/constants/colors.constant';

export const CHECK_IN_STATES = [
  {
    id: CheckInState.inprogress,
    text: 'Đang check in',
  },
  {
    id: CheckInState.checked,
    text: 'Đã check out',
  },
];

export const CHECK_IN_STATE_MAPPING = {
  [CheckInState.inprogress]: {
    name: 'Đang check in',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  [CheckInState.checked]: {
    name: 'Đã check out',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
};

export const SLA_CHECK_IN_STATES = [
  {
    id: SlaState.unresolved,
    text: 'Không đạt',
  },
  {
    id: SlaState.resolved,
    text: 'Đạt',
  },
]