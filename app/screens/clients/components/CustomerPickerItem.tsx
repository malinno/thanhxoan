import HStack from '@app/components/HStack';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { identity } from 'lodash';
import React, { FC, memo } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';

export type TCustomerPickerItem = ErpCustomer & {
  isSelected?: boolean;
};

interface Props extends ViewProps {
  index?: number;
  data: TCustomerPickerItem;
  onPress?: (data: TCustomerPickerItem) => void;
}

const CustomerPickerItem: FC<Props> = memo(props => {
  const { data, onPress } = props;
  const isSelected = data.isSelected;

  const _onPress = () => onPress?.(data);

  const names = [data.representative || data?.name, data.phone]
    .filter(identity)
    .join(' - ');

  const address = [
    data?.street2,
    data?.address_town_id?.[1],
    data?.address_district_id?.[1],
    data?.address_state_id?.[1],
  ]
    .filter(identity)
    .join(', ');

  return (
    <Touchable onPress={_onPress} style={styles.item}>
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
        <Text style={[styles.text, { marginTop: 0 }]}>{names}</Text>
        <Text style={styles.text}>{address}</Text>
      </View>
    </Touchable>
  );
});

export default CustomerPickerItem;

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
  text: {
    marginTop: 4,
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
