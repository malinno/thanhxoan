import ApiErp from '@app/api/ApiErp';
import HStack from '@app/components/HStack';
import Input from '@app/components/Input';
import PhotoInput from '@app/components/PhotoInput';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import useGeolocation from '@app/hooks/useGeolocation';
import { CheckInOutDto } from '@app/interfaces/dtos/check-in-out.dto';
import { UpdateCustomerDto } from '@app/interfaces/dtos/customer.dto';
import { ErpCheckInOut } from '@app/interfaces/entities/erp-checkin-out.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useCustomerDetail } from '@app/queries/customer.query';
import { useRouteScheduleDetail } from '@app/queries/route-plan.query';
import { useSlaCheckInDetail } from '@app/queries/sla-check-in.query';
import CustomerRepo from '@app/repository/customer/CustomerRepo';
import Button, { ButtonProps } from '@core/components/Button';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import Alert from '@core/components/popup/Alert';
import {
  ALERT_BUTTON_TYPE,
  AlertActionButton,
} from '@core/components/popup/AlertPopup';
import Popup from '@core/components/popup/Popup';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import PlaceUtils from '@core/utils/PlaceUtils';
import PriceUtils from '@core/utils/PriceUtils';
import UploadUtils from '@core/utils/UploadUtils';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'App';
import dayjs from 'dayjs';
import { getDistance } from 'geolib';
import { find, isEmpty, isNil, startsWith } from 'lodash';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import SwitchToggle from 'react-native-switch-toggle';
import CheckInOutCustomerView from './components/CheckInOutCustomerView';
import CheckInTimer from './components/CheckInTimer';
import { SlaState } from '@app/enums/check-in-state.enum';
import CheckInOutRepo from '@app/repository/check-in-out/CheckInOutRepo';
import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useCheckInOutDetail } from '@app/queries/check-in-out.query';
import CheckInOutQuickMenuItem from './components/CheckInOutQuickMenuItem';
import { TLocation } from '../address/MapScreen';

export type CheckInOutViewModel = {
  id?: number;
  check_in?: string;
  checkin_longitude?: number;
  checkin_latitude?: number;
  checkin_address?: string;
  check_out?: string;
  checkout_longitude?: number;
  checkout_latitude?: number;
  checkout_address?: string;
  note?: string;
  attachment_image_ids?: string[];
  sla_ref_id?: number;
  is_open?: boolean;
  saleperson_id?: [number, string];
  sla_state?: SlaState;
  category?: CheckInOutCategory;
  checkin_distance?: number;
  checkout_distance?: number;
};

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.CHECK_IN_OUT>;

const CheckInOutScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);
  const { geolocation, isFetching: isFetchingGeolocation } = useGeolocation();

  // states
  const [fetchingAddr, setFetchingAddr] = useState(false);
  const [data, setData] = useState<CheckInOutViewModel>({
    is_open: true,
    category: route.params.category,
    saleperson_id:
      !route.params?.checkInOutId && user ? [user.id, user.name] : undefined,
  });

  // queries
  const {
    data: checkInOutData,
    isFetching: isFetchingDetail,
    refetch: refetchCheckInOutDetail,
  } = useCheckInOutDetail(route.params?.checkInOutId);
  const { data: routeSchedule, isFetching: isFetchingRouteDetail } =
    useRouteScheduleDetail(
      route.params.routeScheduleId ||
        checkInOutData?.detail_router_plan_id?.[0],
    );
  const storeId =
    route.params.storeId ||
    routeSchedule?.store_id?.id ||
    checkInOutData?.store_id?.id;
  const {
    data: store,
    isFetching: isFetchingStore,
    refetch: refetchCustomerDetail,
  } = useCustomerDetail(storeId);
  const { data: slaCheckIn } = useSlaCheckInDetail(data?.sla_ref_id);

  // mutations
  const checkInMutation = useMutation({
    mutationFn: async (data: CheckInOutDto) => {
      return CheckInOutRepo.create(data);
    },
    onSuccess: ({ response, headers, error }) => {
      if (error || !response?.result || response.result.message) {
        throw error || response?.result;
      }

      const result: ErpCheckInOut = response.result?.checkin_out?.[0];

      setData(preState => ({
        ...preState,
        id: result.id,
        check_in: result.check_in,
        checkin_longitude: result.checkin_longitude,
        checkin_latitude: result.checkin_latitude,
        checkin_address: result.checkin_address,
        checkin_distance: result.checkin_distance,
        sla_ref_id: result?.sla_ref_id?.[0],
        is_open: result.is_open,
        saleperson_id: result?.salesperson_id,
        category: result?.category,
      }));

      queryClient.refetchQueries({
        queryKey: [
          'route-schedules-list',
          { router_plan_id: result.router_plan_id[0] },
        ],
      });
    },
    onError: error => {
      // const message = ApiErp.parseErrorMessage({
      //   error,
      // });
      // showAlert(message);
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async (payload: {
      checkInOutId: number;
      data: CheckInOutDto;
    }) => {
      const { data, checkInOutId } = payload;
      if (!data.update_uid) data.update_uid = user?.id;
      if (!isEmpty(data.attachment_image_ids)) {
        data.attachment_image_ids = await Promise.all(
          data.attachment_image_ids?.map(async path => {
            {
              if (path.startsWith('http')) return path;

              const res = await UploadUtils.uploadImage(
                { path },
                { maxSize: 1e6 },
              );
              return res;
            }
          }) || [],
        );
      }
      const { response, error } = await CheckInOutRepo.edit(checkInOutId, data);
      if (error || !response?.result || response.result.message) {
        throw error || response?.result;
      }
      const result: ErpCheckInOut = response.result?.checkin_out?.[0];
      const updateData: Partial<CheckInOutViewModel> = {};
      if (!isNil(data.is_open)) updateData.sla_ref_id = result.sla_ref_id?.[0];
      if (!isNil(data.check_out)) {
        updateData.check_out = result.check_out;
        updateData.checkout_longitude = result.checkout_longitude;
        updateData.checkout_latitude = result.checkout_latitude;
        updateData.checkout_address = result.checkout_address;
        updateData.checkout_distance = result.checkout_distance;
        updateData.sla_state = result.sla_state;
      }
      if (!isNil(data.note)) updateData.note = result.note;
      if (!isEmpty(data.attachment_image_ids))
        updateData.attachment_image_ids = result.attachment_image_ids;
      return updateData;
    },
    onSuccess: (result: Partial<CheckInOutViewModel>) => {
      setData(preState => ({
        ...preState,
        ...result,
      }));

      if (checkInOutData?.router_plan_id)
        queryClient.refetchQueries({
          queryKey: [
            'route-schedules-list',
            { router_plan_id: checkInOutData.router_plan_id[0] },
          ],
        });
    },
    onError: error => {
      const message = ApiErp.parseErrorMessage({
        error,
      });
      showAlert(message);
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async (data: UpdateCustomerDto) => {
      if (!store?.id) throw new Error(`store id is nil`);
      return CustomerRepo.update(store.id, data);
    },
    onSuccess: ({ response, headers, error }) => {
      if (error || !response?.result || response.result.message) {
        throw error || response?.result;
      }

      refetchCustomerDetail();
    },
    onError: error => {
      const message = ApiErp.parseErrorMessage({
        error,
      });
      showAlert(message);
    },
  });

  useEffect(() => {
    if (checkInOutData)
      setData({
        id: checkInOutData.id,
        check_in: checkInOutData.check_in,
        checkin_longitude: checkInOutData.checkin_longitude,
        checkin_latitude: checkInOutData.checkin_latitude,
        checkin_address: checkInOutData.checkin_address,
        checkin_distance: checkInOutData.checkin_distance,
        check_out: checkInOutData.check_out,
        checkout_longitude: checkInOutData.checkout_longitude,
        checkout_latitude: checkInOutData.checkout_latitude,
        checkout_address: checkInOutData.checkout_address,
        checkout_distance: checkInOutData.checkout_distance,
        note: checkInOutData.note,
        attachment_image_ids: checkInOutData.attachment_image_ids,
        sla_ref_id: checkInOutData.sla_ref_id?.[0],
        is_open: checkInOutData.is_open ?? true,
        saleperson_id: checkInOutData.salesperson_id,
        sla_state: checkInOutData.sla_state,
        category: checkInOutData.category,
      });
  }, [checkInOutData]);

  useEffect(() => {
    if (
      checkInMutation.isPending ||
      checkOutMutation.isPending ||
      updateCustomerMutation.isPending ||
      isFetchingDetail ||
      isFetchingRouteDetail ||
      isFetchingStore
    )
      Spinner.show();
    else Spinner.hide();
    return () => Spinner.hide();
  }, [
    checkInMutation.isPending,
    checkOutMutation.isPending,
    updateCustomerMutation.isPending,
    isFetchingDetail,
    isFetchingRouteDetail,
    isFetchingStore,
  ]);

  useEffect(() => {
    if (
      !data?.id ||
      data?.category !== CheckInOutCategory.working_route ||
      slaCheckIn?.is_open === data.is_open ||
      !user?.id
    )
      return;

    checkOutMutation.mutate({
      checkInOutId: data.id,
      data: {
        is_open: data.is_open,
        update_uid: user.id,
      },
    });
  }, [data.is_open, user, data?.id, data?.category]);

  const onChangeNote = (note: string) => setData({ ...data, note });

  const onChangeImages = (images: string[]) =>
    setData({ ...data, attachment_image_ids: images });

  const onPressOrdersList = () => {
    if (!store?.id) return;
    navigation.navigate(SCREEN.SALE_ORDERS_LIST, {
      filter: { partner_id: store?.id },
    });
  };

  const onPressPosOrdersList = () => {
    if (!store?.id) return;
    navigation.navigate(SCREEN.POS_ORDERS_LIST, {
      filter: { partner_id: store?.id },
    });
  };

  const onPressShowcaseDeclarations = () => {
    if (!storeId) return;

    navigation.navigate(SCREEN.SHOWCASE_DECLARATIONS, {
      storeId,
      routeSchedule,
    });
  };

  const onPressStockInventory = () => {
    if (!storeId) return;

    navigation.navigate(SCREEN.STOCK_INVENTORY_LIST, {
      filter: {
        agency_id: storeId,
        checkin_out_id: route.params?.checkInOutId,
      },
    });
  };

  const addImage = (checkInOutId?: number) => {
    if (!checkInOutId || !user) return;

    navigation.navigate(SCREEN.CAMERA, {
      onCaptured: (path: string) => {
        const imgPath = Platform.select({
          ios: path,
          default: `file://${path}`,
        });
        const images: string[] = [];
        if (data.attachment_image_ids) {
          images.push(...data.attachment_image_ids);
        }
        images.push(imgPath);

        setTimeout(() => {
          checkOutMutation.mutate({
            checkInOutId,
            data: {
              note: data.note,
              attachment_image_ids: images,
              update_uid: user.id,
            },
          });
        }, 300);
      },
    });
  };

  const checkIn = async () => {
    if (!geolocation || !user) return;

    const now = dayjs();
    setFetchingAddr(true);
    let addr = '';

    try {
      addr = await PlaceUtils.location2String(
        geolocation.coords.latitude,
        geolocation.coords.longitude,
      );
    } catch (error) {
      console.log(`get addr from string`, error);
    }

    try {
      checkInMutation
        .mutateAsync({
          note: data.note,
          attachment_image_ids: data.attachment_image_ids,
          check_in: now.format('YYYY-MM-DD HH:mm:ss'),
          checkin_latitude: geolocation.coords.latitude,
          checkin_longitude: geolocation.coords.longitude,
          checkin_address: addr,
          salesperson_id: user.id,
          create_uid: user.id,
          store_id: store?.id,
          router_plan_id: routeSchedule?.router_plan_id?.[0],
          detail_router_plan_id: routeSchedule?.id,
          category: data.category,
        })
        .then(response => {
          const result: ErpCheckInOut =
            response.response.result?.checkin_out?.[0];

          queryClient.refetchQueries({
            queryKey: ['check-in-out-list'],
          });

          // Optional check in image
          addImage(result.id);
        })
        .catch(err => {
          const messages = [
            ApiErp.parseErrorMessage({
              error: err,
            }),
          ];
          if (err.code) {
            switch (err.code) {
              // case 301:
              //   messages[0] = `Xin lỗi vị trí của bạn quá xa so với vị trí cửa hàng nên không thể check in, hãy di chuyển gần hơn đến vị trí cửa hàng hoặc di chuyển tới nơi có GPS tốt nhất`;
              //   break;
              default:
                messages[0] = `(#${err.code}) ${messages[0]}`;
                break;
            }
          }
          if (err.sla) messages.push(`SLA: ${err.sla.name}`);

          showAlert(messages.join('. '), [
            { text: 'Check in lại' },
            {
              text: 'Xem vị trí',
              onPress: () => {
                navigation.navigate(SCREEN.MAP, {
                  screenTitle: 'Vị trí khách hàng',
                  location:
                    store?.partner_latitude && store?.partner_longitude
                      ? {
                          latitude: store?.partner_latitude,
                          longitude: store?.partner_longitude,
                        }
                      : undefined,
                  readOnlyMode: true,
                });
              },
            },
          ]);
        });
    } catch (error) {
      console.log(`error`, error);
    } finally {
      setFetchingAddr(false);
    }
  };

  const checkOut = async (force = false) => {
    if (!geolocation || !user || !data.id) return;

    const now = dayjs();
    setFetchingAddr(true);

    let addr = '';
    try {
      addr = await PlaceUtils.location2String(
        geolocation.coords.latitude,
        geolocation.coords.longitude,
      );
    } catch (error) {
      console.log(`get addr from string`, error);
    } finally {
      setFetchingAddr(false);
    }

    checkOutMutation
      .mutateAsync({
        data: {
          note: data.note,
          attachment_image_ids: data.attachment_image_ids,
          check_out: now.format('YYYY-MM-DD HH:mm:ss'),
          checkout_latitude: geolocation?.coords.latitude,
          checkout_longitude: geolocation?.coords.longitude,
          checkout_address: addr,
          update_uid: user.id,
          pass_checkout_distance_validate: force,
        },
        checkInOutId: data.id,
      })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['check-in-out-list'],
        });

        // Optional check out image
        addImage(data.id);
      })
      .catch(err => {
        console.log(`check out error`, err);
        if (err?.code === 304) {
          showAlert(err?.message + '. Bạn vẫn muốn Check Out?', [
            { text: 'Vẫn check out', onPress: () => checkOut(true) },
          ]);
        }
      });
  };

  const onPressCheckIn = async () => {
    if (!geolocation || !user || checkInMutation.isPending) return;

    if (data.category === CheckInOutCategory.working_calendar) {
      return checkIn();
    }

    if (!store) return;

    console.log(
      `store location`,
      store.partner_latitude,
      store.partner_longitude,
    );
    // return
    if (!store.partner_latitude || !store.partner_longitude) {
      Alert.alert({
        title: 'Thông báo',
        image: images.common.imgMapMarker,
        message:
          'Cửa hàng chưa được xác minh vị trí. Bạn có muốn thiết lập vị trí hiện tại làm vị trí cửa hàng không?',
        actions: [
          {
            text: 'Huỷ',
            type: ALERT_BUTTON_TYPE.CANCEL,
          },
          {
            text: 'Thiết lập',
            onPress: () => {
              navigation.navigate(SCREEN.MAP, {
                screenTitle: 'Vị trí khách hàng',
                confirmText: 'Xác nhận vị trí',
                location: geolocation.coords
                  ? {
                      latitude: geolocation.coords.latitude,
                      longitude: geolocation.coords.longitude,
                    }
                  : undefined,
                onLocation: (location: TLocation) => {
                  updateCustomerMutation.mutate({
                    partner_latitude: location.latitude,
                    partner_longitude: location.longitude,
                    update_uid: user.id,
                  });
                },
                onPanDrag: () => {},
                zoomControlEnabled: false,
                zoomEnabled: false,
                scrollEnabled: false,
                rotateEnabled: false,
                pitchEnabled: false,
              });
            },
          },
        ],
      });
      return;
    }

    return checkIn();
  };

  const onPressSaveTemp = async () => {
    if (!geolocation || !user || !data.id || checkOutMutation.isPending) return;

    checkOutMutation.mutate({
      checkInOutId: data.id,
      data: {
        note: data.note,
        attachment_image_ids: data.attachment_image_ids,
        update_uid: user.id,
      },
    });
  };

  const validateCheckOut = () => {
    if (!slaCheckIn) return true;

    const errors = [];
    if (
      slaCheckIn.checkout_deviation &&
      !!data.checkout_distance &&
      data.checkout_distance > slaCheckIn.checkout_deviation
    )
      errors.push('Khoảng cách của bạn quá xa so với vị trí khách hàng');

    if (
      slaCheckIn.number_of_image &&
      slaCheckIn.number_of_image > (data.attachment_image_ids?.length || 0)
    )
      errors.push('Bạn chưa chụp đủ số lượng ảnh tối thiểu');

    const now = dayjs();
    const duration = now.diff(dayjs(data.check_in));
    const minDuration = slaCheckIn.min_time * 60 * 60 * 1000;
    const maxDuration = slaCheckIn.max_time * 60 * 60 * 1000;
    // console.log(`now `, now);
    // console.log(`checkin at `, dayjs(data.check_in).valueOf());
    // console.log(`duration milliseconds`, duration);
    // console.log(`min time milliseconds`, minDuration);
    // console.log(`max time milliseconds`, maxDuration);
    if (slaCheckIn.min_time && minDuration > duration) {
      errors.push('Bạn chưa đủ thời gian Check in tối thiểu');
    }

    if (slaCheckIn.max_time && maxDuration < duration) {
      errors.push('Bạn đã vượt quá thời gian Check in tối đa');
    }

    if (!isEmpty(errors)) {
      showAlert(errors.join(', ') + '. Bạn vẫn muốn Check Out?', [
        { text: 'Vẫn check out', onPress: checkOut },
      ]);
      return false;
    }

    return true;
  };

  const onPressCheckOut = async () => {
    if (
      !geolocation ||
      !user ||
      !data.id ||
      !validateCheckOut() ||
      checkOutMutation.isPending
    )
      return;

    checkOut();
  };

  const toggleOpen = () => {
    setData(preState => ({ ...preState, is_open: !preState.is_open }));
  };

  const onPressImageItem = (_: string, index: number) => {
    navigation.navigate(SCREEN.PHOTO_VIEWER, {
      index,
      images: data.attachment_image_ids || [],
    });
  };

  const showAlert = (message: string, actions?: AlertActionButton[]) => {
    Alert.alert({
      style: { width: 343 },
      title: 'Thông báo',
      titleContainerStyle: {
        borderBottomWidth: 1,
        borderColor: colors.colorEFF0F4,
        paddingBottom: 12,
      },
      image: images.common.imgBell,
      message,
      messageStyle: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.color161616BF,
      },
      messageContainerStyle: { borderBottomWidth: 0 },
      actions,
      renderActions: (actions: AlertActionButton[]) => (
        <HStack style={{ marginBottom: 30, justifyContent: 'center', gap: 16 }}>
          {actions.map((action, index) => {
            const _onPress = () => {
              Popup.hide();
              setTimeout(() => action.onPress && action.onPress(), 500);
              return;
            };
            return (
              <Button
                key={index}
                text={action.text}
                textStyle={{ fontSize: 14 }}
                onPress={_onPress}
                style={{ minHeight: 40, paddingHorizontal: 12 }}
              />
            );
          })}
        </HStack>
      ),
    });
    return;
  };

  const onPressExplanation = () => {
    if (!data?.id) return;

    navigation.navigate(SCREEN.CREATE_CHECK_IN_OUT_EXPLANATION, {
      checkInOutId: data.id,
    });
  };

  const hasCheckedIn = Boolean(data?.check_in);
  const hasCheckedOut = Boolean(data?.check_out);
  const hasValidImg = Boolean(
    find(data?.attachment_image_ids, img => startsWith(img, 'http')),
  );

  const _renderActions = () => {
    const actions: ButtonProps[] = [];
    if (data?.category === CheckInOutCategory.working_calendar) {
      if (!hasCheckedIn) {
        actions.push({
          text: 'Chấm công',
          colors: colors.color2745D4,
          onPress: onPressCheckIn,
          loading: fetchingAddr || checkInMutation.isPending,
        });
      }

      if (hasCheckedIn && !hasCheckedOut) {
        actions.push(
          ...[
            {
              text: 'Lưu ảnh',
              onPress: onPressSaveTemp,
              loading: checkOutMutation.isPending,
            },
            {
              text: 'Chấm công ra',
              colors: colors.red,
              onPress: onPressCheckOut,
              loading: fetchingAddr || checkInMutation.isPending,
            },
          ],
        );
      }
    } else {
      if (!hasCheckedIn) {
        actions.push({
          text: 'Check in',
          onPress: onPressCheckIn,
          loading: fetchingAddr || checkOutMutation.isPending,
        });
      }

      if (hasCheckedIn && !hasCheckedOut) {
        actions.push(
          ...[
            {
              text: 'Lưu nháp',
              onPress: onPressSaveTemp,
              loading: checkOutMutation.isPending,
            },
            {
              text: 'Check out',
              colors: colors.red,
              onPress: onPressCheckOut,
              loading: fetchingAddr || checkOutMutation.isPending,
            },
          ],
        );
      }

      if (!!data?.check_out && data?.sla_state !== SlaState.resolved) {
        actions.push({
          text: 'Giải trình check in - check out',
          onPress: onPressExplanation,
        });
      }
    }

    if (isEmpty(actions)) return null;

    return (
      <HStack style={styles.footer}>
        {actions.map((btnProps, index) => {
          const { style, ...properties } = btnProps;
          return (
            <Button
              key={String(index)}
              style={[styles.btn, style]}
              colors={colors.color2745D4}
              disabled={properties.loading}
              {...properties}
            />
          );
        })}
      </HStack>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={route.params.screenTitle}
        rightButtons={[
          {
            icon: images.common.homeAlt,
            onPress: () => navigation.dispatch(StackActions.popToTop()),
          },
        ]}
      />
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {!isNil(store) && (
          <CheckInOutCustomerView
            data={store}
            style={styles.customer}
            sla={slaCheckIn}
          />
        )}

        {data.category === CheckInOutCategory.working_route && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <HStack
              style={[
                styles.menu,
                (!hasCheckedIn || !hasValidImg) && { opacity: 0.5 },
              ]}>
              {store?.category?.[0] === 'distributor' && (
                <CheckInOutQuickMenuItem
                  icon={images.client.documentText}
                  text="Đơn bán NPP"
                  disabled={!hasCheckedIn || !hasValidImg}
                  onPress={onPressOrdersList}
                />
              )}
              <CheckInOutQuickMenuItem
                icon={images.client.cube}
                text="Kiểm tồn"
                disabled={!hasCheckedIn || !hasValidImg}
                onPress={onPressStockInventory}
              />
              <CheckInOutQuickMenuItem
                icon={images.tab.orders}
                text="Trưng bày"
                disabled={!hasCheckedIn || !hasValidImg}
                onPress={onPressShowcaseDeclarations}
              />

              {store?.category?.[0] === 'agency' && (
                <CheckInOutQuickMenuItem
                  icon={images.tab.others}
                  text="Đơn Đại lý"
                  disabled={!hasCheckedIn || !hasValidImg}
                  onPress={onPressPosOrdersList}
                />
              )}
            </HStack>
          </Animated.View>
        )}

        <CheckInTimer
          icon={images.client.user}
          text={data.saleperson_id?.[1]}
          from={data?.check_in ? dayjs(data?.check_in).valueOf() : undefined}
          to={data?.check_out ? dayjs(data?.check_out).valueOf() : undefined}
          style={styles.section}
        />

        {/* Check in section */}
        <View style={[styles.section, !hasCheckedIn && { opacity: 0.5 }]}>
          <HStack style={[styles.row, { marginTop: 0 }]}>
            <Image source={images.route.pinAlt} style={styles.icon} />
            <Text style={styles.text}>
              {data?.checkin_address || 'Chưa xác định'}
            </Text>
          </HStack>
          {data.category === CheckInOutCategory.working_route && (
            <HStack style={styles.row}>
              <Image source={images.client.gps} style={styles.icon} />
              <Text style={[styles.text, { color: colors.primary }]}>
                {!isNil(data?.checkin_distance)
                  ? PriceUtils.format(data.checkin_distance, 'm')
                  : 'Chưa xác định'}
              </Text>
            </HStack>
          )}
          <HStack style={styles.row}>
            <Image source={images.client.login} style={styles.icon} />
            <Text style={styles.text}>
              Check in:{' '}
              {data?.check_in
                ? dayjs(data.check_in).format('DD/MM/YYYY - HH:mm')
                : 'Chưa xác định'}
            </Text>
          </HStack>
        </View>

        {/* Check out section */}
        <View style={[styles.section, !hasCheckedIn && { opacity: 0.5 }]}>
          <HStack style={[styles.row, { marginTop: 0 }]}>
            <Image source={images.route.pinAlt} style={styles.icon} />
            <Text style={styles.text}>
              {data?.checkout_address || 'Chưa xác định'}
            </Text>
          </HStack>
          {data.category === CheckInOutCategory.working_route && (
            <HStack style={styles.row}>
              <Image source={images.client.gps} style={styles.icon} />
              <Text style={[styles.text, { color: colors.primary }]}>
                {!isNil(data?.checkout_distance)
                  ? PriceUtils.format(data.checkout_distance, 'm')
                  : 'Chưa xác định'}
              </Text>
            </HStack>
          )}
          <HStack style={styles.row}>
            <Image source={images.client.logout} style={styles.icon} />
            <Text style={styles.text}>
              Check out:{' '}
              {data?.check_out
                ? dayjs(data.check_out).format('DD/MM/YYYY - HH:mm')
                : 'Chưa xác định'}
            </Text>
          </HStack>
        </View>

        {data.category === CheckInOutCategory.working_route && (
          <PhotoInput
            style={{
              marginHorizontal: 16,
              marginTop: 8,
            }}
            title="NPP/ Đại lý"
            titleRightComponent={
              <SwitchToggle
                onPress={() => hasCheckedIn && !hasCheckedOut && toggleOpen()}
                backTextLeft={data.is_open ? 'Mở cửa' : ''}
                leftContainerStyle={{
                  position: 'absolute',
                  left: 10,
                }}
                textLeftStyle={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: colors.white,
                }}
                textRightStyle={{
                  fontSize: 12,
                  fontWeight: '400',
                  color: colors.white,
                }}
                switchOn={data.is_open ?? true}
                circleStyle={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.white,
                }}
                containerStyle={{
                  width: 88,
                  height: 32,
                  borderRadius: 18,
                  padding: 4,
                }}
                backgroundColorOn={colors.primary}
                circleColorOff={colors.white}
                TextComponent={Text}
              />
            }
            onPressItem={onPressImageItem}
            values={data.attachment_image_ids}
            onChange={onChangeImages}
            editable={hasCheckedIn && !hasCheckedOut}
            removableUploaded={false}
            error={
              slaCheckIn?.number_of_image && !hasCheckedOut
                ? `Chụp tối thiểu ${slaCheckIn?.number_of_image} ảnh mới được check out. Ảnh chụp cần rõ mặt, đồng phục và biển hiệu cửa hàng.`
                : ''
            }
          />
        )}

        {data.category === CheckInOutCategory.working_route && (
          <Input
            title="Nội dung trao đổi"
            style={styles.input}
            inputStyle={styles.note}
            placeholder={
              hasCheckedIn && !hasCheckedOut
                ? 'Nhập nội dung trao đổi'
                : 'Không có nội dung trao đổi'
            }
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
            value={data.note ? data.note : ''}
            onChangeText={onChangeNote}
            editable={hasCheckedIn && !hasCheckedOut}
          />
        )}

        {data.category === CheckInOutCategory.working_calendar && (
          <PhotoInput
            style={{
              marginHorizontal: 16,
              marginTop: 8,
            }}
            title="Hình ảnh chấm công"
            onPressItem={onPressImageItem}
            values={data.attachment_image_ids}
            onChange={onChangeImages}
            editable={hasCheckedIn && !hasCheckedOut}
            error={
              !hasCheckedOut
                ? 'Chụp ảnh cần rõ mặt, đồng phục và biển hiệu'
                : ''
            }
          />
        )}
      </KeyboardAwareScrollView>

      {_renderActions()}
    </View>
  );
};

export default CheckInOutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
  },
  customer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  menu: {
    gap: 4,
    height: 64,
    backgroundColor: colors.primary,
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: colors.white,
  },
  row: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
    marginTop: 1,
  },
  text: {
    flex: 1,
    color: colors.color161616,
  },
  input: {
    marginHorizontal: 16,
  },
  note: {
    height: 80,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  btn: {
    flex: 1,
  },
});
