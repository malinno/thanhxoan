import HStack from '@app/components/HStack';
import { ErpProduct } from '@app/interfaces/entities/erp-product.entity';
import Alert from '@core/components/popup/Alert';
import { ALERT_BUTTON_TYPE } from '@core/components/popup/AlertPopup';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import PriceUtils from '@core/utils/PriceUtils';
import images from '@images';
import React, { FC, memo } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';

export type TProductPickerItem = ErpProduct & {
  isSelected?: boolean;
};

interface Props extends ViewProps {
  index?: number;
  data: TProductPickerItem;
  onPress?: (data: TProductPickerItem) => void;
  disabled?: boolean;
}

const ProductPickerItem: FC<Props> = memo(props => {
  const { data, onPress, disabled } = props;
  const isSelected = data.isSelected;
  const unit = Number(data?.current_free_qty) || 0;
  const _onPress = () => {
    if (unit <= 0) {
      return Alert.alert({
        title: 'Thông báo',
        message: 'Sản phẩm đã hết hàng',
        actions: [
          {
            text: 'OK',
            type: ALERT_BUTTON_TYPE.NORMAL,
          },
        ],
      });
    }
    onPress?.(data);
  };

  return (
    <Touchable onPress={_onPress} style={styles.item} disabled={disabled}>
      <View
        style={[
          styles.circle,
          isSelected && { backgroundColor: colors.primary },
        ]}>
        <Image
          style={styles.checkIcon}
          source={images.common.check}
          resizeMode="contain"
        />
      </View>

      <HStack style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {data.name}
        </Text>
      </HStack>
      <View style={styles.separator} />

      <View style={styles.body}>
        <HStack>
          <Image source={images.client.barcode} />

          <Text style={[styles.barcode]}>{data.barcode}</Text>
        </HStack>
        <HStack>
          <Text style={styles.price}>{PriceUtils.format(data.list_price)}</Text>
          <Text
            style={[
              styles.unit,
              { color: unit <= 0 ? colors.red : colors.primary },
            ]}>
            {unit <= 0 ? 'Hết hàng' : `Tồn kho ${unit} ${data?.uom_id?.[1]}`}
          </Text>
        </HStack>
      </View>
    </Touchable>
  );
});

export default ProductPickerItem;

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  name: {
    flex: 1,
    marginRight: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.color161616,
  },
  separator: {
    height: 1,
    backgroundColor: colors.colorE3E5E8,
  },
  body: {
    paddingVertical: 16,
  },
  barcode: {
    marginLeft: 8,
  },
  price: {
    marginTop: 4,
  },
  unit: {
    marginTop: 4,
    marginLeft: 10,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.color22222226,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    transform: [
      {
        translateX: 10,
      },
      {
        translateY: 10,
      },
    ],
  },
  checkIcon: {
    transform: [
      {
        translateX: -4,
      },
      {
        translateY: -4,
      },
    ],
  },
});
