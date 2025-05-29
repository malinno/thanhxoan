import {
  TOptionComboGift,
  TOptionComboGiftLine,
  usePromotionGiftPickerForm,
} from '@app/hooks/usePromotionGiftPickerForm';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import { sumBy } from 'lodash';
import React, { FC } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import PromotionGiftProductItem from './PromotionGiftProductItem';

type Props = ViewProps & {
  line: TOptionComboGiftLine;
  index: number;
};

const PromotionProductPickerLine: FC<Props> = ({ line, index, ...props }) => {
  const data = usePromotionGiftPickerForm(state => state.data);
  const setData = usePromotionGiftPickerForm(state => state.setData);

  // console.log(
  //   `product ${line.applyProduct.name} purchased qty `,
  //   line.purchaseQty,
  // );

  // console.log(`redeemedQty`, line.redeemedQty)

  const onChangeItem = (itemIndex: number, item: TOptionComboGift) => {
    const newLines = [...data.options_combo_gifts];
    newLines[index].items[itemIndex].quantity = item.quantity;

    newLines[index].redeemedQty = sumBy(
      newLines[index].items,
      it => it.product_apply_quantity * it.quantity,
    );

    // console.log(`newLines[index].redeemedQty`, newLines[index].redeemedQty);

    for (const it of newLines[index].items) {
      it.combo_available = Math.floor(
        (newLines[index].purchaseQty!! - newLines[index].redeemedQty) /
          it.product_apply_quantity,
      );
    }

    setData({ options_combo_gifts: newLines });
  };

  return (
    <View style={styles.container} {...props}>
      <View style={styles.header}>
        <Text style={styles.lineLabel}>Quà tặng của sản phẩm</Text>
        <Text style={styles.lineTitle}>{line.applyProduct?.name}</Text>
      </View>

      {line.items?.map((item, index) => (
        <PromotionGiftProductItem
          key={item.id}
          data={item}
          index={index}
          onChange={onChangeItem}
        />
      ))}
    </View>
  );
};

export default PromotionProductPickerLine;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    borderRadius: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: colors.colorE9EEFC,
  },
  lineLabel: {
    fontWeight: '600',
  },
  lineTitle: {
    fontWeight: '600',
    color: colors.color2651E5,
  },
});
