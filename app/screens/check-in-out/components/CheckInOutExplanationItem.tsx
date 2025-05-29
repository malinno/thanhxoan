import { Image, StyleSheet, View } from 'react-native';
import React, { FC, memo } from 'react';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { CheckInOutExplanation } from '@app/interfaces/entities/check-in-out-explanation.entity';
import { colors } from '@core/constants/colors.constant';
import HStack from '@app/components/HStack';
import images from '@images';
import dayjs from 'dayjs';
import { CHECK_IO_EXPLANATION_STATUS_MAPPING } from '@app/constants/check-io-explanation.constant';
import { isNil } from 'lodash';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: CheckInOutExplanation;
  onPress?: (data: CheckInOutExplanation) => void;
}

const CheckInOutExplanationItem: FC<Props> = memo(
  ({ index, data, onPress, style, ...props }) => {
    const _onPress = () => onPress?.(data);

    const status = CHECK_IO_EXPLANATION_STATUS_MAPPING[data.status];

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {data.name}
          </Text>
          {!isNil(status) && (
            <View
              style={[
                styles.state,
                { backgroundColor: status.backgroundColor },
              ]}>
              <Text
                style={[styles.stateText, { color: status.textColor }]}
                numberOfLines={1}>
                {status?.displayText}
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
              {data.store_id?.name}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.location} />
            <Text style={[styles.text]} numberOfLines={1}>
              {data.store_id?.street2}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.login} style={[styles.icon]} />
            <Text style={[styles.text]} numberOfLines={1}>
              Check in:{' '}
              {data.check_in
                ? dayjs(data.check_in).format('DD/MM/YYYY - HH:mm')
                : ''}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.logout} style={[styles.icon]} />
            <Text style={[styles.text]} numberOfLines={1}>
              Check out:{' '}
              {data.check_out
                ? dayjs(data.check_out).format('DD/MM/YYYY - HH:mm')
                : ''}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.user} />
            <Text style={[styles.text]} numberOfLines={1}>
              {data.salesperson_id?.[1]}
            </Text>
          </HStack>
        </View>
      </Touchable>
    );
  },
);

export default CheckInOutExplanationItem;

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
  separator: {
    height: 1,
    backgroundColor: colors.colorE3E5E8,
  },
  body: {
    paddingVertical: 16,
    gap: 8
  },
  row: {
    alignItems: 'flex-start',
  },
  icon: {
    marginTop: 2,
  },
  text: {
    marginLeft: 16,
    flex: 1,
  },
});
