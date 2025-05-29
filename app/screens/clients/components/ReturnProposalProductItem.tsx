import HStack from '@app/components/HStack';
import Input from '@app/components/Input';
import InputNumber from '@app/components/InputNumber';
import QuantityAdjustment from '@app/components/QuantityAdjustment';
import { ProposalLineFormData } from '@app/hooks/useReturnProductForm';
import { ErpAccountTax } from '@app/interfaces/entities/return-product.entity';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import PriceUtils from '@core/utils/PriceUtils';
import images from '@images';
import React, { FC } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

interface Props extends ViewProps {
  index: number;
  data: ProposalLineFormData;
  onChange?: (index: number, data: Partial<ProposalLineFormData>) => void;
  onRemove?: (index: number, data: ProposalLineFormData) => void;
  isLastItem?: boolean;
  taxList?: ErpAccountTax[];
}

const ReturnProposalProductItem: FC<Props> = ({
  index,
  data,
  onChange,
  onRemove,
  style,
  isLastItem,
  taxList,
  ...props
}) => {
  const isPromotionLine = data.is_gift;

  const onChangeQty = (qty: string) => {
    console.log(`ReturnProposalProductItem`, qty);
    onChange?.(index, {
      product_uom_qty: Number(qty),
    });
  };

  const _onRemove = () => onRemove?.(index, data);

  const onPressTax = () => {
    if (!taxList) return;
    const options: Option[] = taxList?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn thuế',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        onChange?.(index, {
          tax_id: [{ id: Number(option.key), name: option.text }],
        });
      },
    });
  };

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100)}
      exiting={FadeOut}
      layout={Layout.springify().damping(15)}
      style={[style]}>
      <View style={styles.item}>
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
              <Text style={[styles.barcode]}>
                {data.product_id.default_code}
              </Text>
            </HStack>

            {isPromotionLine && (
              <Text style={styles.unit}>{data.product_id.default_code}</Text>
            )}
          </HStack>
          {/* {!isPromotionLine && (
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
            <Text style={styles.unit}>{data.product_id.default_code}</Text>
          </HStack>
        )} */}

          <HStack style={styles.row}>
            <View style={styles.subtotal}>
              {/* {!isNil(data.discount) && data.discount > 0 && (
                <Text style={styles.discountPrice}>
                  Giảm giá: {data.discount}%
                </Text>
              )} */}
              <Text
                style={[
                  styles.price,
                  isPromotionLine && { color: colors.red },
                ]}>
                {PriceUtils.format(data.price_subtotal)}
              </Text>
            </View>
            <QuantityAdjustment
              min={1}
              value={String(data.product_uom_qty)}
              onChangeText={onChangeQty}
              disabled={isPromotionLine}
            />
          </HStack>
        </View>
      </View>
      <Touchable onPress={() => onChange?.(index, { is_gift: !data.is_gift })}>
        <HStack style={[styles.row, { marginTop: 12 }]}>
          <Image
            source={
              data?.is_gift
                ? images.common.squareCheck
                : images.common.squareUncheck
            }
          />
          <View>
            <Text>Là quà tặng</Text>
          </View>
        </HStack>
      </Touchable>
      <View style={{ marginVertical: 10 }}>
        <InputNumber
          title="Giảm giá"
          placeholder="Chọn giảm giá"
          editable={true}
          value={data?.discount || 0}
          onChangeText={value =>
            onChange?.(index, { discount: Math.min(Number(value), 100) })
          }
          suffix="%"
          decimalPlaces={0}
          max={100}
          min={0}
        />
        <Input
          style={styles.input}
          title="Thuế"
          placeholder="Chọn thuế áp dụng"
          rightButtons={[{ icon: images.common.chevronForward }]}
          editable={false}
          value={data?.tax_id?.[0]?.name}
          onPress={onPressTax}
        />
        <Input
          style={styles.input}
          title="Ghi chú"
          placeholder="Nhập ghi chú"
          value={data.ghichu}
          onChangeText={value => onChange?.(index, { ghichu: value })}
        />
      </View>
      {!isLastItem && (
        <View style={[styles.separator, { marginTop: 18, marginBottom: 5 }]} />
      )}
    </Animated.View>
  );
};

export default ReturnProposalProductItem;

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
  input: {},
});
