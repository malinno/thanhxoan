import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import Section from '@app/components/Section';
import SectionRow from '@app/components/SectionRow';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { usePosOrderForm } from '@app/hooks/usePosOrderForm';
import { ErpProduct } from '@app/interfaces/entities/erp-product.entity';
import { PosOrderLine } from '@app/interfaces/entities/pos-order-line.entity';
import { PosOrder } from '@app/interfaces/entities/pos-order.entity';
import { PromotionProgram } from '@app/interfaces/entities/promotion-program.entity';
import { editPosOrderMutation } from '@app/queries/pos-order.mutation';
import { useProducts } from '@app/queries/product.query';
import Button from '@core/components/Button';
import Alert from '@core/components/popup/Alert';
import { ALERT_BUTTON_TYPE } from '@core/components/popup/AlertPopup';
import Popup, { POPUP_TYPE } from '@core/components/popup/Popup';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import PriceUtils from '@core/utils/PriceUtils';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { queryClient } from 'App';
import dayjs from 'dayjs';
import { find, isEmpty, isNil, orderBy } from 'lodash';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { TPriceLookup } from '../types/price-lookup.type';
import EditPercentageDiscountView, {
  TPercentageDiscountPayload,
} from './EditPercentageDiscountView';
import PosOrderProductItem from './PosOrderProductItem';

// const parsePromotionLines = (
//   primaryLines: PosOrderLine[],
//   promotion?: PromotionProgram,
// ): PosOrderLine[] => {
//   const promotionLines: PosOrderLine[] = [];
//   if (!promotion || isEmpty(primaryLines)) return promotionLines;

//   if (promotion.ctkm_sanpham_ids && !isEmpty(promotion.ctkm_sanpham_ids)) {
//     const hasItems = intersectionWith(
//       primaryLines,
//       promotion.ctkm_sanpham_ids,
//       (a, b) =>
//         a.product_id.id === b.product_id.id &&
//         a.product_uom_qty >= b.product_apply_quantity,
//     );
//     if (isEmpty(hasItems)) return [];
//   }

//   if (promotion.chietkhaucodinh && promotion.san_pham_chiet_khau_id) {
//     promotionLines.push({
//       product_id: promotion.san_pham_chiet_khau_id,
//       product_uom_qty: 1,
//       price_unit: 0,
//       fixed_amount_discount: promotion.chietkhaucodinh,
//       price_subtotal: promotion.chietkhaucodinh * -1,
//       is_dong_ctkm_tang_kem: false,
//       is_dong_ctkm_chiet_khau: true,
//       is_sanpham_khuyen_mai: false,
//       is_delivery: false,
//     });
//   }
//   if (promotion.chietkhauphantram && promotion.product_promotion_percent_id) {
//     const subTotal = sumBy(
//       primaryLines,
//       line => line.price_unit * line.product_uom_qty,
//     );
//     let discountAmount = subTotal * (promotion.chietkhauphantram / 100);
//     if (promotion.max_promotion_value) {
//       discountAmount = Math.min(promotion.max_promotion_value, discountAmount);
//     }

//     promotionLines.push({
//       product_id: promotion.product_promotion_percent_id,
//       product_uom_qty: 1,
//       price_unit: 0,
//       fixed_amount_discount: discountAmount,
//       price_subtotal: discountAmount * -1,
//       is_dong_ctkm_tang_kem: false,
//       is_dong_ctkm_chiet_khau: true,
//       is_sanpham_khuyen_mai: false,
//       is_delivery: false,
//     });
//   }

//   const giftLines = promotion?.ctkm_sanpham_ids
//     ? promotion?.ctkm_sanpham_ids.reduce((prev: PosOrderLine[], line) => {
//         let appliedLine: PosOrderLine | undefined;
//         if (line.product_id) {
//           const existIndex = primaryLines.findIndex(
//             l =>
//               l.product_id.id === line.product_id.id &&
//               l.product_uom_qty >= line.product_apply_quantity,
//           );
//           if (existIndex < 0) return prev;
//           appliedLine = primaryLines[existIndex];
//         }

//         if (line.product_donate_id) {
//           const qty = appliedLine?.product_uom_qty
//             ? Math.floor(
//                 appliedLine?.product_uom_qty / line.product_apply_quantity,
//               ) * line.product_donate_quantity
//             : line.product_donate_quantity;
//           prev.push({
//             product_id: line.product_donate_id,
//             product_uom_qty: qty,
//             price_unit: 0,
//             fixed_amount_discount: 0,
//             price_subtotal: 0,
//             is_dong_ctkm_tang_kem: false,
//             is_dong_ctkm_chiet_khau: false,
//             is_sanpham_khuyen_mai: true,
//             is_delivery: false,
//           });
//         }

//         if (line.product_free_id) {
//           const qty = appliedLine?.product_uom_qty
//             ? Math.floor(
//                 appliedLine?.product_uom_qty / line.product_apply_quantity,
//               ) * line.product_free_quantity
//             : line.product_free_quantity;
//           prev.push({
//             product_id: line.product_free_id,
//             product_uom_qty: qty,
//             price_unit: 0,
//             fixed_amount_discount: 0,
//             price_subtotal: 0,
//             is_dong_ctkm_tang_kem: false,
//             is_dong_ctkm_chiet_khau: false,
//             is_sanpham_khuyen_mai: true,
//             is_delivery: false,
//           });
//         }

//         return prev;
//       }, [])
//     : [];

//   if (!isEmpty(giftLines)) promotionLines.push(...giftLines);
//   return promotionLines;
// };

interface Props {
  next?: () => void;
  previous?: () => void;
  save?: (args?: TSaveOrderArguments<PosOrder>) => void;
}

const PosOrderFormStepTwo: FC<Props> = ({
  next,
  previous,
  save: saveOrder,
  ...props
}) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const editMutation = editPosOrderMutation();

  const data = usePosOrderForm(state => state.data);
  const setData = usePosOrderForm(state => state.setData);

  const productIds = data.lines?.reduce((prev: number[], line) => {
    const isPromotionLine =
      line.is_dong_ctkm_chiet_khau ||
      line.is_dong_ctkm_tang_kem ||
      line.is_sanpham_khuyen_mai ||
      line.is_dongchietkhautongdon;
    if (isPromotionLine) return prev;
    prev.push(line.product_id.id);
    return prev;
  }, []);

  const { data: productRecords, refetch: refetchProductPrices } = useProducts(
    {
      pricelist_id: data.priceList?.[0],
      enable_sale_search: true,
      product_ids: productIds,
    },
    false, // disable automatic refetching
  );

  const [pricesLookup, setPricesLookup] = useState<TPriceLookup>({});

  useEffect(() => {
    if (!data.priceList?.[0] || isEmpty(productIds)) return;
    refetchProductPrices();
  }, [data.priceList, productIds]);

  useEffect(() => {
    if (!productRecords) return;

    const now = dayjs();

    const lookup = productRecords.reduce((prev: TPriceLookup, p) => {
      const prices = p.pricelist_ids?.[0]?.item_ids?.filter(
        it =>
          it.product_id.id === p.id &&
          (!it.date_start ||
            dayjs(it.date_start, 'YYYY-MM-DD').isBefore(now)) &&
          (!it.date_end || dayjs(it.date_end, 'YYYY-MM-DD').isAfter(now)),
      );

      if (prices && !isEmpty(prices)) prev[String(p.id)] = prices;
      else prev[String(p.id)] = p.list_price || 0;
      return prev;
    }, {});

    setPricesLookup(lookup);
  }, [productRecords]);

  useEffect(() => {
    setData({
      lines: [...data.lines].reduce((prev: PosOrderLine[], line) => {
        const lookupValue = pricesLookup[line.product_id.id];
        if (!isNil(lookupValue)) {
          if (typeof lookupValue === 'number') {
            line.price_unit = lookupValue;
          } else {
            const productPrice = find(
              orderBy(lookupValue, 'min_quantity', 'desc'),
              item => item.min_quantity <= line.product_uom_qty,
            );
            if (productPrice?.fixed_price)
              line.price_unit = productPrice?.fixed_price;
          }
          line.price_subtotal = line.price_unit * line.product_uom_qty;
          prev.push(line);
        }
        return prev;
      }, []),
    });
  }, [pricesLookup]);

  // useEffect(() => {
  //   const promotionLines = parsePromotionLines(
  //     data.lines,
  //     data.promotionProgram,
  //   );
  //   setData({ promotionLines });
  //   if (isEmpty(promotionLines)) setData({ promotionProgram: undefined });
  // }, [data.lines, data.promotionProgram]);

  useEffect(() => {
    const [subtotal, discount] = [...data.lines, ...data.promotionLines].reduce(
      (prev, line) => {
        prev[0] += line.price_subtotal;
        prev[1] += line.fixed_amount_discount * line.product_uom_qty;

        return prev;
      },
      [0, 0],
    );
    const totalBeforeTax = subtotal - discount;

    setData({
      subtotal,
      discount,
      totalBeforeTax,
      total: totalBeforeTax,
    });
  }, [data.lines, data.promotionLines]);

  useEffect(() => {
    if (editMutation.isPending) Spinner.show();
    else Spinner.hide();

    return () => {
      Spinner.hide();
    };
  }, [editMutation.isPending]);

  useEffect(() => {
    if (editMutation.isSuccess) {
      queryClient.refetchQueries({
        queryKey: ['pos-order-detail', data.id],
      });
    }
  }, [editMutation.isSuccess]);

  const onLineChanged = (
    index: number,
    changes: Partial<PosOrderLine>,
    hasConfirmedRemovePromotionProgram?: boolean,
  ) => {
    const line = data.lines[index];
    if (changes.product_uom_qty) {
      if (
        !hasConfirmedRemovePromotionProgram &&
        (data.promotionProgram || data.percentageDiscountAmount)
      ) {
        const removeFields = [];
        if (data.percentageDiscountAmount)
          removeFields.push('% chiết khấu tổng đơn');
        if (data.promotionProgram) removeFields.push('chương trình khuyến mãi');
        const message = `Thay đổi số lượng 1 dòng sẽ kéo theo ${removeFields.join(
          ' và ',
        )} sẽ bị xóa khỏi đơn hàng`;

        Alert.alert({
          title: 'Thông báo',
          message,
          actions: [
            {
              text: 'Huỷ',
              type: ALERT_BUTTON_TYPE.CANCEL,
            },
            {
              text: 'Xoá',
              onPress: () => {
                onLineChanged(index, changes, true);
              },
            },
          ],
        });
        return;
      }
    }

    const newLines = data.lines.reduce((prev: PosOrderLine[], it) => {
      if (it.product_id.id === line.product_id.id) {
        it = { ...it, ...changes };
        it.price_subtotal = it.price_unit * it.product_uom_qty;
        if (it.discount) {
          it.price_subtotal =
            it.price_subtotal - (it.price_subtotal * it.discount) / 100;
        }
      }
      prev.push(it);
      return prev;
    }, []);

    return setData({
      lines: newLines,
      percentageDiscountAmount: 0,
      promotionProgram: undefined,
      promotionLines: [],
    });
  };

  const onPressRemoveLine = (
    lineIndex: number,
    _: PosOrderLine,
    hasConfirmed?: boolean,
  ) => {
    if (
      !hasConfirmed &&
      (data.percentageDiscountAmount || data.promotionProgram?.ctkm_sanpham_ids)
    ) {
      const isInPromotionProgram =
        data.percentageDiscountAmount ||
        (data.promotionProgram?.ctkm_sanpham_ids &&
          data.promotionProgram.ctkm_sanpham_ids.findIndex(
            it => it.product_id.id === data.lines[lineIndex].product_id.id,
          ) >= 0);
      if (isInPromotionProgram) {
        const removeFields = [];
        if (data.percentageDiscountAmount)
          removeFields.push('% chiết khấu tổng đơn');
        if (data.promotionProgram) removeFields.push('chương trình khuyến mãi');
        const message = `Xóa 1 dòng sẽ kéo theo ${removeFields.join(
          ' và ',
        )} sẽ bị xóa khỏi đơn hàng`;

        Alert.alert({
          title: 'Thông báo',
          message,
          actions: [
            {
              text: 'Huỷ',
              type: ALERT_BUTTON_TYPE.CANCEL,
            },
            {
              text: 'Xoá',
              onPress: () => {
                onPressRemoveLine(lineIndex, _, true);
              },
            },
          ],
        });
        return;
      }
    }
    const newLines = data.lines.reduce((prev: PosOrderLine[], it, index) => {
      if (index == lineIndex) return prev;

      prev.push(it);
      return prev;
    }, []);

    setData({
      lines: newLines,
      percentageDiscountAmount: 0,
      promotionProgram: undefined,
      promotionLines: [],
    });
  };

  const onPressAddProducts = () => {
    navigation.navigate(SCREEN.PRODUCTS_PICKER, {
      multiple: true,
      filter: {
        pricelist_id: data.priceList?.[0],
        enable_sale_search: true,
      },
      selectedIds: data.lines ? data.lines.map(line => line.product_id.id) : [],
      onSelected: (products: ErpProduct[]) => {
        const oldLinesLookup = data.lines
          ? data.lines.reduce((prev: Record<string, PosOrderLine>, line) => {
              prev[line.product_id.id] = line;
              return prev;
            }, {})
          : {};

        const [newLines, subtotal] = products.reduce(
          (prev: [PosOrderLine[], number], p) => {
            const oldLine = oldLinesLookup[p.id];
            if (oldLine) {
              prev[0].push(oldLine);
              prev[1] += oldLine.price_unit * oldLine.product_uom_qty;
              return prev;
            }

            const line: PosOrderLine = {
              product_id: p,
              product_uom: p.uom_id,
              product_uom_qty: 1,
              price_unit: p.list_price || 0,
              fixed_amount_discount: 0,
              price_subtotal: p.list_price || 0,
              is_dong_ctkm_tang_kem: false,
              is_dong_ctkm_chiet_khau: false,
              is_sanpham_khuyen_mai: false,
              is_delivery: false,
              is_dongchietkhautongdon: false,
              product_free_qty: p.current_free_qty,
            };
            prev[0].push(line);
            prev[1] += line.price_unit * line.product_uom_qty;
            return prev;
          },
          [[], 0],
        );

        setData({
          lines: newLines,
          subtotal,
          totalBeforeTax: subtotal,
          total: subtotal,
          percentageDiscountAmount: 0,
          promotionProgram: undefined,
          promotionLines: [],
        });
      },
    });
  };

  const onPressPromotions = () => {
    saveOrder?.({
      autoCreateConfirmMessage:
        'Để chọn CTKM, đơn hàng sẽ được tạo tự động. Bạn có chắc chắn muốn tạo đơn hàng?',
      onSuccess: posOder => {
        queryClient.refetchQueries({
          queryKey: ['pos-order-detail', posOder.id],
        });

        const date = dayjs().format('YYYY-MM-DD');
        navigation.navigate(SCREEN.PROMOTIONS_PICKER, {
          // orderLines: data.lines,
          selectedId: data.promotionProgram?.id,
          onSelected: onPromotionSelected,
          filter: {
            // category: data.partner?.category[0],
            contact_level: data.partner?.contact_level?.[0],
            ngay_bat_dau: date,
            ngay_ket_thuc: date,
            partner_id: data.partner?.id,
            gia_tri_toi_thieu_don_hang: data.subtotal,
            pos_order_id: posOder?.id,
          },
        });
      },
    });
  };

  const onPromotionSelected = (promotion?: PromotionProgram) => {
    setData({ promotionProgram: promotion });
  };

  const onPressPercentageDiscountAmount = () => {
    if (!user?.id) return;

    if (!data.id) {
      return saveOrder?.({
        autoCreateConfirmMessage:
          'Để chọn % chiết khấu tổng đơn, đơn hàng sẽ được tạo tự động. Bạn có chắc chắn muốn tạo đơn hàng?',
        onSuccess: async posOder => {
          queryClient.refetchQueries({
            queryKey: ['pos-order-detail', posOder.id],
          });

          if (Platform.OS === 'ios') await global.sleep(500);

          Popup.show({
            type: POPUP_TYPE.BOTTOM_SHEET,
            props: {
              title: 'Sửa % chiết khấu tổng đơn',
              keyboardOffset: 100,
              renderContent: () => {
                const onSubmit = async (
                  payload: TPercentageDiscountPayload,
                ) => {
                  editMutation.mutate({
                    id: posOder.id,
                    data: {
                      phantramchietkhautongdon: payload.discount,
                      update_uid: user?.id,
                    },
                  });
                };
                return (
                  <EditPercentageDiscountView
                    discount={data.percentageDiscountAmount}
                    onSubmit={onSubmit}
                  />
                );
              },
            },
          });
        },
      });
    }

    Popup.show({
      type: POPUP_TYPE.BOTTOM_SHEET,
      props: {
        title: 'Sửa % chiết khấu tổng đơn',
        keyboardOffset: 100,
        renderContent: () => {
          const onSubmit = async (payload: TPercentageDiscountPayload) => {
            editMutation.mutate({
              id: data.id!,
              data: {
                phantramchietkhautongdon: payload.discount,
                update_uid: user?.id,
              },
            });
          };
          return (
            <EditPercentageDiscountView
              discount={data.percentageDiscountAmount}
              onSubmit={onSubmit}
            />
          );
        },
      },
    });
  };

  const onPressAvailableInventoryReport = () => {
    if (!data.distributor?.[0]) return;

    navigation.navigate(SCREEN.AVAILABLE_INVENTORY_REPORT, {
      filter: { agency_ids: [data.distributor[0]] },
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Section
          title="Thông tin giao hàng"
          bodyComponent={Fragment}
          style={styles.section}
          rightComponent={
            <HStack style={styles.editBtn} onPress={onPressAddProducts}>
              <Text style={styles.editText}>Thêm sản phẩm</Text>
              <Image
                source={images.client.edit}
                tintColor={colors.primary}
                style={{ width: 16, height: 16 }}
              />
            </HStack>
          }>
          {!data.lines || isEmpty(data.lines) ? (
            <ListEmpty text="Chưa có sản phẩm" />
          ) : (
            data.lines.map((line, index) => (
              <PosOrderProductItem
                key={line.product_id.id}
                index={index}
                data={line}
                style={[styles.lineItem, index === 0 && { marginTop: 0 }]}
                onChange={onLineChanged}
                onRemove={onPressRemoveLine}
              />
            ))
          )}
        </Section>

        {!isEmpty(data.promotionLines) && (
          <Section
            title="Chiết khấu, khuyến mại"
            bodyComponent={Fragment}
            style={styles.section}>
            {data.promotionLines?.map((line, index) => (
              <PosOrderProductItem
                key={`${line.id}.${line.product_id.id}`}
                index={index}
                data={line}
                style={[styles.lineItem, index === 0 && { marginTop: 0 }]}
              />
            ))}
          </Section>
        )}
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <SectionRow
          style={[styles.row, { alignItems: 'center' }]}
          title="Khuyến mại"
          titleProps={{
            style: [
              styles.rowTitle,
              { fontWeight: '600', color: colors.color2651E5 },
            ],
          }}
          textProps={{
            selectable: false,
            style: [
              styles.rowText,
              data.promotionProgram
                ? { color: colors.colorFF7F00 }
                : { fontWeight: '400', color: colors.color6B7A90 },
            ],
          }}
          text={data.promotionProgram ? data.promotionProgram.name : 'Chọn'}
          leftIcons={[{ src: images.common.ticketStar }]}
          rightIcons={[
            {
              src: images.common.arrowRight,
              style: { width: 12, height: 12 },
            },
          ]}
          onPress={onPressPromotions}
        />
        <SectionRow
          style={styles.row}
          title={`Tổng${
            data.lines ? ` (${data.lines?.length} sản phẩm) ` : ''
          }:`}
          text={PriceUtils.format(data.subtotal)}
          titleProps={{ style: styles.rowTitle }}
          textProps={{
            selectable: false,
            style: styles.rowText,
          }}
        />
        <SectionRow
          style={[styles.row, { alignItems: 'center' }]}
          title="% Chiết khấu tổng đơn"
          titleProps={{
            style: [styles.rowTitle],
          }}
          textProps={{
            selectable: false,
            style: [
              styles.rowText,
              data.percentageDiscountAmount
                ? { color: colors.colorFF7F00 }
                : { fontWeight: '400', color: colors.color6B7A90 },
            ],
          }}
          text={`${data.percentageDiscountAmount * -1}%`}
          rightIcons={[
            {
              src: images.client.edit,
              style: { width: 18, height: 18, tintColor: colors.primary },
            },
          ]}
          onPress={onPressPercentageDiscountAmount}
        />
        <SectionRow
          style={styles.row}
          title="Tổng sau chiết khấu:"
          text={PriceUtils.format(data.totalBeforeTax)}
          titleProps={{ style: styles.rowTitle }}
          textProps={{
            selectable: false,
            style: styles.rowText,
          }}
        />
        <SectionRow
          style={styles.row}
          title="Thuế:"
          text={PriceUtils.format(data.tax)}
          titleProps={{ style: styles.rowTitle }}
          textProps={{
            selectable: false,
            style: styles.rowText,
          }}
        />
        <SectionRow
          style={styles.row}
          title="Tổng phải thanh toán:"
          text={PriceUtils.format(data.total)}
          titleProps={{ style: styles.rowTitle }}
          textProps={{
            selectable: false,
            style: [styles.rowText, { color: colors.colorFF7F00 }],
          }}
        />

        <HStack style={styles.actions}>
          {/* <Button
            text="Lưu nháp"
            colors={colors.colorDADADA}
            style={styles.button}
          /> */}
          <Button
            text="Tồn kho NPP"
            colors={colors.colorFF7F00}
            style={[{ width: 110, paddingVertical: 4, paddingHorizontal: 4 }]}
            leftIcon={{ src: images.common.boxes, style: { marginRight: 2 } }}
            textStyle={{ flex: 1, fontSize: 14 }}
            onPress={onPressAvailableInventoryReport}
          />
          <Button
            text="Xác nhận"
            colors={colors.color2651E5}
            style={styles.button}
            onPress={next}
          />
        </HStack>
      </View>
    </View>
  );
};

export default PosOrderFormStepTwo;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    // paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  editBtn: {},
  editText: {
    fontSize: 14,
    fontWeight: '400',
    marginRight: 4,
    color: colors.color2651E5,
  },
  lineItem: {
    marginTop: 12,
  },
  row: {},
  rowTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.color161616,
  },
  rowText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.color161616,
  },
  actions: {
    gap: 10,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    // backgroundColor: colors.white,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
