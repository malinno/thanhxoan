import HStack from '@app/components/HStack';
import { CHECK_IN_STATE_MAPPING } from '@app/constants/check-in-statuses.constant';
import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';
import { ErpCheckInOut } from '@app/interfaces/entities/erp-checkin-out.entity';
import Checkbox from '@core/components/Checkbox';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { identity, isNil } from 'lodash';
import React, { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index?: number;
  data: ErpCheckInOut;
  onPress?: (data: ErpCheckInOut) => void;
}

const CheckInOutHistoryItem: FC<Props> = React.memo(
  ({ index, data, onPress, style, ...props }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const _onPress = () => onPress?.(data);

    const address = [
      data.store_id?.street2,
      data.address_town_id?.[1],
      data.address_district_id?.[1],
      data.address_state_id?.[1],
    ]
      .filter(identity)
      .join(', ');

    const saleDisplayName = [data.salesperson_id?.[1], data.team_id?.[1]]
      .filter(identity)
      .join(' - ');

    const state = data?.state ? CHECK_IN_STATE_MAPPING[data.state] : undefined;

    return (
      <Touchable
        activeOpacity={1}
        style={[styles.item, style]}
        onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1} selectable>
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
          {data.category === CheckInOutCategory.working_route && (
            <Fragment>
              <HStack style={[styles.row, { marginTop: 0 }]}>
                <Image source={images.client.call} style={[styles.icon]} />
                <Text
                  style={[
                    styles.text,
                    { fontWeight: '500', color: colors.primary },
                  ]}
                  numberOfLines={1}>
                  {data.store_id?.representative || data.store_id?.name} -{' '}
                  {data.store_id?.phone}
                </Text>
              </HStack>
              <HStack style={styles.row}>
                <Image source={images.client.location} style={[styles.icon]} />
                <Text style={[styles.text]}>{address}</Text>
              </HStack>
            </Fragment>
          )}
          <HStack
            style={[
              styles.row,
              data.category !== CheckInOutCategory.working_route && {
                marginTop: 0,
              },
            ]}>
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
            <Image source={images.client.user} style={[styles.icon]} />
            <Text style={[styles.text]}>{saleDisplayName}</Text>
            {data.category === CheckInOutCategory.working_route && (
              <Checkbox
                disabled
                disableBuiltInState
                iconStyle={styles.checkboxIcon}
                value={data?.sla_state === 'resolved'}
                disableText
              />
            )}
          </HStack>
        </View>
      </Touchable>
    );
  },
);

export default CheckInOutHistoryItem;

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
    flex: 1,
    marginLeft: 16,
  },
  checkboxIcon: {
    borderRadius: 4,
  },
});
