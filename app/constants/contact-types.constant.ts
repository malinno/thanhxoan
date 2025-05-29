import { ContactType } from '@app/enums/contact-type.enum';
import { colors } from '@core/constants/colors.constant';

export const CONTACT_TYPES = [
  // {
  //   id: ContactType.contact,
  //   text: 'Liên hệ',
  // },
  {
    id: ContactType.delivery,
    text: 'Địa chỉ giao hàng',
  },
  {
    id: ContactType.other,
    text: 'Địa chỉ khác',
  },
  {
    id: ContactType.invoice,
    text: 'Địa chỉ xuất hoá đơn',
  },
  {
    id: ContactType.private,
    text: 'Địa chỉ cá nhân',
  },
];


export const CONTACT_TYPE_MAPPING: Record<ContactType, {
  name: string,
  backgroundColor: string,
  textColor: string,
}> = {
  [ContactType.contact]: {
    name: 'Liên hệ',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  [ContactType.delivery]: {
    name: 'Địa chỉ giao hàng',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  [ContactType.other]: {
    name: 'Địa chỉ khác',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  [ContactType.invoice]: {
    name: 'Địa chỉ xuất hoá đơn',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
  [ContactType.private]: {
    name: 'Địa chỉ cá nhân',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
};