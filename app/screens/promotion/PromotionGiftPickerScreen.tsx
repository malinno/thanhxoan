import MyCustomTabBar, { RNTabBarProps } from '@app/components/MyCustomTabBar';
import { SCREEN } from '@app/enums/screen.enum';
import {
  TOptionComboGiftLine,
  usePromotionGiftPickerForm,
} from '@app/hooks/usePromotionGiftPickerForm';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Route, SceneRendererProps, TabView } from 'react-native-tab-view';
import PromotionComboPickerScene from './components/PromotionComboPickerScene';
import PromotionProductPickerScene from './components/PromotionProductPickerScene';
import { findIndex, omit } from 'lodash';
import { usePosOrderDetail } from '@app/queries/pos-order.query';
import { useSaleOrderDetail } from '@app/queries/sale-order.query';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { useNavigation } from '@react-navigation/native';
import {
  editPosOrderMutation,
  setPosOrderPromotionGiftMutation,
} from '@app/queries/pos-order.mutation';
import {
  editSaleOrderMutation,
  setSaleOrderPromotionGiftMutation,
} from '@app/queries/sale-order.mutation';
import { TComboGiftItemDto } from '@app/interfaces/dtos/combo-gift-item.dto';
import { TOptionComboGiftItemDto } from '@app/interfaces/dtos/option-combo-gift-item.dto';
import { SetOrderProductGiftDto } from '@app/interfaces/dtos/set-order-product-gift.dto';
import { queryClient } from 'App';
import { useAuth } from '@app/hooks/useAuth';

const ROUTES = [
  {
    key: 'products',
    title: 'Mua sản phẩm chọn quà',
  },
  {
    key: 'combo',
    title: 'Mua combo tặng quà',
  },
];

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.PROMOTION_GIFTS_PICKER
>;

const PromotionGiftPickerScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const screenParams = route.params;
  const { productGift } = screenParams;

  const user = useAuth(state => state.user);
  const posOrderMutation = editPosOrderMutation();
  const saleOrderMutation = editSaleOrderMutation();
  const saleOrderProductGiftMutation = setSaleOrderPromotionGiftMutation();
  const posOrderProductGiftMutation = setPosOrderPromotionGiftMutation();

  const { data: posOrder, isLoading: isLoadingPosOrder } = usePosOrderDetail(
    productGift?.pos_order_id,
  );
  const { data: saleOrder, isLoading: isLoadingSaleOrder } = useSaleOrderDetail(
    productGift?.sale_order_id,
  );

  const data = usePromotionGiftPickerForm(state => state.data);
  const setData = usePromotionGiftPickerForm(state => state.setData);
  const resetForm = usePromotionGiftPickerForm(state => state.reset);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (
      isLoadingPosOrder ||
      isLoadingSaleOrder ||
      saleOrderProductGiftMutation.isPending ||
      posOrderProductGiftMutation.isPending ||
      saleOrderMutation.isPending ||
      posOrderMutation.isPending
    )
      Spinner.show();
    else Spinner.hide();

    return () => {
      Spinner.hide();
    };
  }, [
    isLoadingPosOrder,
    isLoadingSaleOrder,
    saleOrderProductGiftMutation.isPending,
    posOrderProductGiftMutation.isPending,
    saleOrderMutation.isPending,
    posOrderMutation.isPending,
  ]);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  useEffect(() => {
    if (!productGift) {
      return;
    }
    const order = productGift.pos_order_id ? posOrder : saleOrder;

    setData({
      wizard_id: productGift.wizard_id,
      promotion_id: productGift.promotion_id,
      pos_order_id: productGift.pos_order_id,
      sale_order_id: productGift.sale_order_id,
      combo_gifts: productGift.combo_gift_ids
        ? productGift.combo_gift_ids.map(it => ({
            ...it,
            selected: true,
          }))
        : [],
      options_combo_gifts: productGift.option_combo_gift_ids
        ? productGift.option_combo_gift_ids.reduce(
            (prev: TOptionComboGiftLine[], opt) => {
              const option = {
                ...omit(opt, ['product_apply_ids']),
                quantity: 0,
              };
              const existLineIdx = findIndex(
                prev,
                p => p.applyProduct.id === opt.product_apply_ids?.[0].id,
              );
              if (existLineIdx < 0) {
                const purchaseProduct = order?.order_line?.find(
                  l => l.product_id.id === opt.product_apply_ids?.[0].id,
                );
                prev.push({
                  applyProduct: opt.product_apply_ids?.[0],
                  purchaseQty: purchaseProduct?.product_uom_qty,
                  items: [option],
                });
                return prev;
              }

              prev[existLineIdx].items.push(option);
              return prev;
            },
            [],
          )
        : [],
    });
  }, [productGift, posOrder, saleOrder]);

  const renderTabBar = (props: RNTabBarProps) => {
    return (
      <MyCustomTabBar
        {...props}
        scrollEnabled
        tabStyle={{ width: 'auto' }}
        inactiveColor={colors.color6B7A90}
      />
    );
  };

  const renderScene = (props: SceneRendererProps & { route: Route }) => {
    switch (props.route.key) {
      case 'products':
        return <PromotionProductPickerScene {...screenParams} {...props} />;
      case 'combo':
      default:
        return <PromotionComboPickerScene {...screenParams} {...props} />;
    }
  };

  const updateOrderPromotionProgram = async () => {
    if (!user) return;

    if (productGift.sale_order_id) {
      await saleOrderMutation.mutateAsync({
        id: productGift.sale_order_id,
        data: {
          update_uid: user?.id,
          ctkm_id: productGift.promotion_id.id,
        },
      });
    } else {
      await posOrderMutation.mutateAsync({
        id: productGift.pos_order_id,
        data: {
          update_uid: user?.id,
          ctkm_id: productGift.promotion_id.id,
          is_update_ctkm: true,
        },
      });
    }
  };

  const submit = async () => {
    await updateOrderPromotionProgram();

    try {
      let result;

      const dto: SetOrderProductGiftDto = {
        combo_gift_ids: data.combo_gifts.map(cg => ({
          id: cg.id,
          is_apply: Boolean(cg.selected),
        })),
        options_combo_gift_ids: data.options_combo_gifts.reduce(
          (prev: TOptionComboGiftItemDto[], ocg) => {
            for (const it of ocg.items) {
              if (it.quantity > 0) {
                prev.push({
                  id: it.id,
                  is_apply: true,
                  combo_apply: it.quantity,
                });
              }
            }
            return prev;
          },
          [],
        ),
        ctkm_id: productGift.promotion_id.id,
        wizard_id: productGift.wizard_id,
      };

      if (productGift.sale_order_id) {
        const { response } = await saleOrderProductGiftMutation.mutateAsync({
          id: productGift.sale_order_id,
          data: dto,
        });

        result = response.result;

        queryClient.refetchQueries({
          queryKey: ['sale-order-detail', productGift.sale_order_id],
        });
      } else if (productGift.pos_order_id) {
        const { response } = await posOrderProductGiftMutation.mutateAsync({
          id: productGift.pos_order_id,
          data: dto,
        });

        result = response.result;

        queryClient.refetchQueries({
          queryKey: ['pos-order-detail', productGift.pos_order_id],
        });
      }
    } catch (error) {}

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Chọn quà khuyến mại" />

      <TabView
        navigationState={{ index, routes: ROUTES }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy
      />

      <View style={styles.footer}>
        <View style={styles.promotion}>
          <Text style={styles.promotionLabel}>Chương trình khuyến mãi</Text>
          <Text style={styles.promotionName}>{data.promotion_id?.name}</Text>
        </View>
        <Button text="Xong" onPress={submit} />
      </View>
    </View>
  );
};

export default PromotionGiftPickerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  footer: {
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  promotion: {
    gap: 6,
  },
  promotionLabel: {
    color: colors.color6B7A90,
  },
  promotionName: {
    color: colors.colorFF7F00,
    fontWeight: '600',
  },
});
