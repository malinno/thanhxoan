import HStack from '@app/components/HStack';
import { SaleOrderLine } from '@app/interfaces/entities/sale-order-line.entity';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import PriceUtils from '@core/utils/PriceUtils';
import { Canvas, DashPathEffect, Line, vec } from '@shopify/react-native-skia';
import React, { FC, memo } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  data: SaleOrderLine;
  index: number;
}

const SaleOrderDetailLine: FC<Props> = memo(
  ({ index, data, style, ...props }) => {
    const isPromotionLine =
      data.is_gift || data.is_bonus || data.is_sanpham_khuyen_mai;
    return (
      <View style={[styles.item, style]} {...props}>
        {!!index && (
          <Canvas style={{ height: 1, marginVertical: 12 }}>
            <Line
              p1={vec(0, 0.5)}
              p2={vec(dimensions.width - 64, 0.5)}
              strokeWidth={1}
              color={colors.colorE3E5E8}>
              <DashPathEffect intervals={[4, 4]} />
            </Line>
          </Canvas>
        )}

        <HStack style={[styles.row, { marginTop: 0 }]}>
          <Text style={styles.name}>{data.product_id?.name}</Text>
          <Text style={styles.unit}>{data.product_uom?.[1]}</Text>
        </HStack>

        <HStack style={styles.row}>
          {isPromotionLine ? (
            <Text
              style={[
                styles.unitPrice,
                styles.price,
                { color: colors.red, marginTop: 0 },
              ]}>
              {PriceUtils.format(data.price_subtotal)}
            </Text>
          ) : (
            <Text style={styles.unitPrice}>
              {PriceUtils.format(data.price_unit)}
            </Text>
          )}
          <Text style={styles.quantity}>
            x{PriceUtils.format(data.product_uom_qty, '')}
          </Text>
        </HStack>

        {!isPromotionLine && (
          <Text style={styles.price}>
            {PriceUtils.format(data.price_subtotal)}
          </Text>
        )}
      </View>
    );
  },
);

export default SaleOrderDetailLine;

const styles = StyleSheet.create({
  item: {},
  row: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.color161616,
  },
  unit: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.color6B7A90,
  },
  unitPrice: {
    flex: 1,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.color2651E5,
  },
  price: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.colorFF7F00,
  },
});
