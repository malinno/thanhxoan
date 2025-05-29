import HStack from '@app/components/HStack';
import SectionRow from '@app/components/SectionRow';
import { CustomerProduct } from '@app/interfaces/entities/customer-product.entity';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import PriceUtils from '@core/utils/PriceUtils';
import images from '@images';
import {
  Canvas,
  DashPathEffect,
  Line,
  Path,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import { identity } from 'lodash';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: CustomerProduct;
  onPress?: (data: CustomerProduct) => void;
}

const PurchasedProductItem: FC<Props> = React.memo(
  ({ index, data, onPress, style, ...props }) => {
    const _onPress = () => onPress?.(data);

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1} selectable>
            {data.name}
          </Text>
        </HStack>
        <View style={styles.separator} />
        <View style={styles.body}>
          <SectionRow
            leftIcons={[{ src: images.client.barcode }]}
            title="Mã vạch"
            titleProps={{ style: styles.rowTitle }}
            text={data.barcode || data.default_code}
            textProps={{ style: styles.rowText }}
            style={[styles.row, { marginTop: 0 }]}
          />
          <SectionRow
            leftIcons={[{ src: images.client.boxes }]}
            title="Số lượng"
            titleProps={{ style: styles.rowTitle }}
            text={data.product_uom_qty}
            textProps={{ style: styles.rowText }}
            style={styles.row}
          />
          {/* <SectionRow
            title="Người tạo"
            titleProps={{ style: styles.rowTitle }}
            text={data.barcode}
            textProps={{ style: styles.rowText }}
            style={styles.row}
          /> */}
          <SectionRow
            leftIcons={[{ src: images.client.coin }]}
            title="SO"
            titleProps={{ style: styles.rowTitle }}
            text={data.order_number}
            textProps={{ style: styles.rowText }}
            style={styles.row}
          />
          <SectionRow
            leftIcons={[{ src: images.client.tag }]}
            title="Đơn giá"
            titleProps={{ style: styles.rowTitle }}
            text={PriceUtils.format(data.price_unit)}
            textProps={{ style: styles.rowText }}
            style={styles.row}
          />

          <Canvas style={{ height: 1, marginTop: 12 }}>
            <Line
              p1={vec(0, 0.5)}
              p2={vec(dimensions.width - 64, 0.5)}
              strokeWidth={1}
              color={colors.colorE3E5E8}>
              <DashPathEffect intervals={[4, 4]} />
            </Line>
          </Canvas>

          <SectionRow
            title="Thành tiền"
            titleProps={{ style: [styles.rowTitle, { fontWeight: '700' }] }}
            text={PriceUtils.format(data.price_subtotal)}
            textProps={{
              style: [styles.rowText, { color: colors.color2651E5 }],
            }}
            style={styles.row}
          />
        </View>
      </Touchable>
    );
  },
);

export default PurchasedProductItem;

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: colors.colorEAEAEA,
    borderRadius: 16,
    backgroundColor: colors.white,
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
  row: {
    marginTop: 12,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  rowText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
