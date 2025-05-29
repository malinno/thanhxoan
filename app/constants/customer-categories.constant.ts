import { CustomerCategoryType } from '@app/interfaces/entities/customer-category.type';
import { colors } from '@core/constants/colors.constant';

type CustomerCategory = {
  id: CustomerCategoryType;
  text: string;
};

export const CUSTOMER_CATEGORIES: CustomerCategory[] = [
  {
    id: 'undefined',
    text: 'Không xác định',
  },
  {
    id: 'distributor',
    text: 'Nhà phân phối',
  },
  {
    id: 'agency',
    text: 'Đại lý',
  },
];

export const CUSTOMER_CATEGORY_MAPPING: Record<CustomerCategoryType, {
  name: string,
  displayText: string,
  backgroundColor: string,
  textColor: string,
}> = {
  'undefined': {
    name: 'Không xác định',
    displayText: 'Không xác định',
    backgroundColor: colors.color1616161A,
    textColor: colors.color16161680,
  },
  distributor: {
    name: 'Nhà phân phối',
    displayText: 'NPP',
    backgroundColor: colors.colorEAF4FB,
    textColor: colors.color2651E5,
  },
  agency: {
    name: 'Đại lý',
    displayText: 'Đại lý',
    backgroundColor: colors.colorFFECA7,
    textColor: colors.color8C6D00,
  },
};
