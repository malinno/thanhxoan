import StepIndicator from '@app/components/StepIndicator';
import { POS_ORDER_STATE_MAPPING } from '@app/constants/pos-orders.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { usePosOrderForm } from '@app/hooks/usePosOrderForm';
import {
  PosOrderLineDto,
  UpdatePosOrderDto,
} from '@app/interfaces/dtos/pos-order.dto';
import { PosOrderLine } from '@app/interfaces/entities/pos-order-line.entity';
import { PosOrder } from '@app/interfaces/entities/pos-order.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useCustomerDetail } from '@app/queries/customer.query';
import {
  editPosOrderMutation,
  fetchPosOrderPromotionGiftMutation,
} from '@app/queries/pos-order.mutation';
import { usePosOrderDetail } from '@app/queries/pos-order.query';
import { usePromotionProgramDetail } from '@app/queries/promotion-program.query';
import Header from '@core/components/Header';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { queryClient } from 'App';
import dayjs from 'dayjs';
import { isEmpty, reduce } from 'lodash';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import PosOrderFormStepOne from './components/PosOrderFormStepOne';
import PosOrderFormStepTwo from './components/PosOrderFormStepTwo';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.EDIT_POS_ORDER>;

const EditPosOrderScreen: FunctionComponent<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);
  const mutation = editPosOrderMutation();
  const fetchPosOrderProductGifts = fetchPosOrderPromotionGiftMutation();
  const data = usePosOrderForm(state => state.data);
  const setData = usePosOrderForm(state => state.setData);
  const setErrors = usePosOrderForm(state => state.setErrors);
  const resetForm = usePosOrderForm(state => state.reset);

  const {
    data: posOrder,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = usePosOrderDetail(route.params.id);
  const { data: partner } = useCustomerDetail(posOrder?.partner_id?.[0]);
  const { data: promotionProgram } = usePromotionProgramDetail(
    posOrder?.ctkm_id?.id,
  );

  // states
  const [pageIndex, setPageIndex] = useState(0);

  // refs
  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  useEffect(() => {
    if (
      mutation.isPending ||
      isLoading ||
      isFetching ||
      isRefetching ||
      fetchPosOrderProductGifts.isPending
    )
      Spinner.show();
    else Spinner.hide();

    return () => {
      Spinner.hide();
    };
  }, [
    mutation.isPending,
    isLoading,
    isFetching,
    isRefetching,
    fetchPosOrderProductGifts.isPending,
  ]);

  useEffect(() => {
    if (posOrder) {
      const [lines, promotionLines] = reduce(
        posOrder?.order_line,
        (prev: [PosOrderLine[], PosOrderLine[]], line, index) => {
          if (
            line.is_dong_ctkm_chiet_khau ||
            line.is_dong_ctkm_tang_kem ||
            line.is_sanpham_khuyen_mai ||
            line.is_dongchietkhautongdon
          ) {
            prev[1].push(line);
            return prev;
          }
          prev[0].push(line);
          return prev;
        },
        [[], []],
      );

      setData({
        id: posOrder.id,
        distributor: posOrder.distributor_id,
        deliveryAddress: {
          id: posOrder.delivery_address_id?.[0],
          receiverName: posOrder.receiver_name,
          addressDetail: posOrder.partner_address_details,
          phone: posOrder.phone,
        },
        saleNote: posOrder.salesperson_note || '',
        priceList: posOrder.pricelist_id,
        journal: posOrder.journal_name,
        shippingAddressType: posOrder.shipping_address_type,
        deliveryExpectedDate: posOrder.delivery_expected_date
          ? dayjs(posOrder.delivery_expected_date, 'YYYY-MM-DD')
          : undefined,
        lines,
        promotionLines,
        subtotal: posOrder.tongtruocchietkhau,
        discount: posOrder.chietkhautongdon,
        tax: posOrder.amount_tax,
        total: posOrder.amount_total,
        percentageDiscountAmount: posOrder.phantramchietkhautongdon,
      });
    }
  }, [posOrder]);

  useEffect(() => {
    setData({ partner });
  }, [partner]);

  useEffect(() => {
    setData({ promotionProgram });
  }, [promotionProgram]);

  useEffect(() => {
    if (
      data.promotionProgram?.id &&
      posOrder &&
      data.promotionProgram?.id !== posOrder?.ctkm_id?.id
    ) {
      editPosOrder({
        onSuccess: posOrder => {
          console.log(`on edit pos order successfully`, posOrder);
          refetch();
        },
      });
    }
  }, [data.promotionProgram]);

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
    if (isEmpty(data?.distributor)) {
      errors.distributor = 'Vui lòng chọn bên bán';
    }
    if (isEmpty(data?.partner)) {
      errors.partner = 'Vui lòng chọn khách hàng';
    }
    if (isEmpty(data?.deliveryAddress)) {
      errors.deliveryAddress = 'Vui lòng chọn địa chỉ nhận';
    }
    setErrors(errors);
    return isEmpty(errors);
  };

  const validateStepTwo = () => {
    let errors: Record<string, string> = {};

    return isEmpty(errors);
  };

  const next = async () => {
    if (pageIndex > 1) return;
    switch (pageIndex) {
      case 0: {
        if (!validateStepOne()) return;
        pagerRef.current?.setPage(pageIndex + 1);
        break;
      }
      case 1: {
        if (!validateStepTwo() || !route.params.id) return;

        if (data.promotionProgram?.id) {
          return navigation.dispatch(
            StackActions.replace(SCREEN.POS_ORDER_DETAIL, {
              id: route.params.id,
            }),
          );
          // const { response } = await fetchPosOrderProductGifts.mutateAsync({
          //   id: route.params.id,
          //   promotionProgramId: data.promotionProgram?.id,
          // });
          // const productGift = response?.product_gift;
          // if (productGift?.wizard_id) {
          //   return navigation.dispatch(
          //     StackActions.replace(SCREEN.POS_ORDER_DETAIL, {
          //       id: route.params.id,
          //     }),
          //   );
          // }
        }

        return editPosOrder();
      }
      default:
        pagerRef.current?.setPage(pageIndex + 1);
        break;
    }
  };

  const editPosOrder = (
    callback: TSaveOrderArguments<PosOrder> = { onSuccess: onPosOrderEdited },
  ) => {
    if (!user?.id || !data.partner || !posOrder?.id) return;

    const addLines: PosOrderLineDto[] = (data.lines || []).map(line => ({
        product_id: line.product_id.id,
        product_uom_qty: line.product_uom_qty,
        price_unit: line.price_unit,
        discount: line.discount,
      })),
      updateLines: Record<string, PosOrderLineDto> = {},
      removeLines: number[] = [];

    for (const line of posOrder?.order_line || []) {
      const isPromotionLine =
        line.is_dong_ctkm_chiet_khau ||
        line.is_dong_ctkm_tang_kem ||
        line.is_sanpham_khuyen_mai ||
        line.is_dongchietkhautongdon;
      if (isPromotionLine) continue;

      const idx = addLines.findIndex(
        addLine => addLine.product_id === line.product_id.id,
      );
      if (idx < 0) {
        if (line.id) removeLines.push(Number(line.id));
      } else {
        if (line.id)
          updateLines[String(line.id)] = {
            product_id: addLines[idx].product_id,
            product_uom_qty: addLines[idx].product_uom_qty,
            price_unit: addLines[idx].price_unit,
            discount: addLines[idx].discount,
          };
        addLines.splice(idx, 1);
      }
    }

    const updateData: UpdatePosOrderDto = {
      update_uid: user.id,
      distributor_id: Number(data.distributor?.[0]),
      partner_id: Number(data.partner.id),
      receiver_name: String(data.deliveryAddress?.receiverName),
      delivery_address_id: Number(data.deliveryAddress?.id),
      journal_name: data.journal,
      shipping_address_type: data.shippingAddressType,
      pricelist_id: data.priceList?.[0],
      salesperson_note: data.saleNote,
      delivery_expected_date: data.deliveryExpectedDate
        ? data.deliveryExpectedDate.format('YYYY-MM-DD')
        : undefined,
      order_line: {
        create: !isEmpty(addLines) ? addLines : undefined,
        remove: !isEmpty(removeLines) ? removeLines : undefined,
        update: !isEmpty(updateLines) ? updateLines : undefined,
      },
      ctkm_id: data.promotionProgram?.id || false,
      is_update_ctkm: true,
      phantramchietkhautongdon: data.percentageDiscountAmount,
    };

    mutation
      .mutateAsync({
        id: posOrder.id,
        data: updateData,
      })
      .then(({ response }) => {
        const result = response?.result?.pos_orders?.[0];
        callback?.onSuccess?.(result);
      })
      .catch(err => {
        callback?.onFailure?.(err);
      });
  };

  const onPosOrderEdited = (result: PosOrder) => {
    queryClient.refetchQueries({
      queryKey: ['pos-order-detail', result.id],
    });
    queryClient.refetchQueries({
      queryKey: ['fetch-infinite-pos-order-list'],
    });
    queryClient.refetchQueries({
      queryKey: ['pos-orders-list'],
    });
    resetForm();
    navigation.goBack();
  };

  const state = posOrder?.state
    ? POS_ORDER_STATE_MAPPING[posOrder?.state]
    : undefined;

  return (
    <View style={styles.container}>
      <Header
        title={posOrder?.name || 'Thông tin đơn hàng'}
        onPressBack={onPressBack}
        headerRight={
          state ? (
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
          ) : null
        }
      />

      <StepIndicator
        labels={['Khách hàng', 'Sản phẩm']}
        currentPosition={pageIndex}
      />

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        scrollEnabled={false}
        onPageSelected={_onPageChanged}>
        <View key="1" style={{ height: '100%' }}>
          <PosOrderFormStepOne next={next} previous={previous} />
        </View>
        <View key="2" style={{ height: '100%' }}>
          <PosOrderFormStepTwo
            next={next}
            previous={previous}
            save={editPosOrder}
          />
        </View>
      </PagerView>
    </View>
  );
};

export default EditPosOrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorF6F7F9,
  },
  state: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '500',
    maxWidth: Number(90).adjusted(),
  },
  pagerView: {
    flex: 1,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    gap: 16,
  },
  button: {
    flex: 1,
  },
});
