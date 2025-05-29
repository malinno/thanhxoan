import HStack from '@app/components/HStack';
import { SHOWCASE_STATE_MAPPING } from '@app/constants/showcase-states.constant';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { ErpShowcaseDeclaration } from '@app/interfaces/entities/showcase-declaration.entity';
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
  data: ErpShowcaseDeclaration;
  onPress?: (data: ErpShowcaseDeclaration) => void;
}

const ShowcaseDeclarationItem: FC<Props> = React.memo(
  ({ index, data, onPress, style, ...props }) => {
    const _onPress = () => onPress?.(data);

    const address = [
      data.store_id?.street2,
      data.store_id?.address_town_id?.[1],
      data.store_id?.address_district_id?.[1],
      data.store_id?.address_state_id?.[1],
    ]
      .filter(identity)
      .join(', ');

    const saleDisplayName = [data.salesperson_id?.[1], data.team_id?.[1]]
      .filter(identity)
      .join(' - ');

    const createdAt = data?.date_created
      ? dayjs(data?.date_created, 'YYYY-MM-DD').format('DD/MM/YYYY')
      : '';

    const state = data?.state ? SHOWCASE_STATE_MAPPING[data?.state] : undefined;

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {/* {data.store_id?.name} */}
            {data.name}
          </Text>
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
              {data?.store_id?.representative || data?.store_id?.name} -{' '}
              {data?.store_id?.phone}
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
            <Image source={images.client.ribbon} />
            <Text style={[styles.text]} numberOfLines={1}>
              {data?.sla_showcase_id?.[1]}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.calendar} />
            <Text style={[styles.text]} numberOfLines={1}>
              {createdAt}
            </Text>
          </HStack>
        </View>
      </Touchable>
    );
  },
);

export default ShowcaseDeclarationItem;

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
