import HStack from '@app/components/HStack';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { identity } from 'lodash';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: ErpCustomer;
  onPress?: (data: ErpCustomer) => void;
}

const AgencyItem: FC<Props> = React.memo(
  ({ index, data, onPress, style, ...props }) => {
    const _onPress = () => onPress?.(data);

    const address = [
      data.street,
      data.address_town_id?.[1],
      data.address_district_id?.[1],
      data.address_state_id?.[1],
    ]
      .filter(identity)
      .join(', ');

    const saleDisplayName = [
      data.crm_lead_user_id?.[1],
      data.crm_lead_team_id?.[1],
      data.crm_lead_crm_group_id?.[1],
    ]
      .filter(identity)
      .join(' - ');

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {data.name}
          </Text>
          <View style={[styles.state, { backgroundColor: colors.colorEAF4FB }]}>
            <Text style={[styles.stateText]} numberOfLines={1}>
              {data?.category?.[1]}
            </Text>
          </View>
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
              {data.representative || data?.name} - {data.phone}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.location} />
            <Text style={[styles.text]} numberOfLines={1}>
              {address}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.user} />
            <Text style={[styles.text]} numberOfLines={1}>
              {saleDisplayName}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.login} />
            <Text style={[styles.text]} numberOfLines={1}>
              Đã check in: {data?.checkin_last_days} ngày trước
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.calendar} />
            <Text style={[styles.text]} numberOfLines={1}>
              Có đơn {data?.order_last_days} ngày trước
            </Text>
          </HStack>
        </View>
      </Touchable>
    );
  },
);

export default AgencyItem;

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
  count: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    // color: colors.color3E7FFF,
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
