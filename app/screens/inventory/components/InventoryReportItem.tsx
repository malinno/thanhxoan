import HStack from '@app/components/HStack';
import { AvailableInventoryReport } from '@app/interfaces/entities/available-inventory-report.entity';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import React, { FC, memo } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  index?: number;
  data: AvailableInventoryReport;
}

const InventoryReportItem: FC<Props> = memo(props => {
  const { data } = props;

  return (
    <View style={styles.item}>
      <HStack style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {data.product_id?.name}
        </Text>
      </HStack>
      <View style={styles.separator} />

      <View style={styles.body}>
        <HStack>
          <Image source={images.client.barcode} />
          <Text style={[styles.barcode]}>{data.product_id?.barcode}</Text>
        </HStack>
        
        <Text style={styles.unit}>
          Tồn kho thực tế: {data.qty_beginning_period} {data.uom_id?.name}
        </Text>
        <Text style={styles.unit}>
          Tồn kho dự báo: {data.qty_ending_period} {data.uom_id?.name}
        </Text>
      </View>
    </View>
  );
});

export default InventoryReportItem;

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
    gap: 4,
  },
  barcode: {
    marginLeft: 8,
  },
  price: {},
  unit: {},
});
