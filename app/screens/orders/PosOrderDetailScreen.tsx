import HStack from '@app/components/HStack';
import Section from '@app/components/Section';
import SectionRow from '@app/components/SectionRow';
import { POS_ORDER_STATE_MAPPING } from '@app/constants/pos-orders.constant';
import { PosOrderState } from '@app/enums/pos-order-state.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { UpdatePosOrderStateReasonDto } from '@app/interfaces/dtos/pos-order.dto';
import { PosOrderLine } from '@app/interfaces/entities/pos-order-line.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { updatePosOrderStateMutation } from '@app/queries/pos-order.mutation';
import { usePosOrderDetail } from '@app/queries/pos-order.query';
import { TPosOrderStateDto } from '@app/repository/order/PosOrderRepo';
import Button from '@core/components/Button';
import Header, { HeaderButton } from '@core/components/Header';
import Text from '@core/components/Text';
import Popup, { POPUP_TYPE } from '@core/components/popup/Popup';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import PriceUtils from '@core/utils/PriceUtils';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { queryClient } from 'App';
import { isEmpty, isNil, reduce } from 'lodash';
import React, { FC, Fragment, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import CancelPosOrderView from './components/CancelPosOrderView';
import PosOrderDetailLine from './components/PosOrderDetailLine';
import { RefreshControl } from 'react-native-gesture-handler';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.POS_ORDER_DETAIL
>;

const PosOrderDetailScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const {
    data: order,
    refetch,
    isRefetching,
  } = usePosOrderDetail(route.params.id);

  const stateMutation = updatePosOrderStateMutation();

  // effects
  useEffect(() => {
    if (stateMutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => Spinner.hide();
  }, [stateMutation.isPending]);

  const onPressEdit = () => {
    if (!order?.id) return;
    navigation.navigate(SCREEN.EDIT_POS_ORDER, { id: order.id });
  };

  const onPressSubmit = () => {
    updateState('submit');
  };

  const onPressConfirm = () => {
    updateState('confirm');
  };

  const onPressApprove = () => {
    updateState('approve');
  };

  const onPressComplete = () => {
    updateState('close');
  };

  const onPressCancel = () => {
    // updateState('cancel');
    Popup.show({
      type: POPUP_TYPE.BOTTOM_SHEET,
      props: {
        title: 'Hủy Đơn đại lý',
        renderContent: () => {
          return (
            <CancelPosOrderView
              onSubmit={data => {
                updateState('cancel', data);
              }}
            />
          );
        },
      },
    });
  };

  const updateState = (
    state: TPosOrderStateDto,
    data?: UpdatePosOrderStateReasonDto,
  ) => {
    if (!order?.id) return;

    stateMutation
      .mutateAsync({
        id: order.id,
        state,
        data,
      })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['fetch-infinite-pos-order-list'],
        });
        queryClient.refetchQueries({
          queryKey: ['pos-orders-list'],
        });
        queryClient.refetchQueries({
          queryKey: ['pos-order-detail'],
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onPressAvailableInventoryReport = () => {
    if (!order?.distributor_id?.[0]) return;

    navigation.navigate(SCREEN.AVAILABLE_INVENTORY_REPORT, {
      filter: { agency_ids: [order.distributor_id[0]] },
    });
  };

  const state = order?.state
    ? POS_ORDER_STATE_MAPPING[order?.state]
    : undefined;

  const [lines, promotionLines] = reduce(
    order?.order_line,
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
            {order?.state && order?.state === PosOrderState.quotation && (
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
            text={order?.salesperson_note}
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
            text={order?.distributor_id?.[1]}
            textProps={{ style: styles.rowText }}
          />
        </Section>

        {/* Danh sách sản phẩm */}
        <Section title="Thông tin đơn hàng" style={styles.section}>
          <Fragment>
            {isEmpty(lines) && (
              <Text style={styles.emptyText}>Đơn hàng trống</Text>
            )}
            {lines?.map((line, index) => {
              return (
                <PosOrderDetailLine
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
                  <PosOrderDetailLine
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
        <Button
          text="Tồn kho NPP"
          colors={colors.colorFF7F00}
          style={[styles.button, { marginHorizontal: 16 }]}
          leftIcon={{ src: images.common.boxes }}
          onPress={onPressAvailableInventoryReport}
        />
      </Animated.ScrollView>
      <SafeAreaView edges={[]} style={styles.footer}>
        {order?.state &&
          [
            PosOrderState.quotation,
            PosOrderState.to_approved,
            PosOrderState.confirm,
            PosOrderState.approved,
            PosOrderState.to_shipping,
            PosOrderState.shipping,
            PosOrderState.sale,
          ].includes(order.state) && (
            <Button
              text="Huỷ đơn hàng"
              style={[styles.button, styles.cancelButton]}
              colors={colors.colorFB4646}
              onPress={onPressCancel}
            />
          )}

        {order?.state === PosOrderState.quotation && (
          <Button
            text="Đệ trình"
            style={[styles.button]}
            onPress={onPressSubmit}
          />
        )}
        {order?.state === PosOrderState.to_approved && (
          <Button
            text="Xác nhận"
            style={[styles.button]}
            onPress={onPressConfirm}
          />
        )}
        {order?.state === PosOrderState.confirm && (
          <Button
            text="Phê duyệt"
            style={[styles.button]}
            onPress={onPressApprove}
          />
        )}
        {order?.state === PosOrderState.shipping && (
          <Button
            text="Hoàn thành"
            style={[styles.button]}
            onPress={onPressComplete}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default PosOrderDetailScreen;

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
  emptyText: {
    textAlign: 'center',
    color: colors.color6B7A90,
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  cancelButton: {},
  button: {},
});
