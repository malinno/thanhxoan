import ListEmpty from '@app/components/ListEmpty';
import { SCREEN } from '@app/enums/screen.enum';
import { ProductGift } from '@app/interfaces/entities/product-gift.entity';
import { PromotionProgram } from '@app/interfaces/entities/promotion-program.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { fetchPosOrderPromotionGiftMutation } from '@app/queries/pos-order.mutation';
import { usePromotionPrograms } from '@app/queries/promotion-program.query';
import { fetchSaleOrderPromotionGiftMutation } from '@app/queries/sale-order.mutation';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { find } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import PromotionPickerItem, {
  TPromotionPickerItem,
} from './components/PromotionPickerItem';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.PROMOTIONS_PICKER
>;

const PromotionsPickerScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const { selectedId, onSelected, filter } = route.params;

  const { data, refetch, isRefetching, isFetching } =
    usePromotionPrograms(filter);

  const fetchPosOrderProductGifts = fetchPosOrderPromotionGiftMutation();
  const fetchSaleOrderProductGifts = fetchSaleOrderPromotionGiftMutation();

  const [selectedItem, setSelectedItem] = useState<PromotionProgram>();
  const [promotions, setPromotions] = useState<TPromotionPickerItem[]>([]);

  useEffect(() => {
    if (
      fetchPosOrderProductGifts.isPending ||
      fetchSaleOrderProductGifts.isPending
    )
      Spinner.show();
    else Spinner.hide();

    return () => {
      Spinner.hide();
    };
  }, [
    fetchPosOrderProductGifts.isPending,
    fetchSaleOrderProductGifts.isPending,
  ]);

  useEffect(() => {
    const listener = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressBack,
    );
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    if (!data || !selectedId) return;
    const selectedItem = find(data || [], it => it.id === selectedId);
    setSelectedItem(selectedItem);
  }, [data, selectedId]);

  useEffect(() => {
    if (!data) return;

    setPromotions(
      data.reduce((prev: TPromotionPickerItem[], pr) => {
        const prItem: TPromotionPickerItem = {
          ...pr,
          isSelected: selectedItem?.id === pr.id,
        };

        prev.push(prItem);
        return prev;
      }, []),
    );
  }, [data, selectedItem]);

  const onPressBack = () => {
    navigation.goBack();
    return true;
  };

  const onPressItem = (item: PromotionProgram) => {
    setSelectedItem(preState => {
      if (!preState?.id || preState.id !== item.id) return item;
      return undefined;
    });
  };

  const renderItem: ListRenderItem<PromotionProgram> = ({ item, index }) => {
    return (
      <PromotionPickerItem
        data={item}
        index={index}
        style={styles.item}
        onPress={onPressItem}
      />
    );
  };

  const submit = async () => {
    if (selectedItem && (filter?.sale_order_id || filter?.pos_order_id)) {
      let productGift: ProductGift | undefined = undefined;
      try {
        if (filter?.sale_order_id) {
          const { response } = await fetchSaleOrderProductGifts.mutateAsync({
            id: filter.sale_order_id,
            promotionProgramId: selectedItem.id,
          });
          productGift = response?.product_gift;
        } else if (filter?.pos_order_id) {
          const { response } = await fetchPosOrderProductGifts.mutateAsync({
            id: filter.pos_order_id,
            promotionProgramId: selectedItem.id,
          });
          productGift = response?.product_gift;
        }

        if (productGift?.wizard_id) {
          navigation.dispatch(
            StackActions.replace(SCREEN.PROMOTION_GIFTS_PICKER, {
              productGift,
            }),
          );
          return;
        }
      } catch (error) {
        console.log(`error`, error);
      }
    }
    onSelected?.(selectedItem);
    onPressBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Chương trình khuyến mại" />
      <FlashList
        data={promotions}
        renderItem={renderItem}
        estimatedItemSize={120}
        contentContainerStyle={styles.scrollContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          isRefetching || isFetching ? null : (
            <ListEmpty
              text="Hiện tại chưa có chương trình khuyến mãi nào có thể áp dụng cho đơn hàng này ..."
              textStyle={{ maxWidth: dimensions.width * 0.65 }}
            />
          )
        }
        onEndReachedThreshold={0.5}
      />

      <View style={styles.footer}>
        <Button text="Xong" onPress={submit} />
      </View>
    </View>
  );
};

export default PromotionsPickerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  item: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});
