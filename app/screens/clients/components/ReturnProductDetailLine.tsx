import HStack from '@app/components/HStack';
import { ProposalLine } from '@app/interfaces/entities/return-product.entity';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import PriceUtils from '@core/utils/PriceUtils';
import images from '@images';
import { Canvas, DashPathEffect, Line, vec } from '@shopify/react-native-skia';
import React, { FC, memo } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  data: ProposalLine;
  index: number;
}

const ReturnProductDetailLine: FC<Props> = memo(
  ({ index, data, style, ...props }) => {
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
          <Text style={styles.quantity}>
            x{PriceUtils.format(data.product_uom_qty, '')}{' '}
            {data.product_uom?.name}
          </Text>
        </HStack>

        {/* <HStack>
          <Text style={styles.price}>{PriceUtils.format(999)}</Text>
        </HStack> */}
        <HStack style={[styles.row, { marginTop: 12 }]}>
          <Image
            source={
              data?.is_gift
                ? images.common.squareCheck
                : images.common.squareUncheck
            }
          />
          <View style={{ marginLeft: 10 }}>
            <Text>Là quà tặng</Text>
          </View>
        </HStack>
        <HStack style={[styles.row, { marginTop: 12 }]}>
          <Text style={styles.name}>Discount (%)</Text>
          <Text style={styles.quantity}>
            {PriceUtils.format(data.discount, '')}
          </Text>
        </HStack>
        <HStack style={[styles.row, { marginTop: 12 }]}>
          <Text style={styles.label}>Thuế</Text>
          <Text style={styles.quantity}>{data?.tax_id?.[0]?.name}</Text>
        </HStack>
        <HStack style={[styles.row, { marginTop: 12 }]}>
          <Text style={styles.label}>Ghi chú</Text>
          <Text style={styles.quantity}>{data?.ghichu}</Text>
        </HStack>
        <HStack style={[styles.row, { marginTop: 12 }]}>
          <Text style={styles.label}>Đã hoàn</Text>
          <Text style={styles.quantity}>{data?.product_uom_returned_qty}</Text>
        </HStack>
        <HStack style={[styles.row, { marginTop: 12 }]}>
          <Text style={styles.label}>Đã lên đơn trả</Text>
          <Text style={styles.quantity}>{data?.product_uom_order_qty}</Text>
        </HStack>
        <HStack style={[styles.row, { marginTop: 12 }]}>
          <Text style={styles.label}>Đã trả</Text>
          <Text style={styles.quantity}>{data?.product_uom_returned_qty}</Text>
        </HStack>
      </View>
    );
  },
);

export default ReturnProductDetailLine;

const styles = StyleSheet.create({
  item: {
    gap: 8,
  },
  row: {
    alignItems: 'flex-start',
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.colorFF7F00,
  },
  freeQty: {
    flex: 1,
    textAlign: 'right',
  },
  label: {
    flex: 1,
  },
});
