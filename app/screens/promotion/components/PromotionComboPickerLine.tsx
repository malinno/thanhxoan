import CheckCircle from '@app/components/CheckCircle';
import HStack from '@app/components/HStack';
import { TComboGiftLine } from '@app/hooks/usePromotionGiftPickerForm';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import React, { FC } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

type Props = Omit<TouchableProps, 'onPress'> & {
  data: TComboGiftLine;
  index: number;
  onPress?: (data: TComboGiftLine, index: number) => void;
};

const PromotionComboPickerLine: FC<Props> = ({
  data,
  index,
  style,
  onPress,
  ...props
}) => {
  const _onPress = () => onPress?.(data, index);

  return (
    <Touchable style={[styles.item, style]} onPress={_onPress} {...props}>
      <CheckCircle isSelected={data.selected} />

      <View style={styles.productLine}>
        <HStack style={styles.productQtyLine}>
          <Text style={styles.qtyLabel}>Mua sản phẩm</Text>
          <Text style={styles.productQty}></Text>
        </HStack>
        <Text style={styles.productName}>
          {data.product_apply_ids.map(pr => pr.name).join(', ')}
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.productLine}>
        <Text style={styles.label}>Tặng sản phẩm</Text>
        <Text style={styles.productName}>{data.description}</Text>
      </View>
    </Touchable>
  );
};

export default PromotionComboPickerLine;

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productLine: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  productQtyLine: {
    gap: 12,
  },
  qtyLabel: {
    fontWeight: '600',
  },
  productQty: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '600',
  },
  productName: {
    fontWeight: '600',
    color: colors.color2651E5,
    paddingRight: 24,
  },
  label: {
    fontWeight: '600',
    color: colors.red,
  },
  separator: {
    height: 1,
    backgroundColor: colors.colorEFF0F4,
  },
});
