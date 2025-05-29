import CustomerCategoryView from '@app/components/CustomerCategoryView';
import HStack from '@app/components/HStack';
import { ROUTE_SCHEDULE_CHECK_IN_STATUSES } from '@app/constants/route-schedule-check-in-statuses.constant';
import { RoutePlanScheduleCheckInStatus } from '@app/enums/route-schedule-check-in-status.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { TRouterTrackingStore } from '@app/hooks/useRouterTracking';
import { RouterStore } from '@app/interfaces/entities/erp-router.entity';
import Button from '@core/components/Button';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { identity } from 'lodash';
import React, { FC, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index?: number;
  data: TRouterTrackingStore;
  onPress?: (data: TRouterTrackingStore) => void;
}

const RouterTrackingStoreItem: FC<Props> = React.memo(
  ({ index, data, onPress, style, ...props }) => {
    const navigation = useNavigation();

    const _onPress = () => onPress?.(data);

    const onPressPosOrders = () => {
      if (!data?.id) return;
      navigation.navigate(SCREEN.CREATE_POS_ORDER, {
        partnerId: data?.id,
      });
    };

    const _onPressCheckInOut = () => {
      let checkInOutId: number | undefined = undefined;
      switch (status) {
        case RoutePlanScheduleCheckInStatus.checking_in:
          checkInOutId = data.last_checkin?.id;
          break;
        case RoutePlanScheduleCheckInStatus.uncheck:
        case RoutePlanScheduleCheckInStatus.checked:
        default:
          break;
      }
      navigation.navigate(SCREEN.CHECK_IN_OUT, {
        checkInOutId,
        storeId: data.id,
      });
    };

    const address = [
      data?.street,
      data.address_town_id?.[1],
      data.address_district_id?.[1],
      data.address_state_id?.[1],
    ]
      .filter(identity)
      .join(', ');

    const status = useMemo(() => {
      if (!data.last_checkin) return RoutePlanScheduleCheckInStatus.uncheck;
      if (data.last_checkin.check_out)
        return RoutePlanScheduleCheckInStatus.checked;
      return RoutePlanScheduleCheckInStatus.checking_in;
    }, [data.last_checkin]);

    return (
      <Touchable
        activeOpacity={1}
        style={[
          styles.item,
          style,
          {
            backgroundColor:
              ROUTE_SCHEDULE_CHECK_IN_STATUSES[status].backgroundColor,
          },
        ]}
        onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1} selectable>
            {data?.name}
          </Text>
          <CustomerCategoryView category={data?.category} />
        </HStack>
        <View
          style={[
            styles.separator,
            {
              backgroundColor:
                ROUTE_SCHEDULE_CHECK_IN_STATUSES[status].dividerColor,
            },
          ]}
        />
        <View style={styles.body}>
          <HStack style={[styles.row, { marginTop: 0 }]}>
            <Image source={images.client.call} style={[styles.icon]} />
            <Text
              style={[
                styles.text,
                { fontWeight: '500', color: colors.primary },
              ]}
              numberOfLines={1}>
              {data.representative || data.name} - {data.phone}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.location} style={[styles.icon]} />
            <Text style={[styles.text]}>{address}</Text>
            {/* <Text style={styles.distance}>{data.distance}</Text> */}
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.login} style={[styles.icon]} />
            <Text style={[styles.text]} numberOfLines={1}>
              Đã check in: {data.checkin_last_days} ngày trước
            </Text>
          </HStack>

          <HStack style={[styles.row, styles.btnContainer]}>
            {status === RoutePlanScheduleCheckInStatus.checked && (
              <Button
                text="Đơn đại lý"
                colors={colors.color0047B1}
                style={styles.btn}
                textStyle={styles.btnText}
                onPress={onPressPosOrders}
              />
            )}
            <Button
              text={ROUTE_SCHEDULE_CHECK_IN_STATUSES[status].statusDisplay}
              colors={
                ROUTE_SCHEDULE_CHECK_IN_STATUSES[status].statusBackgroundColor
              }
              style={styles.btn}
              textStyle={[
                styles.btnText,
                {
                  color:
                    ROUTE_SCHEDULE_CHECK_IN_STATUSES[status].statusTextColor,
                },
              ]}
              activeOpacity={1}
            />
            <Button
              leftIcon={{
                src: ROUTE_SCHEDULE_CHECK_IN_STATUSES[status].actionBtnIcon,
              }}
              text={
                status === RoutePlanScheduleCheckInStatus.checking_in
                  ? 'Check out'
                  : 'Check in'
              }
              colors={ROUTE_SCHEDULE_CHECK_IN_STATUSES[status].actionBtnColor}
              style={styles.btn}
              textStyle={styles.btnText}
              onPress={_onPressCheckInOut}
            />
          </HStack>
        </View>
      </Touchable>
    );
  },
);

export default RouterTrackingStoreItem;

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
  btnContainer: {
    gap: 8,
  },
  btn: {
    flex: 1,
    minHeight: undefined,
    height: 28,
    paddingVertical: 0,
    borderRadius: 4,
  },
  btnText: {
    fontSize: 12,
  },
});
