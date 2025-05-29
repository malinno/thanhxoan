import { ShippingAddressType } from '@app/enums/shipping-address-type.enum';

type TShippingAddressType = {
  id: ShippingAddressType;
  text: string;
};

export const SHIPPING_ADDRESS_TYPES: TShippingAddressType[] = [
  {
    id: ShippingAddressType.inner,
    text: 'Nội thành',
  },
  {
    id: ShippingAddressType.outer,
    text: 'Ngoại thành',
  },
];

export const SHIPPING_ADDRESS_TYPE_MAPPING: Record<
  ShippingAddressType,
  string
> = {
  [ShippingAddressType.outer]: 'Ngoại thành',
  [ShippingAddressType.inner]: 'Nội thành',
};
