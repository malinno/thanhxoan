import HStack from '@app/components/HStack';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { ErpRouter } from '@app/interfaces/entities/erp-router.entity';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { identity } from 'lodash';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: ErpRouter;
  onPress?: (data: ErpRouter) => void;
}

const RouterItem: FC<Props> = React.memo(
  ({ index, data, onPress, style, ...props }) => {
    const _onPress = () => onPress?.(data);

    const saleDisplayName = [data.salesperson_id?.[1], data.team_id?.[1]]
      .filter(identity)
      .join(' - ');

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1} selectable>
            {data.name}
          </Text>
        </HStack>
        <View style={styles.separator} />
        <View style={styles.body}>
          <HStack style={[styles.row, { marginTop: 0 }]}>
            <Image source={images.client.call} />
            <Text style={[styles.text]} numberOfLines={1}>
              {data?.total_store} cửa hàng
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.user} />
            <Text style={[styles.text]} numberOfLines={1}>
              {saleDisplayName}
            </Text>
          </HStack>
        </View>
      </Touchable>
    );
  },
);

export default RouterItem;

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
