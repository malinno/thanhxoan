import StepIndicator from '@app/components/StepIndicator';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { useSaleOrderForm } from '@app/hooks/useSaleOrderForm';
import {
  SaleOrderLineDto,
  UpdateSaleOrderDto,
} from '@app/interfaces/dtos/sale-order.dto';
import { SaleOrderLine } from '@app/interfaces/entities/sale-order-line.entity';
import { SaleOrder } from '@app/interfaces/entities/sale-order.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useCustomerDetail } from '@app/queries/customer.query';
import {
  createSaleOrderMutation,
  editSaleOrderMutation,
  fetchSaleOrderPromotionGiftMutation,
} from '@app/queries/sale-order.mutation';
import { useSaleOrderDetail } from '@app/queries/sale-order.query';
import Header from '@core/components/Header';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { queryClient } from 'App';
import dayjs from 'dayjs';
import { isEmpty, reduce } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import SaleOrderFormStepOne from './components/SaleOrderFormStepOne';
import SaleOrderFormStepTwo from './components/SaleOrderFormStepTwo';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CREATE_SALE_ORDER
>;

const CreateSaleOrderScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);
  const screenParams = route.params;

  const createMutation = createSaleOrderMutation();
  const editMutation = editSaleOrderMutation();
  const fetchSaleOrderProductGifts = fetchSaleOrderPromotionGiftMutation();

  const data = useSaleOrderForm(state => state.data);
  const setData = useSaleOrderForm(state => state.setData);
  const setErrors = useSaleOrderForm(state => state.setErrors);
  const resetForm = useSaleOrderForm(state => state.reset);

  const { data: initialPartner } = useCustomerDetail(screenParams?.partnerId);

  // states
  const [pageIndex, setPageIndex] = useState(0);

  // refs
  const pagerRef = useRef<PagerView>(null);
  const orderId = useRef<number>();

  const {
    data: order,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useSaleOrderDetail(orderId.current);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  useEffect(() => {
    if (createMutation.isPending || editMutation.isPending) Spinner.show();
    else Spinner.hide();

    return () => {
      Spinner.hide();
    };
  }, [createMutation.isPending, editMutation.isPending]);

  useEffect(() => {
    if (user?.crm_group_id) {
      setData({
        crmGroup: [user.crm_group_id.id, user.crm_group_id.name],
      });
    }
  }, [user?.crm_group_id]);

  useEffect(() => {
    if (initialPartner) {
      setData({
        partner: initialPartner,
        deliveryAddress: initialPartner
          ? {
              id: initialPartner.id,
              receiverName: initialPartner.name,
              phone: initialPartner.phone,
              addressDetail: initialPartner.street2,
            }
          : undefined,
      });
    }
  }, [initialPartner]);

  useEffect(() => {
    if (order) {
      const [lines, promotionLines] = reduce(
        order?.order_line,
        (prev: [SaleOrderLine[], SaleOrderLine[]], line, index) => {
          const isPromotionLine =
            line.is_gift || line.is_bonus || line.is_sanpham_khuyen_mai;
          if (isPromotionLine) {
            prev[1].push(line);
            return prev;
          }
          prev[0].push(line);
          return prev;
        },
        [[], []],
      );

      // console.log(
      //   `promotion lines`,
      //   promotionLines.map(l => l.id),
      // );

      setData({
        crmGroup: order.crm_group_id,
        deliveryAddress: {
          id: order.delivery_address_id?.[0],
          receiverName: order.receiver_name,
          addressDetail: order.partner_address_details,
          phone: order.phone,
        },
        saleNote: order.salesperson_note || '',
        priceList: order.pricelist_id
          ? [order.pricelist_id.id, order.pricelist_id.name]
          : undefined,
        warehouse: order.warehouse_id
          ? [order.warehouse_id.id, order.warehouse_id.name]
          : undefined,
        journal: order.journal_name,
        shippingAddressType: order.shipping_address_type,
        expectedDate: order.expected_date
          ? dayjs(order.expected_date, 'YYYY-MM-DD')
          : undefined,
        lines,
        promotionLines,
        subtotal: order.tongtruocchietkhau,
        discount: order.chietkhautongdon,
        tax: order.amount_tax,
        total: order.amount_total,
        promotionProgram: order.ctkm_id,
      });
    }
  }, [order]);

  useEffect(() => {
    if (order && data.promotionProgram?.id !== order?.ctkm_id?.id) {
      editOrder({
        onSuccess: order => {
          console.log(`on edit sale order successfully`, order);
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

  const next = () => {
    if (pageIndex > 1) return;
    switch (pageIndex) {
      case 1: {
        if (orderId.current && data.promotionProgram?.id) {
          return navigation.dispatch(
            StackActions.replace(SCREEN.SALE_ORDER_DETAIL, {
              id: orderId.current,
            }),
          );
        }

        saveOrder();
        break;
      }
      case 0:
      default:
        pagerRef.current?.setPage(pageIndex + 1);
        break;
    }
  };

  const saveOrder = async (callback?: TSaveOrderArguments<SaleOrder>) => {
    if (!orderId.current) return createOrder(callback);
    return editOrder(callback);
  };

  const createOrder = (
    callback: TSaveOrderArguments<SaleOrder> = {
      onSuccess: onSaleOrderCreated,
    },
  ) => {
    if (!user?.id || !data.partner) return;

    createMutation
      .mutateAsync({
        create_uid: user.id,
        user_id: user.id,
        crm_group_id: Number(data.crmGroup?.[0]),
        partner_id: Number(data.partner.id),
        partner_address_details: String(data.deliveryAddress?.addressDetail),
        receiver_name: String(data.deliveryAddress?.receiverName),
        delivery_address_id: Number(data.deliveryAddress?.id),
        journal_name: data.journal,
        shipping_address_type: data.shippingAddressType,
        pricelist_id: Number(data.priceList?.[0]),
        warehouse_id: Number(data.warehouse?.[0]),
        is_package_viewable: true,
        salesperson_note: data.saleNote,
        expected_date: data.expectedDate
          ? data.expectedDate.format('YYYY-MM-DD')
          : undefined,
        order_line: {
          create:
            data.lines && !isEmpty(data.lines)
              ? data.lines.map(line => ({
                  product_id: line.product_id.id,
                  product_uom_qty: line.product_uom_qty,
                }))
              : undefined,
        },
        ctkm_id: data.promotionProgram?.id,
      })
      .then(({ response }) => {
        const result = response?.result?.orders?.[0];
        orderId.current = result.id;
        refetch();
        callback?.onSuccess?.(result);
      })
      .catch(err => {
        callback?.onFailure?.(err);
      });
  };

  const onSaleOrderCreated = (result: SaleOrder) => {
    if (orderId.current) {
      queryClient.refetchQueries({
        queryKey: ['sale-order-detail', result.id],
      });
    }
    queryClient.refetchQueries({
      queryKey: ['fetch-infinite-sale-order-list'],
    });
    queryClient.refetchQueries({
      queryKey: ['sale-orders-list'],
    });
    resetForm();
    navigation.dispatch(
      StackActions.replace(SCREEN.SALE_ORDER_DETAIL, {
        id: result.id,
      }),
    );
  };

  const editOrder = (
    callback: TSaveOrderArguments<SaleOrder> = {
      onSuccess: onSaleOrderCreated,
    },
  ) => {
    if (!user?.id || !data.partner || !order?.id) return;

    const addLines = (data.lines || []).map(line => ({
        product_id: line.product_id.id,
        product_uom_qty: line.product_uom_qty,
        price_unit: line.price_unit,
        discount: line.discount,
      })),
      updateLines: Record<string, SaleOrderLineDto> = {},
      removeLines: number[] = [];

    for (const line of order?.order_line || []) {
      const isPromotionLine =
        line.is_gift || line.is_bonus || line.is_sanpham_khuyen_mai;
      if (isPromotionLine || line.is_delivery) continue;

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

    const payload: UpdateSaleOrderDto = {
      update_uid: user.id,
      partner_id: Number(data.partner.id),
      receiver_name: String(data.deliveryAddress?.receiverName),
      delivery_address_id: Number(data.deliveryAddress?.id),
      journal_name: data.journal,
      shipping_address_type: data.shippingAddressType,
      pricelist_id: data.priceList?.[0],
      salesperson_note: data.saleNote,
      expected_date: data.expectedDate
        ? data.expectedDate.format('YYYY-MM-DD')
        : undefined,
      order_line: {
        create: !isEmpty(addLines) ? addLines : undefined,
        remove: !isEmpty(removeLines) ? removeLines : undefined,
        update: !isEmpty(updateLines) ? updateLines : undefined,
      },
      ctkm_id: data.promotionProgram?.id || false,
    };
    if (data.warehouse?.[0] !== order?.warehouse_id?.id) {
      payload.warehouse_id = data.warehouse?.[0];
    }

    editMutation
      .mutateAsync({
        id: order.id,
        data: payload,
      })
      .then(({ response }) => {
        const result = response?.result?.orders?.[0];
        callback?.onSuccess?.(result);
      })
      .catch(err => {
        callback?.onFailure?.(err);
      });
  };

  return (
    <View style={styles.container}>
      <Header
        title={order?.name || 'Đơn bán NPP'}
        onPressBack={onPressBack}
        headerRight={
          <View style={[styles.state, { backgroundColor: colors.colorFFECA7 }]}>
            <Text style={[styles.stateText, { color: colors.color8C6D00 }]}>
              Báo giá
            </Text>
          </View>
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
          <SaleOrderFormStepOne next={next} previous={previous} />
        </View>
        <View key="2" style={{ height: '100%' }}>
          <SaleOrderFormStepTwo
            next={next}
            previous={previous}
            save={saveOrder}
          />
        </View>
      </PagerView>
    </View>
  );
};

export default CreateSaleOrderScreen;

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
});
