import Input from '@app/components/Input';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useCustomers } from '@app/queries/customer.query';
import { useRoutersList } from '@app/queries/erp-router.query';
import {
  useRoutePlanDetail,
  useRoutePlansList,
} from '@app/queries/route-plan.query';
import { createRoutePlanDetailMutation } from '@app/queries/route-plan.mutation';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { queryClient } from 'App';
import dayjs from 'dayjs';
import { find, isEmpty, isNil, omit } from 'lodash';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { ValidationError } from '@core/interfaces/ValidationError';

type CreateRouteScheduleDataViewModel = {
  from: dayjs.Dayjs;
  to: dayjs.Dayjs;
  description: string;
  store?: [number, string];
  router?: [number, string];
  plan?: [number, string];
  userId?: [number, string];
  teamId?: [number, string];
  groupId?: [number, string];
};

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CREATE_ROUTE_SCHEDULE
>;

const CreateRouteScheduleScreen: FunctionComponent<Props> = ({
  route,
  ...props
}) => {
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();
  const user = useAuth(state => state.user);

  const mutation = createRoutePlanDetailMutation();

  const { data: plan } = useRoutePlanDetail(route.params?.routePlanId);
  const { data: routers } = useRoutersList();
  // const { data: stores } = useCustomers(undefined, false);
  const { data: plans } = useRoutePlansList({ state: '2_approved' });

  const [errors, setErrors] = useState<ValidationError>({});
  const [data, setData] = useState<CreateRouteScheduleDataViewModel>({
    from: dayjs(),
    to: dayjs(),
    description: '',
    userId: user ? [user?.id, user?.name] : undefined,
    teamId: user?.sale_team_id
      ? [user?.sale_team_id?.id, user?.sale_team_id?.name]
      : undefined,
    groupId: user?.crm_group_id
      ? [user?.crm_group_id?.id, user?.crm_group_id?.name]
      : undefined,
  });

  // effects
  useEffect(() => {
    if (mutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => Spinner.hide();
  }, [mutation.isPending]);

  useEffect(() => {
    return () => {
      Spinner.hide();
    };
  }, []);

  useEffect(() => {
    if (plan)
      setData(preState => ({
        ...preState,
        plan: [plan?.id, plan?.code],
        router: plan?.router_id,
      }));
  }, [plan]);

  useEffect(() => {
    setErrors(preState => ({ ...omit(preState, ['store']) }));
  }, [data.store]);

  useEffect(() => {
    setErrors(preState => ({ ...omit(preState, ['router']) }));
  }, [data.router]);

  useEffect(() => {
    setErrors(preState => ({ ...omit(preState, ['plan']) }));
  }, [data.plan]);

  const onChangeDesc = (description: string) =>
    setData(preState => ({ ...preState, description }));

  const onPressCalendar = () => {
    navigation.navigate(SCREEN.CALENDAR_RANGE_PICKER, {
      fromDate: data.from.valueOf(),
      toDate: data.to.valueOf(),
      onChangeDateRange: (date: { fromDate: number; toDate: number }) => {
        setData(preState => ({
          ...preState,
          from: dayjs(date.fromDate),
          to: dayjs(date.toDate),
        }));
      },
    });
  };

  const onPressPlans = () => {
    if (!plans) return;
    const options: Option[] = plans?.map(it => ({
      key: it.id,
      text: it.code,
    }));
    SelectOptionModule.open({
      title: 'Chọn kế hoạch',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        const plan = find(plans, it => it.id === option.key);
        if (!plan) return;
        setData(preState => ({
          ...preState,
          plan: [plan.id, plan.code],
        }));
      },
    });
  };

  const onPressRouters = () => {
    if (!routers) return;
    const options: Option[] = routers?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn tuyến',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        const router = find(routers, it => it.id === option.key);
        if (!router) return;
        setData(preState => ({
          ...preState,
          router: [router.id, router.name],
        }));
      },
    });
  };

  // const onPressStores = () => {
  //   if (!stores) return;
  //   const options: Option[] = stores?.map(it => ({
  //     key: it.id,
  //     text: it.name,
  //   }));
  //   SelectOptionModule.open({
  //     title: 'Chọn cửa hàng',
  //     options,
  //     containerStyle: { minHeight: dimensions.height * 0.5 },
  //     onSelected: function (option: Option, data?: any): void {
  //       const store = find(stores, it => it.id === option.key);
  //       if (!store) return;
  //       setData(preState => ({ ...preState, store: [store.id, store.name] }));
  //     },
  //   });
  // };

  const onPressStores = () => {
    navigation.navigate(SCREEN.CUSTOMERS_PICKER, {
      title: 'Chọn cửa hàng',
      selectedIds: data.store ? [data.store[0]] : undefined,
      onSelected: (customers: ErpCustomer[]) => {
        const store = customers[0]
        if (!store) return;
        setData(preState => ({ ...preState, store: [store.id, store.name] }));
      },
    });
  };

  const validate = (): boolean => {
    let errors: Record<string, string> = {};
    if (isEmpty(data.store)) {
      errors.store = 'Vui lòng chọn NPP/ Đại lý';
    }
    if (isEmpty(data.router)) {
      errors.router = 'Vui lòng chọn tuyến';
    }
    if (isEmpty(data.plan)) {
      errors.plan = 'Vui lòng chọn kế hoạch tuyến';
    }
    setErrors(errors);
    return isEmpty(errors);
  };

  const submit = async () => {
    if (!validate() || !user?.id) return false;
    mutation
      .mutateAsync({
        create_uid: user?.id,
        description: data.description,
        router_id: data.router![0],
        from_date: data.from.format('YYYY-MM-DD'),
        to_date: data.to.format('YYYY-MM-DD'),
        store_id: data.store![0],
        router_plan_id: data.plan![0],
        user_id: data.userId?.[0],
        team_id: data.teamId?.[0],
        crm_group_id: data.groupId?.[0],
      })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['route-plans-detail', route.params?.routePlanId],
        });
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Tạo lịch trình tuyến" />
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Input
          title="Từ ngày - đến ngày"
          placeholder="Chọn khoảng thời gian"
          editable={false}
          rightButtons={[{ icon: images.common.calendarFilled }]}
          value={[
            data.from.format('DD/MM/YYYY'),
            data.to.format('DD/MM/YYYY'),
          ].join(' - ')}
          onPress={onPressCalendar}
        />
        <Input
          title="Mô tả"
          placeholder="Nhập mô tả"
          value={data?.description}
          style={styles.input}
          onChangeText={onChangeDesc}
        />
        <Input
          title="Nhà phân phối/ đại lý"
          placeholder="NPP Anh Sơn"
          editable={false}
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.store?.[1]}
          onPress={onPressStores}
          error={errors.store}
        />
        <Input
          title="Tên tuyến"
          placeholder="Cầu Giấy"
          editable={false}
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.router?.[1]}
          onPress={onPressRouters}
          error={errors.router}
        />
        <Input
          title="Kế hoạch đi tuyến"
          placeholder="PL0001122"
          disabled={!isNil(route.params?.routePlanId)}
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.plan?.[1]}
          onPress={onPressPlans}
          editable={false}
          error={errors.plan}
        />
        <Input
          title="Nhân viên phụ trách"
          placeholder="Nhân viên kinh doanh"
          value={String(data?.userId?.[1] || '')}
          disabled
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
        />
        <Input
          title="Đội ngũ bán hàng"
          placeholder="Đội ngũ kinh doanh"
          value={String(data?.teamId?.[1] || '')}
          disabled
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
        />
        <Input
          title="Công ty con"
          placeholder="Công ty con"
          value={String(data?.groupId?.[1] || '')}
          disabled
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
        />
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <Button text="Lưu" onPress={submit} />
      </View>
    </View>
  );
};

export default CreateRouteScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  input: {
    marginTop: 11,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});
