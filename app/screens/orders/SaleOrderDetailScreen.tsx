import HStack from '@app/components/HStack';
import Section from '@app/components/Section';
import SectionRow from '@app/components/SectionRow';
import { SALE_ORDER_STATE_MAPPING } from '@app/constants/sale-orders.constant';
import { SaleOrderState } from '@app/enums/sale-order.state.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { SaleOrderLine } from '@app/interfaces/entities/sale-order-line.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useSaleOrderDetail } from '@app/queries/sale-order.query';
import Header, { HeaderButton } from '@core/components/Header';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import PriceUtils from '@core/utils/PriceUtils';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { isEmpty, isNil, reduce } from 'lodash';
import React, { FC, Fragment, useEffect } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import SaleOrderDetailLine from './components/SaleOrderDetailLine';
import Button, { ButtonProps } from '@core/components/Button';
import { updateSaleOrderStateMutation } from '@app/queries/sale-order.mutation';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { TSaleOrderStateDto } from '@app/repository/order/SaleOrderRepo';
import { queryClient } from 'App';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.SALE_ORDER_DETAIL
>;

const SaleOrderDetailScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const {
    data: order,
    refetch,
    isRefetching,
  } = useSaleOrderDetail(route.params.id);

  const stateMutation = updateSaleOrderStateMutation();

  // effects
  useEffect(() => {
    if (stateMutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => Spinner.hide();
  }, [stateMutation.isPending]);

  const onPressEdit = () => {
    if (!order?.id) return;
    navigation.navigate(SCREEN.EDIT_SALE_ORDER, { id: order.id });
  };

  const onPressVerify = () => {
    updateState('verify');
  };

  const onPressConfirmPayment = () => {
    updateState('confirm_payment');
  };

  const onPressRejectPayment = () => {
    updateState('reject_payment');
  };

  const updateState = (state: TSaleOrderStateDto) => {
    if (!order?.id) return;

    stateMutation
      .mutateAsync({
        id: order.id,
        state,
      })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['fetch-infinite-sale-order-list'],
        });
        queryClient.refetchQueries({
          queryKey: ['sale-orders-list'],
        });
        queryClient.refetchQueries({
          queryKey: ['sale-order-detail'],
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const state = order?.summary_state
    ? SALE_ORDER_STATE_MAPPING[order?.summary_state]
    : undefined;

  const [lines, promotionLines] = reduce(
    order?.order_line,
    (prev: [SaleOrderLine[], SaleOrderLine[]], line, index) => {
      if (
        // line.is_dong_ctkm_chiet_khau ||
        line.is_gift ||
        line.is_sanpham_khuyen_mai
      ) {
        prev[1].push(line);
        return prev;
      }
      prev[0].push(line);
      return prev;
    },
    [[], []],
  );

  const _renderActions = () => {
    const actions: ButtonProps[] = [];
    switch (order?.summary_state) {
      // case SaleOrderState.rfq: {
      //   actions.push({
      //     text: 'Xác nhận',
      //     colors: colors.color2745D4,
      //     onPress: onPressVerify,
      //   });
      //   break;
      // }
      case SaleOrderState.paid: {
        actions.push({
          text: 'Từ chối',
          colors: colors.red,
          onPress: onPressRejectPayment,
        });
        actions.push({
          text: 'Duyệt',
          colors: colors.color2745D4,
          onPress: onPressConfirmPayment,
        });
        break;
      }
      default:
        break;
    }

    if (isEmpty(actions)) return null;

    return (
      <HStack style={styles.footer}>
        {actions.map((btnProps, index) => {
          const { style, ...rest } = btnProps;
          return (
            <Button
              key={String(index)}
              style={[styles.button, style]}
              colors={colors.color2745D4}
              {...rest}
            />
          );
        })}
      </HStack>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={order?.name}
        headerRight={
          <HStack style={styles.headerRight}>
            {state ? (
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
            ) : null}
            {order?.summary_state &&
              order?.summary_state === SaleOrderState.rfq && (
                <HeaderButton
                  icon={images.client.edit}
                  style={styles.headerBtn}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  onPress={onPressEdit}
                />
              )}
          </HStack>
        }
      />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }>
        <Section title="Thông tin NPP/ Đại lý" style={styles.section}>
          <SectionRow
            style={[styles.row, { marginTop: 0 }]}
            title="Khách hàng"
            titleProps={{ style: styles.rowTitle }}
            text={order?.partner_id?.[1]}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={styles.row}
            title="Địa chỉ"
            titleProps={{ style: styles.rowTitle }}
            text={order?.partner_address_details}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={styles.row}
            title="Liên hệ"
            titleProps={{ style: styles.rowTitle }}
            text={`${order?.receiver_name || ''} - ${order?.phone || ''}`}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={styles.row}
            title="Ghi chú"
            titleProps={{ style: styles.rowTitle }}
            // text={order?.salesperson_note}
            textProps={{ style: styles.rowText }}
          />
        </Section>

        <Section title="Thông tin bán hàng" style={styles.section}>
          <SectionRow
            style={[styles.row, { marginTop: 0 }]}
            title="NVKD"
            titleProps={{ style: styles.rowTitle }}
            text={order?.user_id?.[1]}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={styles.row}
            title="Bên bán"
            titleProps={{ style: styles.rowTitle }}
            text={order?.crm_group_id?.[1]}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={styles.row}
            title="Bảng giá"
            titleProps={{ style: styles.rowTitle }}
            text={order?.pricelist_id?.name}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={styles.row}
            title="Kho"
            titleProps={{ style: styles.rowTitle }}
            text={order?.warehouse_id?.name}
            textProps={{ style: styles.rowText }}
          />
        </Section>

        {/* Danh sách sản phẩm */}
        <Section title="Thông tin đơn hàng" style={styles.section}>
          <Fragment>
            {lines?.map((line, index) => {
              return (
                <SaleOrderDetailLine
                  key={String(index)}
                  index={index}
                  data={line}
                />
              );
            })}
          </Fragment>
        </Section>

        {/* Danh sách chiết khấu, khuyến mại */}
        {!isEmpty(promotionLines) && (
          <Section title="Chiết khấu, khuyến mại" style={styles.section}>
            <Fragment>
              {promotionLines?.map((line, index) => {
                return (
                  <SaleOrderDetailLine
                    key={String(index)}
                    index={index}
                    data={line}
                  />
                );
              })}
            </Fragment>
          </Section>
        )}

        {/* CTKM */}
        {!isNil(order?.ctkm_id) && !isEmpty(order?.ctkm_id) && (
          <Section title="Chương trình khuyến mại" style={styles.section}>
            <SectionRow
              title={order.ctkm_id.name}
              titleProps={{ style: styles.promotionName }}
            />
          </Section>
        )}

        {/* Thanh toán */}
        <Section title="Thanh toán" style={styles.section}>
          <SectionRow
            style={[styles.row, { marginTop: 0 }]}
            title="Tổng tiền"
            titleProps={{ style: styles.rowTitle }}
            text={PriceUtils.format(order?.tongtruocchietkhau || 0)}
            textProps={{ style: [styles.rowText, styles.priceText] }}
          />
          <SectionRow
            style={styles.row}
            title="Tổng sau chiết khấu"
            titleProps={{ style: styles.rowTitle }}
            text={PriceUtils.format(order?.amount_untaxed)}
            textProps={{
              style: [styles.rowText, styles.priceText],
            }}
          />
          <SectionRow
            style={styles.row}
            title="Thuế"
            titleProps={{ style: styles.rowTitle }}
            text={PriceUtils.format(order?.amount_tax)}
            textProps={{
              style: [styles.rowText, styles.priceText],
            }}
          />
          <SectionRow
            style={styles.row}
            title="Tổng phải thanh toán"
            titleProps={{ style: styles.rowTitle }}
            text={PriceUtils.format(order?.amount_total || 0)}
            textProps={{
              style: [
                styles.rowText,
                styles.priceText,
                { color: colors.colorFF7F00 },
              ],
            }}
          />
        </Section>
      </Animated.ScrollView>
      <SafeAreaView edges={['bottom']}>{_renderActions()}</SafeAreaView>
    </View>
  );
};

export default SaleOrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerRight: {
    paddingRight: 12,
  },
  headerBtn: {
    width: 24,
    height: 24,
    padding: 0,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  section: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  row: {
    marginTop: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  rowText: {
    flex: 2,
    maxWidth: undefined,
    fontSize: 14,
    fontWeight: '600',
    color: colors.color2651E5,
  },
  priceText: {
    flex: 1,
    maxWidth: undefined,
    color: colors.color161616,
  },
  promotionName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.color2651E5,
  },
  state: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '400',
    maxWidth: Number(90).adjusted(),
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    // backgroundColor: colors.white,
  },
  cancelButton: {},
  button: {
    flex: 1,
  },
});
