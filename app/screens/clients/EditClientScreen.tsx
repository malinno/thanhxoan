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
import { isEmpty } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import ClientFormStepOne from './components/ClientFormStepOne';
import ClientFormStepTwo from './components/ClientFormStepTwo';
import dayjs from 'dayjs';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.EDIT_CLIENT>;

const EditClientScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);
  const setData = useCustomerForm(state => state.setData);
  const setErrors = useCustomerForm(state => state.setErrors);
  const resetForm = useCustomerForm(state => state.reset);

  const mutation = updateCustomerMutation();

  const {
    data: customer,
    isLoading,
    isRefetching,
    refetch,
  } = useCustomerDetail(route.params.id);

  // states
  const data = useCustomerForm(state => state.data);
  const [pageIndex, setPageIndex] = useState(0);

  // refs
  const pagerRef = useRef<PagerView>(null);

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
    if (customer) {
      setData({
        id: customer.id,
        type: customer.company_type || CompanyType.person,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        representative: customer.representative,
        address: customer.street2,
        taxCode: customer.tax_code,
        state: customer.address_state_id,
        district: customer.address_district_id,
        town: customer.address_town_id,
        source: customer.source_id,
        productCategory: customer.product_category_id,
        image: customer.image_url,
        category: customer.category,
        contactLevel: customer.contact_level,
        distributionChannel: customer.distribution_channel_id,
        superior: customer.superior_id,
        userId: customer.crm_lead_user_id,
        teamId: customer.crm_lead_team_id,
        groupId: customer.crm_lead_crm_group_id,
        debtLimit: customer.debt_limit,
        numberOfDaysDebt: customer.number_of_days_debt,
        tags: customer.category_id,
        visitFrequency: customer.frequency_visit_id
          ? [customer.frequency_visit_id.id, customer.frequency_visit_id.name]
          : undefined,
        visitFromDate: customer.visit_from_date
          ? dayjs(customer.visit_from_date, 'YYYY-MM-DD')
          : undefined,
        routes: customer.route_id
          ? customer.route_id?.map(r => [r.id, r.name])
          : [],
        coords:
          !!customer?.partner_latitude && !!customer?.partner_longitude
            ? {
                lat: customer.partner_latitude,
                lng: customer.partner_longitude,
              }
            : undefined,
      });
    }
  }, [customer]);

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
    if (isEmpty(data?.name)) {
      errors.name = 'Vui lòng nhập họ và tên';
    }
    if (!TextUtils.validatePhone(data?.phone)) {
      errors.phone = 'Số điện thoại chưa đúng. Vui lòng kiểm tra lại';
    }
    // if (isEmpty(data?.address)) {
    //   errors.address = 'Địa chỉ cụ thể không được để trống';
    // }
    if (isEmpty(data?.state)) {
      errors.state = 'Vui lòng chọn tỉnh/ thành phố';
    }
    if (isEmpty(data?.district)) {
      errors.district = 'Chọn quận/ huyện';
    }
    if (isEmpty(data?.town)) {
      errors.town = 'Chọn phường/ xã';
    }
    // if (isEmpty(data?.productCategory)) {
    //   errors.productCategory = 'Chọn nhãn sản phẩm';
    // }
    if (isEmpty(data?.image)) {
      errors.image = 'Chưa có ảnh';
    }
    // console.log(`errors`, errors);
    setErrors(errors);
    return isEmpty(errors);
  };

  const validateStepTwo = () => {
    let errors: Record<string, string> = {};

    if (isEmpty(data?.distributionChannel)) {
      errors.distributionChannel = 'Chọn kênh phân phối';
    }

    if (data.category?.[0] !== 'distributor' && isEmpty(data?.routes)) {
      errors.routes = 'Chưa chọn tuyến';
    }

    if (isEmpty(data?.contactLevel)) {
      errors.contactLevel = 'Chưa chọn cấp NPP/ Đại lý';
    }

    if (data.category?.[0] !== 'distributor' && isEmpty(data?.superior)) {
      errors.superior = 'Chưa chọn NPP/ đại lý cấp trên';
    }

    if (isEmpty(data?.visitFrequency)) {
      errors.visitFrequency = 'Chưa chọn tần suất viếng thăm';
    }

    if (isEmpty(data?.visitFromDate)) {
      errors.visitFromDate = 'Chọn ngày bắt đầu viếng thăm';
    }

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
    if (!user?.id || !customer?.id) return;
    const addTags: number[] = (data.tags || []).map(tag => tag.id),
      removeTags: number[] = [],
      addRoutes: number[] = (data.routes || []).map(r => r[0]),
      removeRoutes: number[] = [];

    for (const item of customer.category_id || []) {
      const idx = addTags.indexOf(item.id);
      if (idx < 0) removeTags.push(item.id);
      else addTags.splice(idx, 1);
    }

    for (const item of customer.route_id || []) {
      const idx = addRoutes.indexOf(item.id);
      if (idx < 0) removeRoutes.push(item.id);
      else addRoutes.splice(idx, 1);
    }

    mutation
      .mutateAsync({
        id: customer.id,
        data: {
          update_uid: user.id,
          company_type: data.type,
          name: data.name,
          phone: data.phone,
          representative: data.representative,
          tax_code: data.taxCode,
          email: data.email,
          category: data.category?.[0],
          street2: data.address,
          address_state_id: data.state?.[0],
          address_district_id: data.district?.[0],
          address_town_id: data.town?.[0],
          // partner_latitude: data.coords?.lat,
          // partner_longitude: data.coords?.lng,
          distribution_channel_id: data.distributionChannel?.[0],
          crm_lead_user_id: data.userId?.[0],
          crm_lead_team_id: data?.teamId?.[0],
          crm_lead_crm_group_id: data?.groupId?.[0],
          superior_id: data.superior?.[0],
          contact_level: data.contactLevel?.[0],
          app_image_url: data.image,
          source_id: data.source?.[0],
          product_category_id: data.productCategory?.[0],
          category_id: {
            add: !isEmpty(addTags) ? addTags : [],
            remove: !isEmpty(removeTags) ? removeTags : [],
          },
          route_id: {
            add: !isEmpty(addRoutes) ? addRoutes : [],
            remove: !isEmpty(removeRoutes) ? removeRoutes : [],
          },
          frequency_visit_id: data.visitFrequency?.[0],
          visit_from_date: data.visitFromDate
            ? data.visitFromDate?.format('YYYY-MM-DD')
            : undefined,
        },
      })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['infinite-customers-list'],
        });
        queryClient.refetchQueries({
          queryKey: ['customer-detail'],
        });
        resetForm();
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Header
        title={customer?.res_partner_f99id || 'Thông tin khách hàng'}
        onPressBack={onPressBack}
      />

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
          <ClientFormStepOne />
        </View>
        <View key="2" style={{ height: '100%' }}>
          <ClientFormStepTwo />
        </View>
      </PagerView>

      <View style={styles.footer}>
        <Button text={pageIndex === 1 ? 'Lưu' : 'Tiếp theo'} onPress={next} />
      </View>
    </View>
  );
};

export default EditClientScreen;

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
