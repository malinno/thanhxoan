import HStack from '@app/components/HStack';
import { ROUTE_PLAN_STATE_MAPPING } from '@app/constants/route-plan-states.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { ErpRoutePlan } from '@app/interfaces/entities/erp-route-plan.entity';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { identity, isNil } from 'lodash';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: ErpRoutePlan;
  onPress?: (data: ErpRoutePlan) => void;
}

const RoutePlanItem: FC<Props> = React.memo(
  ({ index, data, onPress, style, ...props }) => {
    const navigation = useNavigation();

    const _onPress = () => onPress?.(data);

    const _onPressSchedules = () =>
      navigation.navigate(SCREEN.ROUTE_PLAN_SCHEDULES_LIST, {
        filter: { router_plan_id: data.id },
      });

    const routeName = data.router_id?.[1] ?? '';
    const state = data?.state
      ? ROUTE_PLAN_STATE_MAPPING[data?.state]
      : undefined;

    const saleDisplayName = [data.user_id?.[1], data.team_id?.[1]]
      .filter(identity)
      .join(' - ');

    const from = data?.from_date
      ? dayjs(data?.from_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
      : '';
    const to = data?.to_date
      ? dayjs(data?.to_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
      : '';

    return (
      <Touchable
        activeOpacity={1}
        style={[styles.item, style]}
        onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1} selectable>
            {data.code}
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
            <Image source={images.client.ribbon} />
            <Text style={[styles.text]} numberOfLines={1}>
              {routeName}
            </Text>
          </HStack>
          <HStack style={[styles.row]}>
            <Image source={images.client.store} />
            <Text style={[styles.text]} numberOfLines={1}>
              Số cửa hàng: {data.total_store}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.user} />
            <Text style={[styles.text]} numberOfLines={1}>
              {saleDisplayName}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.calendar} />
            <Text style={[styles.text]} numberOfLines={1}>
              {from} - {to}
            </Text>
          </HStack>
          <HStack style={styles.btn} onPress={_onPressSchedules}>
            <Image source={images.staff.map} style={styles.btnIcon} />
            <Text style={styles.btnText}>Xem lịch trình tuyến</Text>
            <Image source={images.common.expandRight} />
          </HStack>
        </View>
      </Touchable>
    );
  },
);

export default RoutePlanItem;

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
  btn: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    height: 36,
  },
  btnIcon: {
    width: 18,
    height: 18,
  },
  btnText: {
    marginHorizontal: 8,
    color: colors.white,
  },
});
