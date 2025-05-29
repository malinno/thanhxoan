import CommonTagItem from '@app/components/CommonTagItem';
import CustomerCategoryView from '@app/components/CustomerCategoryView';
import HStack from '@app/components/HStack';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { identity, isEmpty, isNil } from 'lodash';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: ErpCustomer;
  onPress?: (data: ErpCustomer) => void;
}

const ClientItem: FC<Props> = React.memo(
  ({ index, data, onPress, style, ...props }) => {
    const _onPress = () => onPress?.(data);

    const address = [
      data.street2,
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
          <CustomerCategoryView category={data?.category} />
        </HStack>
        <View style={styles.separator} />
        <View style={styles.body}>
          <HStack style={[styles.row]}>
            <Image
              source={
                data.is_confirmed_info
                  ? images.client.verified
                  : images.client.ban
              }
              style={[
                data.is_confirmed_info
                  ? { tintColor: colors.primary }
                  : { tintColor: colors.color6B7A90 },
              ]}
            />
            <Text
              style={[
                styles.text,
                { fontWeight: '500' },
                data.is_confirmed_info
                  ? { color: colors.primary }
                  : { color: colors.color6B7A90 },
              ]}
              numberOfLines={1}>
              {data.is_confirmed_info
                ? `Đã xác thực thông tin`
                : `Chưa xác thực thông tin`}
            </Text>
          </HStack>
          <HStack style={[styles.row]}>
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
          {!isEmpty(data?.route_id) && (
            <HStack style={styles.row}>
              <Image source={images.othersTab.wayToPinLocation} />
              <HStack style={styles.optionsContainer}>
                {data?.route_id?.map((route, index) => {
                  return (
                    <CommonTagItem
                      key={route.id}
                      index={index}
                      data={[route.id, route.name]}
                      removable={false}
                    />
                  );
                })}
              </HStack>
            </HStack>
          )}
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

export default ClientItem;

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
    gap: 12,
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
    alignItems: 'flex-start',
  },
  text: {
    marginLeft: 16,
    flex: 1,
  },
  optionsContainer: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
