import HStack from '@app/components/HStack';
import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { useUserCurrentCheckIn } from '@app/queries/check-in-out.query';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { queryClient } from 'App';
import dayjs from 'dayjs';
import React, { FC, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import QuickAccessItem from './QuickAccessItem';

interface Props {}

const HomeQuickAccess: FC<Props> = props => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const {
    data: userCurrentCheckIn,
    error: fetchUserCurrentCheckInError,
    isFetching: isFetchingUserCurrentCheckIn,
    isRefetching: isRefetchingUserCurrentCheckIn,
    refetch: refetchUserCurrentCheckIn,
  } = useUserCurrentCheckIn();

  useEffect(() => {
    if (isRefetchingUserCurrentCheckIn || isFetchingUserCurrentCheckIn)
      Spinner.show();
    else Spinner.hide();

    return () => {
      Spinner.hide();
    };
  }, [isRefetchingUserCurrentCheckIn, isFetchingUserCurrentCheckIn]);

  useEffect(() => {
    if (userCurrentCheckIn || fetchUserCurrentCheckInError) {
      navigation.navigate(SCREEN.CHECK_IN_OUT, {
        category: CheckInOutCategory.working_calendar,
        screenTitle: 'Chấm công',
        checkInOutId: userCurrentCheckIn?.id,
      });
    }
  }, [userCurrentCheckIn, fetchUserCurrentCheckInError]);

  const onPressMyCurrentRouter = () => {
    if (!user?.id) return;

    navigation.navigate(SCREEN.ROUTER_TRACKING, {});
  }

  const onPressRouterScheduleList = () => {
    if (!user?.id) return;

    const now = dayjs();
    navigation.navigate(SCREEN.ROUTE_PLAN_SCHEDULES_LIST, {
      filter: {
        salesperson_id: user?.id,
        from_date: now.format('YYYY-MM-DD'),
        to_date: now.format('YYYY-MM-DD'),
      },
    });
  };

  const onPressRoutePlans = () => {
    navigation.navigate(SCREEN.ROUTE_PLANS_LIST, {});
  };

  const onPressLeads = () => {
    navigation.navigate(SCREEN.LEADS_LIST, {});
  };

  const onPressCreateClient = () =>
    navigation.navigate(SCREEN.CREATE_CLIENT, {});

  const onPressPosOrdersList = () => {
    navigation.navigate(SCREEN.POS_ORDERS_LIST, {});
  };

  const onPressCheckInOut = () => {
    queryClient.removeQueries({ queryKey: ['fetch-user-current-check-in'] });
    refetchUserCurrentCheckIn();
  };

  const onPressPromotionPrograms = () => {
    navigation.navigate(SCREEN.PROMOTIONS_LIST);
  };

  return (
    <HStack style={styles.container}>
      <QuickAccessItem
        icon={images.home.router}
        text={'Đi tuyến'}
        onPress={onPressMyCurrentRouter}
        style={styles.item}
      />
      <QuickAccessItem
        icon={images.home.navigate}
        text={'Lịch trình tuyến'}
        onPress={onPressRouterScheduleList}
        style={styles.item}
      />
      <QuickAccessItem
        icon={images.home.male}
        text={'Thêm khách hàng'}
        onPress={onPressCreateClient}
        style={styles.item}
      />
      <QuickAccessItem
        icon={images.home.map}
        text={'Kế hoạch đi tuyến'}
        onPress={onPressRoutePlans}
        style={styles.item}
      />
      <QuickAccessItem
        icon={images.home.bag}
        text={'Đơn Đại lý'}
        onPress={onPressPosOrdersList}
        style={styles.item}
      />
      <QuickAccessItem
        icon={images.home.loupe}
        text={'Cơ hội'}
        onPress={onPressLeads}
        style={styles.item}
      />
      <QuickAccessItem
        icon={images.home.fingerprint}
        text={'Chấm công'}
        onPress={onPressCheckInOut}
        style={styles.item}
      />
      <QuickAccessItem
        icon={images.home.promotion}
        text={'Khuyến mãi'}
        onPress={onPressPromotionPrograms}
        style={styles.item}
      />
    </HStack>
  );
};

export default HomeQuickAccess;

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    rowGap: 20,
  },
  item: {
    width: '25%',
  },
});
