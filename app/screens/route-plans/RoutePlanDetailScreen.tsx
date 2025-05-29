import HStack from '@app/components/HStack';
import StepIndicator from '@app/components/StepIndicator';
import { ROUTE_PLAN_CATEGORIES } from '@app/constants/route-plan-categories.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { useRoutePlanForm } from '@app/hooks/useRoutePlanForm';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useRoutePlanDetail } from '@app/queries/route-plan.query';
import { updateRoutePlanStateMutation } from '@app/queries/route-plan.mutation';
import Button, { AnimatedButton } from '@core/components/Button';
import Header from '@core/components/Header';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { queryClient } from 'App';
import dayjs from 'dayjs';
import React, { FC, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import RoutePlanPageOne from './components/RoutePlanPageOne';
import RoutePlanPageTwo from './components/RoutePlanPageTwo';
import { RoutePlanStateDto } from '@app/repository/route/RouteRepo';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.ROUTE_PLAN_DETAIL
>;

const RoutePlanDetailScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const mutation = updateRoutePlanStateMutation();

  const setData = useRoutePlanForm(state => state.setData);
  const resetForm = useRoutePlanForm(state => state.reset);

  const { data: routePlanData, refetch } = useRoutePlanDetail(route.params.id);

  // states
  const [pageIndex, setPageIndex] = useState(0);

  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  useEffect(() => {
    if (routePlanData) {
      const category = ROUTE_PLAN_CATEGORIES.find(
        c => c.id === routePlanData.category,
      );
      setData({
        editable: false,
        description: routePlanData.description,
        router: routePlanData.router_id,
        teamId: routePlanData.team_id,
        userId: routePlanData.user_id,
        groupId: routePlanData.crm_group_id,
        from: dayjs(routePlanData.from_date, 'YYYY-MM-DD'),
        to: dayjs(routePlanData.to_date, 'YYYY-MM-DD'),
        state: routePlanData.state,
        stores: routePlanData.store_ids,
        active: routePlanData.active,
        recurrent: routePlanData.recurrent,
        intervalNumber: routePlanData.interval_number
          ? String(routePlanData.interval_number)
          : '',
        intervalType: routePlanData.interval_type,
        recurrentDate: routePlanData.recurrent_date
          ? dayjs(routePlanData.recurrent_date, 'YYYY-MM-DD')
          : undefined,
        category: category ? [category.id, category.text] : undefined,
        states: routePlanData.state_ids
          ? routePlanData.state_ids.map(st => [st.id, st.name])
          : [],
      });
    }
  }, [routePlanData]);

  useEffect(() => {
    const listener = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressBack,
    );
    return () => {
      listener?.remove();
    };
  }, [pageIndex]);

  useEffect(() => {
    if (mutation.isPending) Spinner.show();
    else Spinner.hide();

    return () => {
      Spinner.hide();
    };
  }, [mutation.isPending]);

  const onPressBack = () => {
    if (pageIndex) previous();
    else navigation.goBack();
    return true;
  };

  const _onPageChanged = (event: PagerViewOnPageSelectedEvent) => {
    const page = event.nativeEvent.position;
    setPageIndex(page);
  };

  const previous = () => {
    if (pageIndex <= 0) return;
    pagerRef.current?.setPage(pageIndex - 1);
  };

  const next = () => {
    if (pageIndex > 1) return;
    if (pageIndex === 1) {
      navigation.goBack();
      return;
    }
    pagerRef.current?.setPage(pageIndex + 1);
  };

  const onPressSubmit = () => changeState('submit');

  const onPressApprove = () => changeState('approve');

  const onPressCancel = () => changeState('cancel');

  const changeState = (state: RoutePlanStateDto) => {
    if (!user?.id) return;
    mutation
      .mutateAsync({ id: route.params.id, state, uid: user.id })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['route-plans-list'],
        });
        refetch();
      })
      .catch(err => {
        console.log(`error`, err);
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Kế hoạch đi tuyến" onPressBack={onPressBack} />

      <StepIndicator
        labels={['Thông tin kế hoạch', 'Danh sách NPP/ Đại lý']}
        currentPosition={pageIndex}
      />

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={route.params?.initialPage || 0}
        onPageSelected={_onPageChanged}>
        <View key="1" style={{ height: '100%' }}>
          <RoutePlanPageOne />
        </View>
        <View key="2" style={{ height: '100%' }}>
          <RoutePlanPageTwo />
        </View>
      </PagerView>

      <View style={styles.footer}>
        {pageIndex === 0 && (
          <AnimatedButton
            entering={FadeIn}
            exiting={FadeOut}
            text={'Tiếp theo'}
            onPress={next}
          />
        )}
        {pageIndex === 1 &&
          routePlanData?.state &&
          ['1_new', '1x_to_approve'].includes(routePlanData?.state) && (
            <HStack entering={FadeIn} exiting={FadeOut} style={{ gap: 16 }}>
              <Button
                text={'Huỷ'}
                style={styles.button}
                colors={colors.red}
                onPress={onPressCancel}
              />
              {routePlanData?.state === '1_new' && (
                <Button
                  text={'Đệ trình'}
                  style={styles.button}
                  colors={colors.color2AB514}
                  onPress={onPressSubmit}
                />
              )}
              {routePlanData?.state === '1x_to_approve' && (
                <Button
                  text={'Duyệt'}
                  style={styles.button}
                  colors={colors.color2AB514}
                  onPress={onPressApprove}
                />
              )}
            </HStack>
          )}
      </View>
    </View>
  );
};

export default RoutePlanDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepIndicator: {},
  pagerView: {
    flex: 1,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  button: {
    flex: 1,
  },
});
