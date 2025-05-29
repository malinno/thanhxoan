import StepIndicator from '@app/components/StepIndicator';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { useReturnProductForm } from '@app/hooks/useReturnProductForm';
import { ReturnProduct } from '@app/interfaces/entities/return-product.entity';
import { SaleOrder } from '@app/interfaces/entities/sale-order.entity';
import { ErpBaseLineData } from '@app/interfaces/network/erp-base-line-dto.type';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import {
  createReturnProductMutation,
  updateReturnProductMutation,
  useReturnProductDetail,
} from '@app/queries/return-product.query';
import { fetchSaleOrderPromotionGiftMutation } from '@app/queries/sale-order.mutation';
import Header from '@core/components/Header';
import Alert from '@core/components/popup/Alert';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { queryClient } from 'App';
import { isEmpty } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import { Toast } from 'react-native-toast-notifications';
import CreateReturnProductStepOne from './components/CreateReturnProductStepOne';
import CreateReturnProductStepTwo from './components/CreateReturnProductStepTwo';
import { ReturnProductStateComponent } from './components/ReturnProductStateComponent';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CREATE_RETURN_PRODUCT
>;

const CreateReturnProductScreen: FC<Props> = ({ route, ...props }) => {
  const { partnerId, id } = route.params;
  const navigation = useNavigation();
  const user = useAuth(state => state.user);
  const createMutation = createReturnProductMutation();
  const editMutation = updateReturnProductMutation();
  const fetchSaleOrderProductGifts = fetchSaleOrderPromotionGiftMutation();

  const data = useReturnProductForm(state => state.data);
  const setData = useReturnProductForm(state => state.setData);
  const setErrors = useReturnProductForm(state => state.setErrors);
  const resetForm = useReturnProductForm(state => state.reset);
  const [oldData, setOldData] = useState<ReturnProduct>();

  // states
  const [pageIndex, setPageIndex] = useState(0);

  // refs
  const pagerRef = useRef<PagerView>(null);
  const returnProductId = useRef<number>();

  const { data: returnDataDetail, isLoading } = useReturnProductDetail(
    Number(id),
    !!id,
  );
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  useEffect(() => {
    if (isLoading) Spinner.show();
    else Spinner.hide();
    return () => {
      Spinner.hide();
    };
  }, [isLoading]);

  useEffect(() => {
    if (returnDataDetail && id) {
      returnProductId.current = Number(id);
      setOldData(returnDataDetail);
      setData({
        partner_id: returnDataDetail.partner_id,
        reason_return_id: returnDataDetail.reason_return_id,
        warehouse_id: returnDataDetail.warehouse_id,
        description: returnDataDetail.description,
        pricelist_id: returnDataDetail.pricelist_id,
        state: returnDataDetail.state,
        proposal_line_ids: returnDataDetail?.proposal_line_ids?.map(x => ({
          product_id: x.product_id,
          is_gift: x.is_gift,
          product_uom_qty: x.product_uom_qty,
          discount: x.discount,
          tax_id: x.tax_id.map(tax => ({ id: tax.id, name: tax.name })),
          ghichu: x.ghichu,
        })),
      });
    }
  }, [returnDataDetail]);

  console.log(`returnDataDetail`, returnDataDetail);

  useEffect(() => {
    if (createMutation.isPending || editMutation.isPending) Spinner.show();
    else Spinner.hide();

    return () => {
      Spinner.hide();
    };
  }, [createMutation.isPending, editMutation.isPending]);

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
    if (!id) return createOrder(callback);
    return editOrder(callback);
  };

  const createOrder = (
    callback: TSaveOrderArguments<SaleOrder> = {
      onSuccess: onSaleOrderCreated,
    },
  ) => {
    if (!user?.id || !data.partner_id) return;

    createMutation
      .mutateAsync({
        data: {
          partner_id: Number(data.partner_id.id),
          reason_return_id: data.reason_return_id?.id,
          warehouse_id: data.warehouse_id?.id,
          description: data?.description || '',
          pricelist_id: data.pricelist_id?.id,
          proposal_line_ids: data.proposal_line_ids?.map(line => {
            let pr: any = {
              product_id: line.product_id.id,
              product_uom_qty: line.product_uom_qty,
              discount: line.discount,
              ghichu: line?.ghichu || '',
              is_gift: line.is_gift,
            };
            if (!isEmpty(line.tax_id)) {
              pr.tax_id = [[6, 0, [line.tax_id[0].id]]];
            }
            return [0, 0, pr];
          }),
        },
      })
      .then(result => {
        if (result?.response?.result) {
          Toast.show('Tạo yêu cầu đổi trả thành công');
          queryClient.refetchQueries({
            queryKey: ['infinite-return-product-list'],
          });
          queryClient.refetchQueries({
            queryKey: ['proposal-product-return-group-list'],
          });

          resetForm();
          navigation.dispatch(
            StackActions.replace(SCREEN.RETURN_PRODUCTS_LIST, {
              partnerId: partnerId,
            }),
          );
        } else {
          Alert.alert({
            title: 'Thông báo',
            message: 'Tạo yêu cầu đổi trả thất bại',
          });
        }
      })
      .catch(err => {
        console.log('err', err);
        callback?.onFailure?.(err);
      });
  };

  const onSaleOrderCreated = (result: SaleOrder) => {
    // if (orderId.current) {
    //   queryClient.refetchQueries({
    //     queryKey: ['sale-order-detail', result.id],
    //   });
    // }
    // queryClient.refetchQueries({
    //   queryKey: ['fetch-infinite-sale-order-list'],
    // });
    // queryClient.refetchQueries({
    //   queryKey: ['sale-orders-list'],
    // });
    // resetForm();
    // navigation.dispatch(
    //   StackActions.replace(SCREEN.SALE_ORDER_DETAIL, {
    //     id: result.id,
    //   }),
    // );
  };

  const editOrder = (
    callback: TSaveOrderArguments<SaleOrder> = {
      onSuccess: onSaleOrderCreated,
    },
  ) => {
    if (!user?.id || !data.partner_id) return;
    const addLines = (data.proposal_line_ids || []).map(line => ({
        product_id: line.product_id.id,
        product_uom_qty: line.product_uom_qty,
        discount: line.discount,
        ghichu: line?.ghichu || '',
        is_gift: line.is_gift,
        tax_id: line.tax_id,
      })),
      updateLines: Record<string, any> = {},
      removeLines: number[] = [];
    for (const line of returnDataDetail?.proposal_line_ids || []) {
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
            discount: addLines[idx].discount,
            ghichu: addLines[idx].ghichu,
            is_gift: addLines[idx].is_gift,
            tax_id: addLines[idx].tax_id,
          };
        addLines.splice(idx, 1);
      }
    }

    const add_proposal_line_ids = addLines.map(line => [0, 0, line]);
    const update_proposal_line_ids = Object.entries(updateLines).map(
      ([id, line]) => [1, Number(id), line],
    );
    const remove_proposal_line_ids = removeLines.map(id => [3, id, false]);

    const line = [
      ...add_proposal_line_ids,
      ...update_proposal_line_ids,
      ...remove_proposal_line_ids,
    ].map(function (x: any) {
      const pr = x[2];
      if (x[0] !== 3 && !isEmpty(pr?.tax_id)) {
        // nễu là thêm và sửa
        pr.tax_id = [[6, 0, [pr.tax_id[0].id]]];
      }
      if (x[0] === 3 || x[0] === 5) return x;
      if (x[0] === 1) return [1, x[1], pr] as ErpBaseLineData<any>;
      return [0, 0, pr] as ErpBaseLineData<any>;
    });
    console.log({
      add_proposal_line_ids,
      update_proposal_line_ids,
    });
    console.log(`line`, line);
    editMutation
      .mutateAsync({
        id: returnProductId.current as number,
        data: {
          partner_id: Number(data.partner_id.id),
          reason_return_id: data.reason_return_id?.id,
          warehouse_id: data.warehouse_id?.id,
          description: data?.description || '',
          pricelist_id: data.pricelist_id?.id,
          proposal_line_ids: line,
        },
      })
      .then(result => {
        if (result?.response?.result) {
          Toast.show('Cập nhật yêu cầu đổi trả thành công');
          queryClient.refetchQueries({
            queryKey: ['infinite-return-product-list'],
          });
          queryClient.refetchQueries({
            queryKey: ['proposal-product-return-group-list'],
          });
          queryClient.refetchQueries({
            queryKey: ['return-product-detail', id],
          });
          resetForm();
          navigation.dispatch(
            StackActions.replace(SCREEN.RETURN_PRODUCT_DETAIL, {
              partnerId: partnerId,
              id,
            }),
          );
        } else {
          Alert.alert({
            title: 'Thông báo',
            message: 'Tạo yêu cầu đổi trả thất bại',
          });
        }
      })
      .catch(err => {
        console.log('err', err);
        callback?.onFailure?.(err);
      });
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Đề nghị đổi trả'}
        onPressBack={onPressBack}
        headerRight={
          <View style={[styles.state]}>
            <ReturnProductStateComponent state={data?.state!} />
          </View>
        }
      />

      <StepIndicator
        labels={['Thông tin', 'Sản phẩm']}
        currentPosition={pageIndex}
      />

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        scrollEnabled={false}
        onPageSelected={_onPageChanged}>
        <View key="1" style={{ height: '100%' }}>
          <CreateReturnProductStepOne
            next={next}
            previous={previous}
            partnerId={partnerId}
          />
        </View>
        <View key="2" style={{ height: '100%' }}>
          <CreateReturnProductStepTwo
            next={next}
            previous={previous}
            save={saveOrder}
          />
        </View>
      </PagerView>
    </View>
  );
};

export default CreateReturnProductScreen;

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
    marginRight: 12,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '500',
    maxWidth: Number(90).adjusted(),
  },
});
