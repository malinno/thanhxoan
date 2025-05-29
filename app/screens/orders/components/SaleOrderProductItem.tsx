import HStack from '@app/components/HStack';
import QuantityAdjustment from '@app/components/QuantityAdjustment';
import { DEFAULT_HIT_SLOP } from '@app/constants/app.constant';
import { SaleOrderLine } from '@app/interfaces/entities/sale-order-line.entity';
import Popup, { POPUP_TYPE } from '@core/components/popup/Popup';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import PriceUtils from '@core/utils/PriceUtils';
import images from '@images';
import { isNil } from 'lodash';
import React, { FC } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import EditOrderLinePricing, {
  TOrderLinePricingPayload,
} from './EditOrderLinePricing';

interface Props extends ViewProps {
  index: number;
  data: SaleOrderLine;
  onChange?: (index: number, data: Partial<SaleOrderLine>) => void;
  onRemove?: (index: number, data: SaleOrderLine) => void;
}

const SaleOrderProductItem: FC<Props> = ({
  index,
  data,
  onChange,
  onRemove,
  style,
  ...props
}) => {
  const isPromotionLine =
    data.is_gift || data.is_bonus || data.is_sanpham_khuyen_mai;

  const onChangeQty = (qty: string) => {
    onChange?.(index, {
      product_uom_qty: Number(qty),
    });
  };

  const _onRemove = () => onRemove?.(index, data);

  const _onPressEditUnitPricing = () => {
    Popup.show({
      type: POPUP_TYPE.BOTTOM_SHEET,
      props: {
        title: 'Sửa đơn giá',
        keyboardOffset: 100,
        renderContent: () => {
          const onSubmit = (payload: TOrderLinePricingPayload) => {
            onChange?.(index, {
              price_unit: payload.unit_price,
              discount: payload.discount,
            });
          };
          return (
            <EditOrderLinePricing
              unit_price={data.price_unit}
              discount={data.discount}
              onSubmit={onSubmit}
            />
          );
        },
      },
    });
  };

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100)}
      exiting={FadeOut}
      layout={Layout.springify().damping(15)}
      style={[styles.item, style]}>
      <HStack style={styles.header}>
        <Text style={styles.name}>{data.product_id?.name}</Text>
        {!isPromotionLine && (
          <Touchable style={styles.removeBtn} onPress={_onRemove}>
            <Image
              source={images.common.close}
              style={styles.removeIcon}
              resizeMode="contain"
            />
          </Touchable>
        )}
      </HStack>
      <View style={styles.separator} />
      <View style={styles.body}>
        <HStack>
          <HStack style={{ flex: 1 }}>
            <Image source={images.client.barcode} />
            <Text style={[styles.barcode]}>{data.product_id.barcode}</Text>
          </HStack>

          {isPromotionLine && (
            <Text style={styles.unit}>{data.product_uom?.[1]}</Text>
          )}
        </HStack>
        {!isPromotionLine && (
          <HStack style={styles.row}>
            <HStack
              style={styles.unitPriceContainer}
              hitSlop={DEFAULT_HIT_SLOP}
              onPress={_onPressEditUnitPricing}
              disabled={isPromotionLine}>
              {!isPromotionLine && (
                <Image source={images.client.edit} style={styles.editIcon} />
              )}
              <Text style={styles.unitPrice}>
                {PriceUtils.format(data.price_unit)}
              </Text>
            </HStack>
            <Text style={styles.unit}>{data.product_uom?.[1]}</Text>
          </HStack>
        )}

        <HStack style={styles.row}>
          <View style={styles.subtotal}>
            {!isNil(data.discount) && data.discount > 0 && (
              <Text style={styles.discountPrice}>
                Giảm giá: {data.discount}%
              </Text>
            )}
            <Text
              style={[styles.price, isPromotionLine && { color: colors.red }]}>
              {PriceUtils.format(data.price_subtotal)}
            </Text>
          </View>
          <QuantityAdjustment
            min={1}
            value={String(data.product_uom_qty)}
            onChangeText={onChangeQty}
            disabled={isPromotionLine}
            max={data.product_uom_qty}
          />
        </HStack>
      </View>
    </Animated.View>
  );
};

export default SaleOrderProductItem;

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
  },
  header: {
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingBottom: 8,
  },
  name: {
    flex: 1,
    marginRight: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.color161616,
  },
  removeBtn: {},
  removeIcon: {
    width: 24,
    height: 24,
    tintColor: colors.color1818196B,
  },
  separator: {
    height: 1,
    backgroundColor: colors.colorEFF0F4,
  },
  body: {
    paddingVertical: 16,
  },
  barcode: {
    marginLeft: 8,
  },
  row: {
    marginTop: 8,
    gap: 12,
  },
  unitPriceContainer: {
    gap: 6,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: colors.primary,
  },
  unitPrice: {
    flex: 1,
  },
  subtotal: {
    flex: 1,
    gap: 6,
  },
  discountPrice: {
    fontSize: 12,
    color: colors.color777878,
  },
  price: {
    fontWeight: '600',
    color: colors.colorFF7F00,
  },
  unit: {
    width: 52 + 25 * 2 + 8 * 2,
    textAlign: 'center',
    color: colors.color6B7A90,
  },
});
