import { LeadState } from '@app/interfaces/entities/erp-lead.entity';
import { colors } from '@core/constants/colors.constant';

export const LEAD_STATE_MAPPING: Record<
  LeadState,
  {
    name: string;
    backgroundColor: string;
    textColor: string;
  }
> = {
  new: {
    name: 'Số mới',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  qualified: {
    name: 'Đã gọi',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  proposition: {
    name: 'Đơn đang xử lý',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  failed: {
    name: 'Đã đóng/huỷ',
    backgroundColor: colors.color1616161A,
    textColor: colors.color16161680,
  },
  won: {
    name: 'Thành công',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
};
