import CustomerCategoryView from '@app/components/CustomerCategoryView';
import HStack from '@app/components/HStack';
import { RouterStore } from '@app/interfaces/entities/erp-router.entity';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { identity, isNil } from 'lodash';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: RouterStore;
  onPress?: (data: RouterStore) => void;
  onRemove?: (index: number, data: RouterStore) => void;
}

const RouterStoreItem: FC<Props> = React.memo(
  ({ index, data, onPress, onRemove, style, ...props }) => {
    const _onPress = () => onPress?.(data);
    const _onPressRemove = () => onRemove?.(index, data);

    const name = [data?.representative, data?.phone]
      .filter(identity)
      .join(' - ');

    const address = [
      data?.street,
      data?.address_town_id?.[1],
      data?.address_district_id?.[1],
      data?.address_state_id?.[1],
    ]
      .filter(identity)
      .join(', ');

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress} {...props}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {data?.name}
          </Text>
          <CustomerCategoryView category={data?.category} />
        </HStack>
        <View style={styles.separator} />
        <View style={styles.body}>
          <Text
            style={[styles.text, { fontSize: 14, color: colors.primary }]}
            numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.text]} numberOfLines={1}>
            {address}
          </Text>
        </View>
        {!isNil(onRemove) && (
          <Touchable
            style={styles.removeBtn}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={_onPressRemove}>
            <Image source={images.common.closeRounded} />
          </Touchable>
        )}
      </Touchable>
    );
  },
);

export default RouterStoreItem;

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
  text: {
    fontSize: 12,
    marginTop: 4,
    color: colors.color6B7A90,
  },
  removeBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.colorDADADA,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
