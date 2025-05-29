import { AnimatedCheckbox } from '@core/components/Checkbox';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import LayoutUtils from '@core/utils/LayoutUtils';
import images from '@images';
import React, { FunctionComponent } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { isEmpty, isNil } from 'lodash';
import { colors } from '@core/constants/colors.constant';
import { StockInventory } from '@app/interfaces/entities/stock-inventory.entity';
import dayjs from 'dayjs';
import { STOCK_INVENTORY_STATE_MAPPING } from '@app/constants/stock-inventory-states.constant';

interface Props extends ViewProps {
  index: number;
  data?: StockInventory;
  onPress?: (data: StockInventory) => void;
}

const StockInventoryItem: FunctionComponent<Props> = React.memo(
  ({ index, data, onPress, style, ...props }) => {
    if (isNil(data)) return null;
    
    const _onPress = () => onPress?.(data);

    const status = STOCK_INVENTORY_STATE_MAPPING[data.state];

    //   const locations = data.location_ids?.map(location => location.name);

    const date = data.start_date
      ? dayjs(data.start_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
      : '';

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.count}>{data.count_products} sản phẩm</Text>
          </View>
          <View
            style={[styles.state, { backgroundColor: status.backgroundColor }]}>
            <Text style={[styles.stateText, { color: status.textColor }]}>
              {status.displayText}
            </Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.body}>
          <View style={styles.row}>
            <Image style={styles.icon} source={images.client.store} />
            <Text style={[styles.text, styles.boldText]}>
              {data?.agency_id?.[1]}
            </Text>
          </View>

          {/* {!isNil(locations) && !isEmpty(locations) && (
          <View style={styles.row}>
            <Image style={styles.icon} source={images.common.file} />
            <Text style={styles.text}>Địa điểm: {locations.join(', ')}</Text>
          </View>
        )} */}
          <View style={styles.row}>
            <Image style={styles.icon} source={images.client.user} />
            <Text style={[styles.text, styles.boldText]}>
              Kiểm kê bởi: {data.user_id?.[1]}
            </Text>
          </View>
          {/* {Boolean(data.note) && (
          <View style={styles.row}>
            <Image style={styles.icon} source={images.common.file} />
            <Text style={styles.text}>Ghi chú: {data.note}</Text>
          </View>
        )} */}

          <View style={styles.row}>
            <Image style={styles.icon} source={images.client.calendar} />
            <Text style={styles.text}>Ngày kiểm kê: {date}</Text>
          </View>
        </View>
      </Touchable>
    );
  },
);

export default StockInventoryItem;

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: colors.colorEAEAEA,
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 9,
  },
  nameContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.color161616,
  },
  count: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.color3E7FFF,
  },
  status: {
    padding: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.colorE3E5E8,
  },
  body: {
    paddingTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: colors.color161616,
    marginLeft: 12,
  },
  boldText: {
    fontWeight: '500',
  },
  state: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
