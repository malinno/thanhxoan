import HStack from '@app/components/HStack';
import { POS_ORDER_STATE_MAPPING } from '@app/constants/pos-orders.constant';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { PosOrder } from '@app/interfaces/entities/pos-order.entity';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import dayjs from 'dayjs';
import { identity, isNil } from 'lodash';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: PosOrder;
  onPress?: (data: PosOrder) => void;
}

const PosOrderItem: FC<Props> = React.memo(
  ({ index, data, onPress, style, ...props }) => {
    const _onPress = () => onPress?.(data);

    // const address = [
    //   data.street,
    //   data.address_town_id?.[1],
    //   data.address_district_id?.[1],
    //   data.address_state_id?.[1],
    // ]
    //   .filter(identity)
    //   .join(', ');

    const createDate = data.create_date
      ? dayjs(data.create_date).format('DD/MM/YY HH:mm')
      : '';
    const saleDate = data.sale_date
      ? dayjs(data.sale_date).format('DD/MM/YY HH:mm')
      : '';

    const saleDisplayName = [data.user_id?.[1], data.team_id?.[1]]
      .filter(identity)
      .join(' - ');

    const state = data?.state
      ? POS_ORDER_STATE_MAPPING[data?.state]
      : undefined;

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <HStack style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>
              {data.name}
            </Text>
            <Text style={styles.creationTime} numberOfLines={1}>
              {createDate}
            </Text>
          </View>
          {!isNil(state) && (
            <View
              style={[
                styles.state,
                { backgroundColor: state.backgroundColor },
              ]}>
              <Text
                style={[styles.stateText, { color: state.textColor }]}
                numberOfLines={1}>
                {state?.name}
              </Text>
            </View>
          )}
        </HStack>
        <View style={styles.separator} />
        <View style={styles.body}>
          <HStack style={[styles.row, { marginTop: 0 }]}>
            <Image source={images.client.call} />
            <Text
              style={[
                styles.text,
                { fontWeight: '700', color: colors.primary },
              ]}
              numberOfLines={1}>
              {data.receiver_name} - {data.phone}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.store} />
            <Text style={[styles.text]} numberOfLines={1}>
              {data.partner_id?.[1]}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.user} />
            <Text style={[styles.text]} numberOfLines={1}>
              {saleDisplayName}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.shipping} />
            <Text style={[styles.text]} numberOfLines={1}>
              {saleDate}
            </Text>
          </HStack>
        </View>
      </Touchable>
    );
  },
);

export default PosOrderItem;

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
  creationTime: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '400',
    color: colors.color6B7A90,
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
    paddingVertical: 16,
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
    maxWidth: Number(90).adjusted(),
  },
  row: {
    marginTop: 12,
  },
  text: {
    marginLeft: 16,
    flex: 1,
  },
});
