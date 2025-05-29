import StepIndicator from '@app/components/StepIndicator';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import {
  CUSTOMER_FORM_INITIAL_DATA,
  useCustomerForm,
} from '@app/hooks/useCustomerForm';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { createCustomerMutation } from '@app/queries/customer.mutation';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import ClientFormStepOne from './components/ClientFormStepOne';
import ClientFormStepTwo from './components/ClientFormStepTwo';
import { queryClient } from 'App';
import { isEmpty, isNil } from 'lodash';
import TextUtils from '@core/utils/TextUtils';
import useGeolocation from '@app/hooks/useGeolocation';
import PlaceUtils from '@core/utils/PlaceUtils';
import { CompanyType } from '@app/enums/company-type.enum';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.CREATE_CLIENT>;

const CreateClientScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const setData = useCustomerForm(state => state.setData);
  const setErrors = useCustomerForm(state => state.setErrors);
  const resetForm = useCustomerForm(state => state.reset);

  const mutation = createCustomerMutation();

  // const {
  //   geolocation,
  //   isFetching: isFetchingCurrentPosition,
  //   error: geolocationError,
  // } = useGeolocation(false);

  // useEffect(() => {
  //   setData({ isFetchingGeolocation: isFetchingCurrentPosition });
  // }, [isFetchingCurrentPosition]);

  // useEffect(() => {
  //   if (!geolocation) return;
  //   PlaceUtils.location2String(
  //     geolocation.coords.latitude,
  //     geolocation.coords.longitude,
  //   ).then(addr =>
  //     setData({
  //       // address: addr,
  //       coords: {
  //         lat: geolocation?.coords.latitude,
  //         lng: geolocation?.coords.longitude,
  //       },
  //     }),
  //   );
  // }, [geolocation]);

  // states
  const data = useCustomerForm(state => state.data);
  const [pageIndex, setPageIndex] = useState(0);

  // refs
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

    return () => {
      Spinner.hide();
    };
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
    setErrors(errors);
    return isEmpty(errors);
  };

  const validateStepTwo = () => {
    let errors: Record<string, string> = {};

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

    if (isEmpty(data?.distributionChannel)) {
      errors.distributionChannel = 'Chọn kênh phân phối';
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
    if (!user?.id) return;
    mutation
      .mutateAsync({
        create_uid: user.id,
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
        partner_latitude: data.coords?.lat,
        partner_longitude: data.coords?.lng,
        distribution_channel_id: data.distributionChannel?.[0],
        crm_lead_user_id: data?.userId?.[0],
        crm_lead_team_id: data?.teamId?.[0],
        crm_lead_crm_group_id: data?.groupId?.[0],
        superior_id: data.superior?.[0],
        contact_level: data.contactLevel?.[0],
        app_image_url: data.image,
        source_id: data.source?.[0],
        product_category_id: data.productCategory?.[0],
        category_id:
          !isNil(data.tags) && !isEmpty(data.tags)
            ? { add: data.tags.map(it => it.id) }
            : undefined,
        route_id:
          !isNil(data.routes) && !isEmpty(data.routes)
            ? { add: data.routes.map(it => it[0]) }
            : undefined,
        frequency_visit_id: data.visitFrequency?.[0],
        visit_from_date: data.visitFromDate
          ? data.visitFromDate?.format('YYYY-MM-DD')
          : undefined,
      })
      .then(({ response }) => {
        const result = response?.result?.customers?.[0];
        queryClient.refetchQueries({
          queryKey: ['infinite-customers-list'],
        });
        resetForm();
        navigation.dispatch(
          StackActions.replace(SCREEN.CLIENT_DETAIL, {
            id: result.id,
          }),
        );
      })
      .catch(err => {
        console.log(err);
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
        initialPage={0}
        scrollEnabled={false}
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

export default CreateClientScreen;

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
