import CustomerCategoryView from '@app/components/CustomerCategoryView';
import HStack from '@app/components/HStack';
import { SCREEN } from '@app/enums/screen.enum';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { ErpSlaCheckin } from '@app/interfaces/entities/erp-sla-checkin.entity';
import Button from '@core/components/Button';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { identity } from 'lodash';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  sla?: ErpSlaCheckin;
  data: ErpCustomer;
  onPress?: (data: ErpCustomer) => void;
}

const CheckInOutCustomerView: FC<Props> = React.memo(
  ({ sla, data, onPress, style, ...props }) => {
    const navigation = useNavigation();

    const _onPress = () => onPress?.(data);

    const address = [
      data.street2,
      data.address_town_id?.[1],
      data.address_district_id?.[1],
      data.address_state_id?.[1],
    ]
      .filter(identity)
      .join(', ');

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1} selectable>
            {data.name}
          </Text>
          <CustomerCategoryView category={data?.category} />
        </HStack>
        <View style={styles.separator} />
        <View style={styles.body}>
          <HStack style={[styles.row, { marginTop: 0 }]}>
            <Image source={images.client.call} style={[styles.icon]} />
            <Text
              style={[
                styles.text,
                { fontWeight: '500', color: colors.primary },
              ]}
              numberOfLines={1}>
              {data.representative || data?.name} - {data.phone}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.location} style={[styles.icon]} />
            <Text style={[styles.text]}>{address}</Text>
          </HStack>
          {!!data.checkin_last_days && (
            <HStack style={styles.row}>
              <Image source={images.client.login} style={[styles.icon]} />
              <Text style={[styles.text]} numberOfLines={1}>
                Đã check in: {data.checkin_last_days} ngày trước
              </Text>
            </HStack>
          )}
          {!!sla?.name && (
            <HStack style={styles.row}>
              <Image source={images.client.ribbon} style={[styles.icon]} />
              <Text style={[styles.text]} numberOfLines={1}>
                SLA Code: {sla?.name}
              </Text>
            </HStack>
          )}
        </View>
      </Touchable>
    );
  },
);

export default CheckInOutCustomerView;

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
    alignItems: 'flex-start',
  },
  icon: {
    marginTop: 2,
  },
  text: {
    marginLeft: 16,
    flex: 1,
  },
  distance: {
    marginLeft: 12,
    color: colors.color2745D4,
  },
});
