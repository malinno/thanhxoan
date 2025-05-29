import HStack from '@app/components/HStack';
import QuantityAdjustment from '@app/components/QuantityAdjustment';
import { TOptionComboGift } from '@app/hooks/usePromotionGiftPickerForm';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import React, { FC } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

type Props = ViewProps & {
  data: TOptionComboGift;
  index: number;
  separator?: boolean;
  onChange?: (index: number, data: TOptionComboGift) => void;
};

const PromotionGiftProductItem: FC<Props> = ({
  style,
  data,
  index,
  onChange,
  ...props
}) => {
  const onChangeQty = (qty: string) => {
    onChange?.(index, {
      ...data,
      quantity: Number(qty),
    });
  };

  return (
    <View style={[styles.productItem, style]} {...props}>
      <Text style={styles.productName}>{data.description}</Text>
      <HStack style={{ gap: 12 }}>
        <Text style={styles.maxQty}>Tối đa: {data.combo_maximum}</Text>
        <Text style={styles.availableQty}>
          Có thể chọn:{' '}
          <Text
            style={[
              styles.availableQty,
              { fontWeight: '600', color: colors.primary },
            ]}>
            {data.combo_available}
          </Text>
        </Text>
      </HStack>
      <HStack style={{ gap: 12 }}>
        <Text style={styles.qty}>Số lượng</Text>
        <QuantityAdjustment
          value={String(data.quantity)}
          onChangeText={onChangeQty}
          max={data.combo_available + data.quantity}
          // editable={false}
        />
      </HStack>
    </View>
  );
};

export default PromotionGiftProductItem;

const styles = StyleSheet.create({
  productItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  productName: {
    fontWeight: '600',
  },
  maxQty: {
    flex: 1,
  },
  availableQty: {},
  qty: {
    flex: 1,
  },
});
