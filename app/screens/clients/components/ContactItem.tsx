import HStack from '@app/components/HStack';
import { CONTACT_TYPE_MAPPING } from '@app/constants/contact-types.constant';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { identity, isNil } from 'lodash';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: ErpCustomer;
  onPress?: (data: ErpCustomer) => void;
}

const ContactItem: FC<Props> = React.memo(
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

    const type = data?.type ? CONTACT_TYPE_MAPPING[data?.type] : undefined;

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1} selectable>
            {data.name}
          </Text>
          {!isNil(type) && (
            <View
              style={[styles.state, { backgroundColor: type.backgroundColor }]}>
              <Text
                style={[styles.stateText, { color: type.textColor }]}
                numberOfLines={1}>
                {type?.name}
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
              {data.phone}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.infoCircle} />
            <Text style={[styles.text]} numberOfLines={1}>
              {data?.function}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.location} />
            <Text style={[styles.text]} numberOfLines={1}>
              {address}
            </Text>
          </HStack>
        </View>
      </Touchable>
    );
  },
);

export default ContactItem;

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
    maxWidth: Number(100).adjusted(),
  },
  row: {},
  text: {
    marginLeft: 16,
    flex: 1,
  },
});
