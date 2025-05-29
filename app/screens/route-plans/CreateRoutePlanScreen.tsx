import Header from '@core/components/Header';
import React, { FC, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import RoutePlanPageOne from './components/RoutePlanPageOne';
import RoutePlanPageTwo from './components/RoutePlanPageTwo';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { SCREEN } from '@app/enums/screen.enum';
import Button from '@core/components/Button';
import { colors } from '@core/constants/colors.constant';
import { StackActions, useNavigation } from '@react-navigation/native';
import StepIndicator from '@app/components/StepIndicator';
import { useAuth } from '@app/hooks/useAuth';
import { useRoutePlanForm } from '@app/hooks/useRoutePlanForm';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { createRoutePlanMutation } from '@app/queries/route-plan.mutation';
import { isEmpty, isNil } from 'lodash';
import TextUtils from '@core/utils/TextUtils';
import { queryClient } from 'App';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CREATE_ROUTE_PLAN
>;

const CreateRoutePlanScreen: FC<Props> = props => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const mutation = createRoutePlanMutation();

  const data = useRoutePlanForm(state => state.data);
  const setData = useRoutePlanForm(state => state.setData);
  const setErrors = useRoutePlanForm(state => state.setErrors);
  const resetForm = useRoutePlanForm(state => state.reset);

  const [pageIndex, setPageIndex] = useState(0);

  const pagerRef = useRef<PagerView>(null);

  // effects
  useEffect(() => {
    if (user) {
      setData({
        userId: [user?.id, user?.name],
        teamId: user.sale_team_id
          ? [user.sale_team_id?.id, user.sale_team_id?.name]
          : undefined,
        groupId: user.crm_group_id
          ? [user.crm_group_id?.id, user.crm_group_id?.name]
          : undefined,
      });
    }

    return () => {
      resetForm();
    };
  }, []);

  useEffect(() => {
    if (mutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => Spinner.hide();
  }, [mutation.isPending]);

  useEffect(() => {
    const listener = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressBack,
    );
    return () => {
      listener?.remove();
    };
  }, [pageIndex]);

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

  const validateStepOne = () => {
    let errors: Record<string, string> = {};
    if (isEmpty(data?.description)) {
      errors.description = 'Vui lòng nhập tên kế hoạch';
    }
    if (data.category?.[0] === 'plan' && isEmpty(data?.router)) {
      errors.router = 'Vui lòng chọn tuyến';
    }
    if (data.recurrent) {
      if (isNil(data?.recurrentDate)) {
        errors.recurrentDate = 'Chưa chọn thời gian lặp lại';
      }
      if (isNil(data?.intervalNumber)) {
        errors.intervalNumber = 'Lặp lại mỗi';
      }
      if (isEmpty(data?.intervalType)) {
        errors.intervalType = 'Loại lặp';
      }
    }
    setErrors(errors);
    return isEmpty(errors);
  };

  const validateStepTwo = () => {
    let errors: Record<string, string> = {};

    // if (isEmpty(data?.distributionChannel)) {
    //   errors.distributionChannel = 'Chọn kênh phân phối';
    // }

    setErrors(errors);
    return isEmpty(errors);
  };

  const next = () => {
    if (pageIndex > 1) return;
    switch (pageIndex) {
      case 0: {
        if (!validateStepOne()) return;
        pagerRef.current?.setPage(pageIndex + 1);
        break;
      }
      case 1: {
        if (!validateStepTwo()) return;
        submit();
        return;
      }
      default:
        pagerRef.current?.setPage(pageIndex + 1);
        break;
    }
  };

  const submit = () => {
    if (!user?.id) return;
    mutation
      .mutateAsync({
        create_uid: user.id,
        category: data.category?.[0],
        description: data.description,
        router_id: data.router?.[0],
        user_id: data?.userId?.[0],
        team_id: data?.teamId?.[0],
        crm_group_id: data?.groupId?.[0],
        from_date: data.from.format('YYYY-MM-DD'),
        to_date: data.to.format('YYYY-MM-DD'),
        recurrent: data.recurrent,
        interval_number: Number(data.intervalNumber),
        interval_type: data.intervalType,
        recurrent_date: data.recurrentDate
          ? data.recurrentDate?.format('YYYY-MM-DD')
          : undefined,
        store_ids: data.stores
          ? { add: data.stores?.map(s => s.id) }
          : undefined,
        state_ids: data.states
          ? { add: data.states?.map(s => s[0]) }
          : undefined,
      })
      .then(({ response }) => {
        const result = response?.result?.routers?.[0];
        queryClient.refetchQueries({
          queryKey: ['route-plans-list'],
        });
        queryClient.refetchQueries({
          queryKey: ['route-plans-detail'],
        });
        resetForm();
        navigation.dispatch(
          StackActions.replace(SCREEN.ROUTE_PLAN_DETAIL, {
            id: result.id,
            initialPage: 1,
          }),
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Tạo kế hoạch" onPressBack={onPressBack} />

      <StepIndicator
        labels={['Thông tin kế hoạch', 'Danh sách NPP/ Đại lý']}
        currentPosition={pageIndex}
      />

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={_onPageChanged}
        scrollEnabled={false}>
        <View key="1" style={{ height: '100%' }}>
          <RoutePlanPageOne />
        </View>
        <View key="2" style={{ height: '100%' }}>
          <RoutePlanPageTwo />
        </View>
      </PagerView>

      <View style={styles.footer}>
        <Button text={pageIndex < 1 ? 'Tiếp theo' : 'Lưu'} onPress={next} />
      </View>
    </View>
  );
};

export default CreateRoutePlanScreen;

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
});
