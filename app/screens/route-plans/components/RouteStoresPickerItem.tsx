import CustomerCategoryView from '@app/components/CustomerCategoryView';
import HStack from '@app/components/HStack';
import { RouterStore } from '@app/interfaces/entities/erp-router.entity';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { identity } from 'lodash';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export type StorePickerItemViewModel = RouterStore & {
  isSelected?: boolean;
};

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: StorePickerItemViewModel;
  onPress?: (data: StorePickerItemViewModel) => void;
}

const RouteStoresPickerItem: FC<Props> = React.memo(
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

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <View
          style={[
            styles.circle,
            data.isSelected && { backgroundColor: colors.primary },
          ]}>
          <Image style={styles.checkIcon} source={images.common.check} />
        </View>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {data?.name?.trim()}
          </Text>
          <CustomerCategoryView category={data?.category} />
        </HStack>
        <View style={styles.separator} />
        <View style={styles.body}>
          <Text
            style={[
              styles.text,
              { fontSize: 14, color: colors.primary, marginTop: 0 },
            ]}
            numberOfLines={1}>
            {data.representative} - {data.phone}
          </Text>
          <Text style={[styles.text]} numberOfLines={1}>
            {address}
          </Text>
        </View>
      </Touchable>
    );
  },
);

export default RouteStoresPickerItem;

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: colors.colorEAEAEA,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    overflow: 'hidden',
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
    textAlignVertical: 'center',
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
    maxWidth: Number(100).adjusted(),
  },
  text: {
    fontSize: 12,
    marginTop: 4,
    color: colors.color6B7A90,
    paddingRight: 24,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.colorDADADA,
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
