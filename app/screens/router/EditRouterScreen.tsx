import StepIndicator from '@app/components/StepIndicator';
import { CompanyType } from '@app/enums/company-type.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { useCustomerForm } from '@app/hooks/useCustomerForm';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { updateCustomerMutation } from '@app/queries/customer.mutation';
import { useCustomerDetail } from '@app/queries/customer.query';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import TextUtils from '@core/utils/TextUtils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { queryClient } from 'App';
import { isEmpty, isNil, orderBy } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import dayjs from 'dayjs';
import RouterFormStepTwo from './components/RouterFormStepTwo';
import { useRouterForm } from '@app/hooks/useRouterForm';
import { editRouterMutation } from '@app/queries/router.mutation';
import { useRouterDetail } from '@app/queries/erp-router.query';
import { DAYS_OF_WEEK } from '@app/constants/app.constant';
import RouterFormStepOne from './components/RouterFormStepOne';
import { RouterStoreLineDto } from '@app/interfaces/dtos/router.dto';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.EDIT_ROUTER>;

const EditRouterScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const data = useRouterForm(state => state.data);
  const setData = useRouterForm(state => state.setData);
  const setErrors = useRouterForm(state => state.setErrors);
  const resetForm = useRouterForm(state => state.reset);

  const mutation = editRouterMutation();

  const {
    data: router,
    isLoading,
    isRefetching,
    refetch: fetchRouter,
  } = useRouterDetail(route.params.id, false);

  // states
  const [pageIndex, setPageIndex] = useState(0);

  // refs
  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    if (route.params?.id) fetchRouter();
    else {
      setData({
        salesperson_id: user ? [user?.id, user?.name] : undefined,
        team_id: user?.sale_team_id
          ? [user.sale_team_id.id, user.sale_team_id.name]
          : undefined,
        cmp_id: user?.crm_group_id
          ? [user.crm_group_id.id, user.crm_group_id.name]
          : undefined,
        day_of_week: DAYS_OF_WEEK[0].id,
      });
    }
  }, [route.params?.id]);

  // effects
  useEffect(() => {
    if (mutation.isPending || isLoading || isRefetching) Spinner.show();
    else Spinner.hide();
    return () => {
      Spinner.hide();
    };
  }, [mutation.isPending, isLoading, isRefetching]);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  useEffect(() => {
    if (router) {
      setData({
        name: router.name,
        salesperson_id: router.salesperson_id,
        team_id: router.team_id,
        cmp_id: router.cmp_id,
        day_of_week: router.day_of_week
          ? Number(router.day_of_week)
          : DAYS_OF_WEEK[0].id,
        store_ids: router.store_ids
          ? orderBy(router.store_ids, 'sequence')
          : [],
      });
    }
  }, [router]);

  useEffect(() => {
    if (mutation.isSuccess && mutation.data?.response) {
      const response = mutation.data.response;
      const result = response?.result?.routers?.[0];
      navigation.goBack();
    }
  }, [mutation.isSuccess, mutation.data]);

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

    if (isEmpty(data.name)) {
      errors.name = 'Tên tuyến không được để trống';
    }
    setErrors(errors);
    return isEmpty(errors);
  };

  const validateStepTwo = () => {
    let errors: Record<string, string> = {};

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
    if (!user?.id || !router?.id) return;

    const updateLines: Record<string, RouterStoreLineDto> = {};

    for (const [index, line] of Object.entries(data.store_ids)) {
      updateLines[String(line.id)] = {
        sequence: index,
      };
    }

    mutation.mutate({
      id: route.params.id,
      data: {
        update_uid: user.id,
        name: data.name,
        day_of_week: !isNil(data.day_of_week)
          ? String(data.day_of_week)
          : undefined,
        salesperson_id: data.salesperson_id?.[0]!,
        team_id: data.team_id?.[0]!,
        store_ids: {
          update: updateLines,
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Thông tin khách hàng" onPressBack={onPressBack} />

      <StepIndicator
        labels={['Khách hàng', 'Phân loại']}
        currentPosition={pageIndex}
      />

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        scrollEnabled={false}
        initialPage={0}
        onPageSelected={_onPageChanged}>
        <View key="1" style={{ height: '100%' }}>
          <RouterFormStepOne />
        </View>
        <View key="2" style={{ height: '100%' }}>
          <RouterFormStepTwo />
        </View>
      </PagerView>

      <View style={styles.footer}>
        <Button text={pageIndex === 1 ? 'Lưu' : 'Tiếp theo'} onPress={next} />
      </View>
    </View>
  );
};

export default EditRouterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});
