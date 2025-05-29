import HStack from '@app/components/HStack';
import { StockInventoryLine } from '@app/interfaces/entities/stock-inventory-line.entity';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import React, { FC, memo } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  data: StockInventoryLine;
}

const StockInventoryLineItem: FC<Props> = memo(({ data, style, ...props }) => {
  return (
    <View style={[styles.item, style]}>
      <HStack style={styles.header}>
        <Text style={styles.productName}>{data.product_id.name}</Text>
        <Text style={styles.unit}>{data.product_id.uom_id?.[1]}</Text>
      </HStack>
      <View style={styles.separator} />
      <HStack style={styles.body}>
        <HStack style={{ flex: 1 }}>
          <Image source={images.common.barcode} tintColor={colors.primary} />
          <Text style={styles.barcodeText}>{data.product_id.barcode}</Text>
        </HStack>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantity}>{Number(data.count_qty)}</Text>
        </View>
      </HStack>
    </View>
  );
});

export default StockInventoryLineItem;

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
  },
  header: {
    paddingBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: colors.colorE3E5E8,
  },
  body: {
    paddingTop: 12,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.color161616,
  },
  barcode: {
    marginTop: 6,
  },
  barcodeText: {
    marginLeft: 8,
  },
  quantityContainer: {
    minWidth: 68,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.colorE7E7E7,
    borderRadius: 4,
  },
  quantity: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.color161616,
  },
  unit: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.color6B7A90,
    marginTop: 4,
  },
});
